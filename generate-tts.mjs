// Run with: node /Users/jackie/src/superbuilder/generate-tts.mjs
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire("/Users/jackie/src/superbuilder/app/package.json");
const { S3Client, HeadObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
const envPath = "/Users/jackie/src/superbuilder/app/.env.local";
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  let val = trimmed.slice(eqIdx + 1);
  // Strip surrounding quotes if present
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL_ID = "eleven_multilingual_v2";
const BUCKET = "fraction-friends-tts-cache";
const REGION = "us-west-2";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY not found in .env.local");
  process.exit(1);
}

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function computeHash(text) {
  const input = `${VOICE_ID}:${MODEL_ID}:${text}`;
  return createHash("sha256").update(input).digest("hex");
}

async function checkS3Exists(hash) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: `${hash}.mp3` }));
    return true;
  } catch (e) {
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw e;
  }
}

async function generateTTS(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`ElevenLabs API error ${resp.status}: ${body}`);
  }
  const arrayBuf = await resp.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function uploadToS3(hash, audioBuffer) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${hash}.mp3`,
      Body: audioBuffer,
      ContentType: "audio/mpeg",
    })
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Extract tutorText values (reused from check-tts.mjs)
// ---------------------------------------------------------------------------
function extractTutorTexts(filePath) {
  const src = readFileSync(filePath, "utf-8");
  const results = [];
  const lines = src.split("\n");
  let currentId = null;

  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/id:\s*"([^"]+)"/);
    if (idMatch) {
      currentId = idMatch[1];
    }

    const ttMatch = lines[i].match(/tutorText:\s*$/);
    const ttMatchInline = lines[i].match(/tutorText:\s*"((?:[^"\\]|\\.)*)"/);
    const ttMatchInlineSingle = lines[i].match(/tutorText:\s*'((?:[^'\\]|\\.)*)'/);

    if (ttMatchInline) {
      let fullText = ttMatchInline[1];
      let j = i + 1;
      while (j < lines.length) {
        const contMatch = lines[j].match(/^\s*\+\s*"((?:[^"\\]|\\.)*)"/);
        if (contMatch) {
          fullText += contMatch[1];
          j++;
        } else {
          break;
        }
      }
      fullText = fullText.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
      results.push({ id: currentId, text: fullText });
    } else if (ttMatchInlineSingle) {
      let fullText = ttMatchInlineSingle[1];
      let j = i + 1;
      while (j < lines.length) {
        const contMatch = lines[j].match(/^\s*\+\s*'((?:[^'\\]|\\.)*)'/);
        if (contMatch) {
          fullText += contMatch[1];
          j++;
        } else {
          break;
        }
      }
      fullText = fullText.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
      results.push({ id: currentId, text: fullText });
    } else if (ttMatch) {
      let j = i + 1;
      let fullText = "";
      while (j < lines.length) {
        const strMatch = lines[j].match(/^\s*(?:\+\s*)?"((?:[^"\\]|\\.)*)"/);
        const strMatchSingle = lines[j].match(/^\s*(?:\+\s*)?'((?:[^'\\]|\\.)*)'/);
        if (strMatch) {
          fullText += strMatch[1];
          j++;
        } else if (strMatchSingle) {
          fullText += strMatchSingle[1];
          j++;
        } else {
          break;
        }
      }
      if (fullText) {
        fullText = fullText.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
        results.push({ id: currentId, text: fullText });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("TTS Audio Generator");
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Region: ${REGION}`);
  console.log(`Voice:  ${VOICE_ID}`);
  console.log(`Model:  ${MODEL_ID}`);
  console.log();

  // 1. Extract all tutorTexts
  const files = [
    { name: "lessonData-storyB.ts", path: "/Users/jackie/src/superbuilder/app/src/app/lib/lessonData-storyB.ts" },
    { name: "lessonData-equiv.ts", path: "/Users/jackie/src/superbuilder/app/src/app/lib/lessonData-equiv.ts" },
  ];

  const allTexts = [];
  for (const f of files) {
    const texts = extractTutorTexts(f.path);
    console.log(`${f.name}: ${texts.length} tutorText entries`);
    allTexts.push(...texts);
  }

  // Deduplicate by text content
  const seen = new Set();
  const uniqueTexts = [];
  for (const entry of allTexts) {
    if (!seen.has(entry.text)) {
      seen.add(entry.text);
      uniqueTexts.push(entry);
    }
  }
  console.log(`\nTotal: ${allTexts.length} entries, ${uniqueTexts.length} unique texts`);

  // 2. Check which are missing from S3
  console.log("\nChecking S3 for existing files...");
  const missing = [];
  const existing = [];

  for (let i = 0; i < uniqueTexts.length; i += 10) {
    const batch = uniqueTexts.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async (entry) => {
        const hash = computeHash(entry.text);
        const exists = await checkS3Exists(hash);
        return { ...entry, hash, exists };
      })
    );
    for (const r of results) {
      if (r.exists) existing.push(r);
      else missing.push(r);
    }
  }

  console.log(`Already in S3: ${existing.length}`);
  console.log(`Missing:       ${missing.length}`);

  if (missing.length === 0) {
    console.log("\nAll TTS audio files already exist in S3. Nothing to do.");
    return;
  }

  // 3. Generate and upload missing files
  console.log(`\nGenerating ${missing.length} TTS files...\n`);
  let generated = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < missing.length; i++) {
    const entry = missing[i];
    const preview = entry.text.length > 60 ? entry.text.slice(0, 60) + "..." : entry.text;
    console.log(`[${i + 1}/${missing.length}] Generating: ${preview}`);

    try {
      const audioBuffer = await generateTTS(entry.text);
      console.log(`  -> Got ${(audioBuffer.length / 1024).toFixed(1)} KB audio, uploading to S3...`);

      await uploadToS3(entry.hash, audioBuffer);
      console.log(`  -> Uploaded as ${entry.hash}.mp3`);
      generated++;
    } catch (err) {
      console.error(`  -> FAILED: ${err.message}`);
      failures.push({ id: entry.id, text: preview, error: err.message });
      failed++;
    }

    // Rate limit delay (skip after last item)
    if (i < missing.length - 1) {
      await sleep(500);
    }
  }

  // 4. Summary
  console.log(`\n${"=".repeat(70)}`);
  console.log("SUMMARY");
  console.log(`${"=".repeat(70)}`);
  console.log(`Already existed: ${existing.length}`);
  console.log(`Generated:       ${generated}`);
  console.log(`Failed:          ${failed}`);
  console.log(`Total:           ${uniqueTexts.length}`);

  if (failures.length > 0) {
    console.log("\nFailed entries:");
    for (const f of failures) {
      console.log(`  [${f.id}] ${f.text}`);
      console.log(`    Error: ${f.error}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
