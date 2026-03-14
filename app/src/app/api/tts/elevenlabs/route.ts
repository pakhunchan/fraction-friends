import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Jessica — Playful, Bright, Warm (great for a kids' tutor)
const DEFAULT_VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

/** Build S3 client — uses OIDC on Vercel, static credentials locally */
function createS3Client(): S3Client {
  const region = process.env.AWS_REGION ?? "us-west-2";

  // OIDC path (Vercel production) — use the credentials provider package
  if (process.env.AWS_ROLE_ARN) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { awsCredentialsProvider } = require("@vercel/oidc-aws-credentials-provider");
      return new S3Client({
        region,
        credentials: awsCredentialsProvider({
          roleArn: process.env.AWS_ROLE_ARN,
        }),
      });
    } catch {
      console.warn("OIDC credentials provider not available, falling back to static credentials");
    }
  }

  // Fallback to static credentials (local dev)
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

const s3 = createS3Client();
const S3_BUCKET = process.env.S3_TTS_CACHE_BUCKET!;

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { text, voiceId, modelId } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const voice = voiceId || DEFAULT_VOICE_ID;
  const model = modelId || DEFAULT_MODEL_ID;

  // --- S3 cache lookup ---
  const hash = createHash("sha256").update(`${voice}:${model}:${text}`).digest("hex");
  const s3Key = `${hash}.mp3`;

  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }),
    );
    const bytes = await obj.Body!.transformToByteArray();
    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "X-TTS-Cache": "HIT",
      },
    });
  } catch {
    // Cache miss — fall through to ElevenLabs
    console.warn("S3 cache read error:");
  }

  // --- ElevenLabs API call ---
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;
  const elRes = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!elRes.ok) {
    const errorText = await elRes.text();
    console.error("ElevenLabs error:", elRes.status, errorText);
    return NextResponse.json(
      { error: "ElevenLabs API error", details: errorText },
      { status: elRes.status },
    );
  }

  const audioBuffer = await elRes.arrayBuffer();
  const audioBytes = new Uint8Array(audioBuffer);

  // Write to S3 cache
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: audioBytes,
        ContentType: "audio/mpeg",
      }),
    );
  } catch (err) {
    console.warn("Failed to write TTS cache to S3:", err);
  }

  return new NextResponse(audioBytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "X-TTS-Cache": "MISS",
    },
  });
}
