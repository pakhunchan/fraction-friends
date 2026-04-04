// Run with: NODE_PATH=/Users/jackie/src/superbuilder/app/node_modules node /Users/jackie/src/superbuilder/check-tts.mjs
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

// Load .env.local
const envPath = "/Users/jackie/src/superbuilder/app/.env.local";
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const val = trimmed.slice(eqIdx + 1);
  process.env[key] = val;
}

const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL_ID = "eleven_multilingual_v2";
const BUCKET = process.env.S3_TTS_CACHE_BUCKET || "fraction-friends-tts-cache";
const REGION = process.env.AWS_REGION || "us-west-2";

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function computeHash(text) {
  const input = `${VOICE_ID}:${MODEL_ID}:${text}`;
  return createHash("sha256").update(input).digest("hex");
}

async function checkS3Exists(hash) {
  try {
    await s3.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: `${hash}.mp3` })
    );
    return true;
  } catch (e) {
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw e;
  }
}

/**
 * Parse tutorText values from a TypeScript lesson data file.
 * The files use string concatenation like:
 *   tutorText:
 *     "line one "
 *     + "line two",
 * or single-line:
 *   tutorText: "all in one line",
 *
 * We also capture the step id from context.
 */
function extractTutorTexts(filePath) {
  const src = readFileSync(filePath, "utf-8");
  const results = [];

  // Match each step block: "stepId": { ... }
  // We'll find all tutorText values and associate them with their step id.
  const stepRegex = /"([^"]+)":\s*\{[^}]*?id:\s*"([^"]+)"[\s\S]*?(?=\n  "[\w-]+":\s*\{|\n\};)/g;

  // Simpler approach: find all tutorText assignments and the nearest preceding id
  const lines = src.split("\n");
  let currentId = null;

  for (let i = 0; i < lines.length; i++) {
    // Track current step id
    const idMatch = lines[i].match(/id:\s*"([^"]+)"/);
    if (idMatch) {
      currentId = idMatch[1];
    }

    // Check for tutorText start
    const ttMatch = lines[i].match(/tutorText:\s*$/);
    const ttMatchInline = lines[i].match(/tutorText:\s*"((?:[^"\\]|\\.)*)"/);
    const ttMatchInlineSingle = lines[i].match(/tutorText:\s*'((?:[^'\\]|\\.)*)'/);

    if (ttMatchInline) {
      // Single line double-quoted, but could have + continuations
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
      // Unescape
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
      // tutorText on its own line, value starts on next line
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

async function processGame(name, filePath) {
  const texts = extractTutorTexts(filePath);
  console.log(`\n${"=".repeat(70)}`);
  console.log(`${name}`);
  console.log(`${"=".repeat(70)}`);
  console.log(`Total tutorText entries: ${texts.length}\n`);

  const found = [];
  const missing = [];

  // Check in batches of 10 to avoid hammering S3
  for (let i = 0; i < texts.length; i += 10) {
    const batch = texts.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async (entry) => {
        const hash = computeHash(entry.text);
        const exists = await checkS3Exists(hash);
        return { ...entry, hash, exists };
      })
    );
    for (const r of results) {
      if (r.exists) found.push(r);
      else missing.push(r);
    }
  }

  console.log(`Found in S3:   ${found.length}`);
  console.log(`Missing in S3: ${missing.length}`);

  if (missing.length > 0) {
    console.log(`\nMISSING audio files:`);
    for (const m of missing) {
      const preview = m.text.length > 100 ? m.text.slice(0, 100) + "..." : m.text;
      console.log(`  [${m.id}] ${preview}`);
      console.log(`    hash: ${m.hash}`);
    }
  }

  if (found.length > 0) {
    console.log(`\nFOUND audio files (${found.length}):`);
    for (const f of found) {
      const preview = f.text.length > 80 ? f.text.slice(0, 80) + "..." : f.text;
      console.log(`  [${f.id}] ${preview}`);
    }
  }

  return { total: texts.length, found: found.length, missing: missing.length };
}

async function main() {
  console.log("TTS Cache Check");
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Region: ${REGION}`);
  console.log(`Voice:  ${VOICE_ID}`);
  console.log(`Model:  ${MODEL_ID}`);

  const storyB = await processGame(
    "Basic Game (Midnight Snack) - lessonData-storyB.ts",
    "/Users/jackie/src/superbuilder/app/src/app/lib/lessonData-storyB.ts"
  );

  const equiv = await processGame(
    "Equivalence Game (Cozy Kitchen) - lessonData-equiv.ts",
    "/Users/jackie/src/superbuilder/app/src/app/lib/lessonData-equiv.ts"
  );

  const equivV2 = await processGame(
    "Equivalence V2 Game - lessonData-equiv-v2.ts",
    "/Users/jackie/src/superbuilder/app/src/app/lib/lessonData-equiv-v2.ts"
  );

  console.log(`\n${"=".repeat(70)}`);
  console.log("SUMMARY");
  console.log(`${"=".repeat(70)}`);
  console.log(`Basic:       ${storyB.found}/${storyB.total} found, ${storyB.missing} missing`);
  console.log(`Equivalence: ${equiv.found}/${equiv.total} found, ${equiv.missing} missing`);
  console.log(`Equiv V2:    ${equivV2.found}/${equivV2.total} found, ${equivV2.missing} missing`);
  const totalFound = storyB.found + equiv.found + equivV2.found;
  const totalAll = storyB.total + equiv.total + equivV2.total;
  const totalMissing = storyB.missing + equiv.missing + equivV2.missing;
  console.log(`Total:       ${totalFound}/${totalAll} found, ${totalMissing} missing`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
