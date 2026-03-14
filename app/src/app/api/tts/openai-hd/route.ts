import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const DEFAULT_VOICE = "coral";
const MODEL = "gpt-4o-mini-tts";

const DEFAULT_INSTRUCTIONS =
  "Voice Affect: Bright, enthusiastic, and encouraging — like a beloved children's show host. " +
  "Tone: Warm, playful, and celebratory. " +
  "Pacing: Slightly upbeat, with dramatic slowing on key words for emphasis. " +
  "Emotion: Genuine excitement and wonder.";

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: { text?: string; voice?: string; instructions?: string };
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

  const voice = body.voice || DEFAULT_VOICE;
  const instructions = body.instructions || DEFAULT_INSTRUCTIONS;

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: text,
      voice,
      instructions,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(
      `OpenAI TTS HD API error: ${response.status} ${response.statusText}`,
      errorText,
    );
    return NextResponse.json(
      { error: `OpenAI TTS HD API error: ${response.status}` },
      { status: response.status },
    );
  }

  const audioBuffer = await response.arrayBuffer();

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
