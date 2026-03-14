import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Jessica -- Playful, Bright, Warm (great for a kids' tutor)
const DEFAULT_VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

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

  // Use the streaming endpoint with maximum latency optimization.
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=2&output_format=mp3_44100_128`;

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
      `ElevenLabs streaming API error: ${response.status} ${response.statusText}`,
      errorText,
    );
    return NextResponse.json(
      { error: `ElevenLabs API error: ${response.status}` },
      { status: response.status },
    );
  }

  // Pipe the ElevenLabs response body directly through to the client.
  // The body is a ReadableStream of audio/mpeg chunks.
  if (!response.body) {
    return NextResponse.json(
      { error: "No response body from ElevenLabs" },
      { status: 502 },
    );
  }

  return new NextResponse(response.body as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-store",
    },
  });
}
