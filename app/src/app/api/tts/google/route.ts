import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;

const DEFAULT_VOICE = "en-US-Studio-O";
const DEFAULT_SPEAKING_RATE = 1.05;
const DEFAULT_PITCH = 1.0;

export async function POST(request: NextRequest) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_CLOUD_TTS_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: {
    text?: string;
    voiceName?: string;
    speakingRate?: number;
    pitch?: number;
  };
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

  const voiceName = body.voiceName || DEFAULT_VOICE;
  const speakingRate = body.speakingRate ?? DEFAULT_SPEAKING_RATE;
  const pitch = body.pitch ?? DEFAULT_PITCH;

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: "en-US",
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate,
          pitch,
          sampleRateHertz: 24000,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(
      `Google Cloud TTS API error: ${response.status} ${response.statusText}`,
      errorText,
    );
    return NextResponse.json(
      { error: `Google Cloud TTS API error: ${response.status}` },
      { status: response.status },
    );
  }

  let result: { audioContent?: string };
  try {
    result = await response.json();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse Google TTS response" },
      { status: 502 },
    );
  }

  if (!result.audioContent) {
    return NextResponse.json(
      { error: "Google TTS returned no audio content" },
      { status: 502 },
    );
  }

  // Decode base64 audio into a binary buffer.
  const audioBuffer = Buffer.from(result.audioContent, "base64");

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
