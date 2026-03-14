import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  STSClient,
  AssumeRoleWithWebIdentityCommand,
} from "@aws-sdk/client-sts";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Jessica — Playful, Bright, Warm (great for a kids' tutor)
const DEFAULT_VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

/** Cached S3 client (refreshed when OIDC credentials expire) */
let cachedS3Client: S3Client | null = null;
let credentialsExpireAt = 0;

async function getS3Client(): Promise<S3Client> {
  const now = Date.now();

  // Return cached client if credentials are still valid (with 5-min buffer)
  if (cachedS3Client && now < credentialsExpireAt - 5 * 60 * 1000) {
    return cachedS3Client;
  }

  // Try OIDC first (Vercel production)
  if (process.env.VERCEL && process.env.AWS_ROLE_ARN) {
    try {
      const { getVercelOidcToken } = await import("@vercel/functions");
      const token = await getVercelOidcToken();
      const sts = new STSClient({
        region: process.env.AWS_REGION ?? "us-west-2",
      });
      const resp = await sts.send(
        new AssumeRoleWithWebIdentityCommand({
          RoleArn: process.env.AWS_ROLE_ARN,
          WebIdentityToken: token,
          RoleSessionName: "vercel-tts-cache",
        }),
      );
      const creds = resp.Credentials!;
      cachedS3Client = new S3Client({
        region: process.env.AWS_REGION ?? "us-west-2",
        credentials: {
          accessKeyId: creds.AccessKeyId!,
          secretAccessKey: creds.SecretAccessKey!,
          sessionToken: creds.SessionToken!,
        },
      });
      credentialsExpireAt = creds.Expiration
        ? creds.Expiration.getTime()
        : now + 55 * 60 * 1000;
      return cachedS3Client;
    } catch (err) {
      console.warn("OIDC credential fetch failed, falling back to static credentials:", err);
    }
  }

  // Fallback to static credentials (local dev)
  cachedS3Client = new S3Client({
    region: process.env.AWS_REGION ?? "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  credentialsExpireAt = Infinity;
  return cachedS3Client;
}

const S3_BUCKET = process.env.S3_TTS_CACHE_BUCKET!;

/** SHA-256 hash of text + voiceId + modelId to produce a unique cache key */
function cacheKey(text: string, voiceId: string, modelId: string): string {
  return createHash("sha256")
    .update(`${voiceId}:${modelId}:${text}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: { text?: string; voiceId?: string; modelId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json(
      { error: "Missing required field: text" },
      { status: 400 },
    );
  }

  const voiceId = body.voiceId || DEFAULT_VOICE_ID;
  const modelId = body.modelId || DEFAULT_MODEL_ID;

  // --- S3 cache lookup ---
  const hash = cacheKey(text, voiceId, modelId);
  const s3Key = `${hash}.mp3`;

  const s3 = await getS3Client();

  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }),
    );
    const bytes = await obj.Body!.transformToByteArray();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-TTS-Cache": "HIT",
      },
    });
  } catch (err: unknown) {
    const code = (err as { name?: string }).name;
    if (code !== "NoSuchKey") {
      console.warn("S3 cache read error:", err);
    }
    // Fall through to ElevenLabs API
  }

  // Not cached — call ElevenLabs
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.71,
        similarity_boost: 0.55,
        style: 0.0,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(
      `ElevenLabs API error: ${response.status} ${response.statusText}`,
      errorText,
    );
    return NextResponse.json(
      { error: `ElevenLabs API error: ${response.status}` },
      { status: response.status },
    );
  }

  const audioBuffer = await response.arrayBuffer();

  // Write to S3 cache
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: Buffer.from(audioBuffer),
        ContentType: "audio/mpeg",
      }),
    );
  } catch (err) {
    console.warn("Failed to write TTS cache to S3:", err);
    // Non-fatal — still serve the audio
  }

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-TTS-Cache": "MISS",
    },
  });
}
