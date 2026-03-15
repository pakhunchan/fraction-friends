import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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
  const { text, voiceId, modelId } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const voice = voiceId || DEFAULT_VOICE_ID;
  const model = modelId || DEFAULT_MODEL_ID;

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
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const errName = err instanceof Error ? (err as { name?: string }).name : "";
    if (errName === "NoSuchKey") {
      console.warn("TTS audio not found in S3:", s3Key, "— text:", text.substring(0, 80));
      return NextResponse.json(
        { error: "Audio not available" },
        { status: 404 },
      );
    }
    console.error("TTS S3 read error:", err);
    return NextResponse.json(
      { error: "Storage error" },
      { status: 500 },
    );
  }
}
