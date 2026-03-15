#!/usr/bin/env node
// generate-story-viewer.js
// Reads all 6 lessonData.ts files, walks the happy path + wrong branches,
// and generates a beautiful dark-theme side-by-side HTML comparison viewer.

const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE = path.resolve(__dirname);
const ATTEMPTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const OUTPUT = path.resolve(__dirname, "../gallery/story-viewer.html");

const NARRATOR_STYLES = {
  1: { name: "Attempt 1", style: "Casual & Friendly", emoji: "😊", itemEmoji: "🍪", itemName: "cookies" },
  2: { name: "Attempt 2", style: "Cookie Character (Cookie's POV)", emoji: "🍪", itemEmoji: "🍪", itemName: "cookies" },
  3: { name: "Attempt 3", style: "Game Show Host", emoji: "🎤", itemEmoji: "🍪", itemName: "cookies" },
  4: { name: "Attempt 4", style: "Gentle Wise Professor (Mister Rogers)", emoji: "🎓", itemEmoji: "🍪", itemName: "cookies" },
  5: { name: "Attempt 5", style: "Silly Comedian", emoji: "😂", itemEmoji: "🍪", itemName: "cookies" },
  6: { name: "Attempt 6", style: "Fantasy RPG Quest Guide", emoji: "⚔️", itemEmoji: "🍪", itemName: "cookies" },
  7: { name: "Attempt 7", style: "Excited Party Host (Pizza)", emoji: "🍕", itemEmoji: "🍕", itemName: "pizza slices" },
  8: { name: "Attempt 8", style: "Pirate Captain (Treasure Coins)", emoji: "🏴‍☠️", itemEmoji: "🪙", itemName: "gold coins" },
  9: { name: "Attempt 9", style: "Cheerful Teacher (Star Stickers)", emoji: "⭐", itemEmoji: "⭐", itemName: "star stickers" },
  10: { name: "Attempt 10", style: "Chill Picnic DJ (Watermelon)", emoji: "🍉", itemEmoji: "🍉", itemName: "watermelon slices" },
};

const TYPE_COLORS = {
  narrate:            { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd", label: "narrate" },
  choice:             { bg: "#2d1b4e", border: "#8b5cf6", text: "#c4b5fd", label: "choice" },
  distribute:         { bg: "#1a3a2a", border: "#22c55e", text: "#86efac", label: "distribute" },
  slice:              { bg: "#3a2010", border: "#f97316", text: "#fdba74", label: "slice" },
  "distribute-halves":{ bg: "#1e3a30", border: "#10b981", text: "#6ee7b7", label: "dist-halves" },
  "show-number":      { bg: "#1a2e4a", border: "#60a5fa", text: "#bfdbfe", label: "show-number" },
  "show-fraction":    { bg: "#3a1a3a", border: "#ec4899", text: "#f9a8d4", label: "show-fraction" },
};

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseSteps(filePath) {
  const src = fs.readFileSync(filePath, "utf8");

  // Find the start of the lessonSteps object
  const startMatch = src.match(/export\s+const\s+lessonSteps[^=]*=\s*\{/);
  if (!startMatch) throw new Error(`Could not find lessonSteps in ${filePath}`);

  // Walk forward from the opening brace to find the matching closing brace
  const startIdx = startMatch.index + startMatch[0].length - 1; // position of the opening {
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }

  // Synthesize a fake match object so rest of code works
  const match = [null, src.slice(startIdx + 1, endIdx)];

  let body = match[1];

  // Strip TypeScript type annotations: `: SomeType` before assignment values
  // Remove "export type ...", "export interface ...", comments are fine
  // We only need the body of lessonSteps

  // Remove single-line // comments (but not inside strings)
  // Actually we need to be careful — just do simple transforms for the known patterns

  // Strip TypeScript property type annotations like: tutorEmotion: "excited", — these are valid JS
  // The only TS things inside the object are identifiers used as values (string literals are fine)
  // Most TS-specific things are outside the object body. The object body itself is valid JS except:
  // - No issues: all values are string literals, numbers, booleans, arrays of objects

  // Attempt to eval as JS object
  // Wrap in parens for eval
  let jsBody = `({\n${body}\n})`;

  let steps;
  try {
    // Use Function constructor to avoid eval's scope issues
    steps = new Function(`"use strict"; return ${jsBody}`)();
  } catch (e) {
    // Fallback: line-by-line extraction
    steps = extractStepsLineByLine(src);
  }

  return steps;
}

function extractStepsLineByLine(src) {
  // Robust fallback: parse step blocks by finding quoted keys at the top level
  const steps = {};

  // Find all step blocks: "stepId": { ... }
  // We'll use a simple bracket-counting approach
  const lines = src.split("\n");
  let inSteps = false;
  let depth = 0;
  let currentKey = null;
  let blockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start of lessonSteps object
    if (!inSteps && /export\s+const\s+lessonSteps/.test(line)) {
      inSteps = true;
      depth = 0;
      continue;
    }

    if (!inSteps) continue;

    // Count brackets
    for (const ch of line) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
    }

    // At depth 1, we're inside lessonSteps but not inside a step
    // Look for step keys: "stepId": {
    if (depth === 1 && !currentKey) {
      const keyMatch = line.match(/^\s*"([^"]+)"\s*:\s*\{/);
      if (keyMatch) {
        currentKey = keyMatch[1];
        blockLines = [line];
        // Account for the { we just saw
      }
    } else if (currentKey) {
      blockLines.push(line);
      // If we're back to depth 1, the block just closed
      if (depth === 1) {
        // Parse this block
        const block = blockLines.join("\n");
        steps[currentKey] = parseStepBlock(currentKey, block);
        currentKey = null;
        blockLines = [];
      }
    }

    // End of lessonSteps
    if (depth === 0 && inSteps) break;
  }

  return steps;
}

function parseStepBlock(id, block) {
  const step = { id };

  // Extract type
  const typeM = block.match(/\btype\s*:\s*"([^"]+)"/);
  if (typeM) step.type = typeM[1];

  // Extract tutorText (may span multiple lines with + concatenation)
  const tutorM = block.match(/tutorText\s*:\s*([\s\S]*?)(?=,\s*\n\s*(?:taskHeader|choices|next|cookieCount|characterCount|expectedPerPerson|showNumber|showFractionNum|showFractionDen|wholeNumber|allowKnife|sfx|tutorEmotion|id|type|\})|$)/);
  if (tutorM) {
    let raw = tutorM[1].trim();
    // Join multi-line string concatenations
    raw = raw.replace(/"\s*\+\s*"/g, "").replace(/"\s*\+\s*\n\s*"/g, "");
    // Extract string content
    const strMatch = raw.match(/^"([\s\S]*)"$/);
    if (strMatch) step.tutorText = strMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    else {
      // Try to grab all quoted segments
      const segments = [];
      const re = /"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = re.exec(raw)) !== null) segments.push(m[1]);
      if (segments.length) step.tutorText = segments.join("").replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
  }

  // Extract taskHeader
  const headerM = block.match(/taskHeader\s*:\s*"([^"]+)"/);
  if (headerM) step.taskHeader = headerM[1];

  // Extract next
  const nextM = block.match(/\bnext\s*:\s*"([^"]+)"/);
  if (nextM) step.next = nextM[1];

  // Extract sfx
  const sfxM = block.match(/\bsfx\s*:\s*"([^"]+)"/);
  if (sfxM) step.sfx = sfxM[1];

  // Extract tutorEmotion
  const emotionM = block.match(/tutorEmotion\s*:\s*"([^"]+)"/);
  if (emotionM) step.tutorEmotion = emotionM[1];

  // Extract showNumber
  const showNumM = block.match(/showNumber\s*:\s*"([^"]+)"/);
  if (showNumM) step.showNumber = showNumM[1];

  // Extract showFractionNum / showFractionDen / wholeNumber
  const snM = block.match(/showFractionNum\s*:\s*(\d+)/);
  if (snM) step.showFractionNum = parseInt(snM[1]);
  const sdM = block.match(/showFractionDen\s*:\s*(\d+)/);
  if (sdM) step.showFractionDen = parseInt(sdM[1]);
  const wnM = block.match(/wholeNumber\s*:\s*(\d+)/);
  if (wnM) step.wholeNumber = parseInt(wnM[1]);

  // Extract cookieCount / characterCount / expectedPerPerson
  const ccM = block.match(/cookieCount\s*:\s*(\d+)/);
  if (ccM) step.cookieCount = parseInt(ccM[1]);
  const charM = block.match(/characterCount\s*:\s*(\d+)/);
  if (charM) step.characterCount = parseInt(charM[1]);
  const eppM = block.match(/expectedPerPerson\s*:\s*(\d+)/);
  if (eppM) step.expectedPerPerson = parseInt(eppM[1]);

  // Extract allowKnife
  if (/allowKnife\s*:\s*true/.test(block)) step.allowKnife = true;

  // Extract choices array
  const choicesSection = block.match(/choices\s*:\s*\[([\s\S]*?)\]/);
  if (choicesSection) {
    step.choices = [];
    const choicesText = choicesSection[1];
    // Each choice: { label: "...", next: "...", correct?: true }
    const choiceRe = /\{\s*label\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*next\s*:\s*"([^"]+)"([^}]*)\}/g;
    let cm;
    while ((cm = choiceRe.exec(choicesText)) !== null) {
      const choice = { label: cm[1].replace(/\\"/g, '"'), next: cm[2] };
      if (/correct\s*:\s*true/.test(cm[3])) choice.correct = true;
      step.choices.push(choice);
    }
  }

  return step;
}

// ─── Path Walker ──────────────────────────────────────────────────────────────

function walkHappyPath(steps) {
  // Find the first step: prefer "start", else first key
  const keys = Object.keys(steps);
  let currentId = keys.includes("start") ? "start" : keys[0];

  const visited = new Set();
  const path = [];

  while (currentId && currentId !== "end" && !visited.has(currentId)) {
    visited.add(currentId);
    const step = steps[currentId];
    if (!step) break;

    // Collect wrong-answer branches (1 level deep)
    const wrongBranches = [];
    if (step.choices) {
      for (const choice of step.choices) {
        if (!choice.correct) {
          const wrongStep = steps[choice.next];
          if (wrongStep && !visited.has(choice.next)) {
            wrongBranches.push({ choice, step: wrongStep });
          }
        }
      }
    }

    path.push({ step, wrongBranches });

    // Advance: follow correct choice or next
    if (step.choices) {
      const correctChoice = step.choices.find(c => c.correct);
      if (correctChoice) {
        currentId = correctChoice.next;
      } else {
        // All choices lead to same place (e.g. "I think so!" / "Not yet!") — take first
        currentId = step.choices[0]?.next;
      }
    } else {
      currentId = step.next;
    }
  }

  return path;
}

// ─── HTML Generator ───────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderStep(step, wrongBranches, index, attemptNum) {
  const typeInfo = TYPE_COLORS[step.type] || TYPE_COLORS.narrate;

  let html = `<div class="step-card" data-type="${escapeHtml(step.type)}" id="step-${escapeHtml(step.id)}" style="border-color:${typeInfo.border}; background:${typeInfo.bg}">`;

  // Step number + type badge
  html += `<div class="step-header">`;
  html += `<span class="step-num">#${index + 1}</span>`;
  html += `<span class="type-badge" style="background:${typeInfo.border}22; color:${typeInfo.text}; border:1px solid ${typeInfo.border}">${escapeHtml(typeInfo.label)}</span>`;

  // Tags row
  const tags = [];
  if (step.sfx) tags.push(`<span class="tag sfx-tag">🔊 ${escapeHtml(step.sfx)}</span>`);
  if (step.tutorEmotion) tags.push(`<span class="tag emotion-tag">😄 ${escapeHtml(step.tutorEmotion)}</span>`);
  if (tags.length) html += `<span class="tags-row">${tags.join("")}</span>`;

  html += `</div>`; // step-header

  // Step ID
  html += `<div class="step-id">${escapeHtml(step.id)}</div>`;

  // Task header (for distribute steps)
  if (step.taskHeader) {
    html += `<div class="task-header">📋 ${escapeHtml(step.taskHeader)}</div>`;
  }

  // Item/character info for distribute steps
  const itemInfo = NARRATOR_STYLES[attemptNum] || { itemEmoji: "🍪", itemName: "cookies" };
  if (step.cookieCount !== undefined) {
    html += `<div class="distribute-info">${itemInfo.itemEmoji} ${step.cookieCount} ${itemInfo.itemName} → 👥 ${step.characterCount} people`;
    if (step.expectedPerPerson !== undefined) html += ` (${step.expectedPerPerson} each)`;
    if (step.allowKnife) html += ` 🔪`;
    html += `</div>`;
  }

  // Fraction/number display
  if (step.type === "show-fraction" && step.showFractionNum !== undefined) {
    html += `<div class="fraction-display">`;
    if (step.wholeNumber !== undefined) html += `<span class="whole-num">${step.wholeNumber}</span>`;
    html += `<span class="fraction"><span class="frac-num">${step.showFractionNum}</span><span class="frac-bar"></span><span class="frac-den">${step.showFractionDen}</span></span>`;
    html += `</div>`;
  }
  if (step.type === "show-number" && step.showNumber) {
    html += `<div class="number-display">${escapeHtml(step.showNumber)}</div>`;
  }

  // tutorText
  if (step.tutorText) {
    html += `<div class="tutor-text">${escapeHtml(step.tutorText)}</div>`;
  }

  // Choices
  if (step.choices && step.choices.length) {
    html += `<div class="choices">`;
    for (const choice of step.choices) {
      const isCorrect = !!choice.correct;
      html += `<div class="choice ${isCorrect ? "correct" : "wrong"}">`;
      html += `<span class="choice-icon">${isCorrect ? "✓" : "✗"}</span>`;
      html += `<span class="choice-label">${escapeHtml(choice.label)}</span>`;
      html += `<span class="choice-arrow">→ <code>${escapeHtml(choice.next)}</code></span>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  // Wrong-answer branches (1 level deep)
  if (wrongBranches && wrongBranches.length) {
    html += `<div class="wrong-branches">`;
    html += `<div class="wrong-branches-header">Wrong-answer responses:</div>`;
    for (const { choice, step: ws } of wrongBranches) {
      html += `<div class="wrong-branch">`;
      html += `<div class="wrong-branch-choice">✗ "${escapeHtml(choice.label)}"</div>`;
      if (ws.tutorText) {
        html += `<div class="wrong-branch-text">${escapeHtml(ws.tutorText)}</div>`;
      }
      if (ws.sfx) html += `<span class="tag sfx-tag small">🔊 ${escapeHtml(ws.sfx)}</span>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  // Connector arrow (not on last step)
  html += `<div class="connector">↓</div>`;

  html += `</div>`; // step-card

  return html;
}

function renderColumn(attemptNum, steps, happyPath) {
  const info = NARRATOR_STYLES[attemptNum];
  const totalSteps = Object.keys(steps).length;

  let html = `<div class="column" id="col-${attemptNum}">`;

  // Column header
  html += `<div class="col-header">`;
  html += `<div class="col-title">${info.emoji} ${escapeHtml(info.name)}</div>`;
  html += `<div class="col-style">${escapeHtml(info.style)}</div>`;
  html += `<div class="col-stats">`;
  html += `<span class="stat-badge">${happyPath.length} happy-path steps</span>`;
  html += `<span class="stat-badge secondary">${totalSteps} total steps</span>`;
  html += `</div>`;
  html += `</div>`; // col-header

  // Steps
  html += `<div class="steps">`;
  happyPath.forEach(({ step, wrongBranches }, i) => {
    html += renderStep(step, wrongBranches, i, attemptNum);
  });
  html += `<div class="end-marker">⭐ END</div>`;
  html += `</div>`; // steps

  html += `</div>`; // column

  return html;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("Reading lessonData.ts files...");

  const allData = ATTEMPTS.map(n => {
    const filePath = path.join(BASE, `attempt${n}`, "lessonData.ts");
    console.log(`  Parsing attempt${n}...`);

    let steps;
    try {
      steps = parseSteps(filePath);
    } catch (e) {
      console.error(`  ERROR parsing attempt${n}: ${e.message}`);
      steps = {};
    }

    const stepCount = Object.keys(steps).length;
    console.log(`    Found ${stepCount} steps`);

    const happyPath = walkHappyPath(steps);
    console.log(`    Happy path: ${happyPath.length} steps`);

    return { n, steps, happyPath };
  });

  console.log("\nGenerating HTML...");

  // Compute summary stats for header
  const totalStepCounts = allData.map(d => Object.keys(d.steps).length);
  const happyPathCounts = allData.map(d => d.happyPath.length);

  const columnsHtml = allData.map(({ n, steps, happyPath }) =>
    renderColumn(n, steps, happyPath)
  ).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Story Attempt Viewer — Kids Fraction App</title>
  <style>
    /* ─── Reset & Base ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1729;
      --bg2: #151e35;
      --bg3: #1a2440;
      --border: #1e2d4a;
      --text: #c8d6f0;
      --text-dim: #6b7fa3;
      --text-bright: #e8f0ff;
      --accent: #3b82f6;
      --radius: 8px;
      --col-width: 420px;
    }

    html { font-size: 14px; height: 100%; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ─── Page Header ──────────────────────────────────────────── */
    .page-header {
      background: var(--bg2);
      border-bottom: 2px solid var(--border);
      padding: 20px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .page-header h1 {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-bright);
      margin-bottom: 6px;
    }

    .page-header p {
      color: var(--text-dim);
      font-size: 0.85rem;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* ─── Column Container ─────────────────────────────────────── */
    .columns-wrapper {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 0;
      overflow: auto;
      padding: 0;
      flex: 1;
      min-height: 0;
    }

    /* ─── Single Column ────────────────────────────────────────── */
    .column {
      flex: 0 0 var(--col-width);
      min-width: var(--col-width);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    .column:last-child { border-right: none; }

    .col-header {
      background: var(--bg3);
      border-bottom: 2px solid var(--border);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    /* Each column header gets a distinct top accent color */
    #col-1 .col-header { border-top: 3px solid #3b82f6; }
    #col-2 .col-header { border-top: 3px solid #22c55e; }
    #col-3 .col-header { border-top: 3px solid #f59e0b; }
    #col-4 .col-header { border-top: 3px solid #a78bfa; }
    #col-5 .col-header { border-top: 3px solid #f43f5e; }
    #col-6 .col-header { border-top: 3px solid #06b6d4; }
    #col-7 .col-header { border-top: 3px solid #f97316; }
    #col-8 .col-header { border-top: 3px solid #eab308; }
    #col-9 .col-header { border-top: 3px solid #14b8a6; }
    #col-10 .col-header { border-top: 3px solid #ec4899; }

    .col-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-bright);
      margin-bottom: 3px;
    }

    .col-style {
      font-size: 0.78rem;
      color: var(--text-dim);
      font-style: italic;
      margin-bottom: 8px;
    }

    .col-stats {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .stat-badge {
      font-size: 0.72rem;
      background: #1e3a5f;
      color: #93c5fd;
      border: 1px solid #3b82f6;
      border-radius: 4px;
      padding: 2px 7px;
    }

    .stat-badge.secondary {
      background: #1a2e1a;
      color: #86efac;
      border-color: #22c55e;
    }

    /* ─── Steps Container ──────────────────────────────────────── */
    .steps {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ─── Step Card ────────────────────────────────────────────── */
    .step-card {
      border: 1px solid #2a3a5a;
      border-radius: var(--radius);
      padding: 12px;
      position: relative;
      margin-bottom: 0;
    }

    .step-card:hover {
      filter: brightness(1.08);
    }

    .connector {
      text-align: center;
      color: var(--text-dim);
      font-size: 1rem;
      line-height: 1.8;
      user-select: none;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 5px;
      flex-wrap: wrap;
    }

    .step-num {
      font-size: 0.68rem;
      color: var(--text-dim);
      font-variant-numeric: tabular-nums;
      min-width: 22px;
    }

    .type-badge {
      font-size: 0.68rem;
      font-weight: 600;
      border-radius: 4px;
      padding: 1px 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .tags-row {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 0.65rem;
      border-radius: 3px;
      padding: 1px 5px;
    }

    .sfx-tag { background: #1a2040; color: #818cf8; border: 1px solid #4f46e5; }
    .emotion-tag { background: #2a1a20; color: #fb7185; border: 1px solid #e11d48; }

    .step-id {
      font-size: 0.68rem;
      font-family: monospace;
      color: var(--text-dim);
      margin-bottom: 6px;
    }

    .task-header {
      font-size: 0.78rem;
      font-weight: 600;
      color: #fbbf24;
      background: #1a1500;
      border: 1px solid #92400e;
      border-radius: 4px;
      padding: 4px 8px;
      margin-bottom: 7px;
    }

    .distribute-info {
      font-size: 0.75rem;
      color: #86efac;
      background: #0a1a10;
      border-radius: 4px;
      padding: 3px 7px;
      margin-bottom: 6px;
    }

    /* Fraction display */
    .fraction-display {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 6px 0;
      padding: 6px 10px;
      background: #1a0a2a;
      border-radius: 6px;
      border: 1px solid #6d28d9;
    }

    .whole-num {
      font-size: 1.4rem;
      font-weight: 700;
      color: #e9d5ff;
    }

    .fraction {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .frac-num, .frac-den {
      font-size: 0.85rem;
      font-weight: 700;
      color: #e9d5ff;
      line-height: 1.2;
    }

    .frac-bar {
      width: 18px;
      height: 2px;
      background: #c4b5fd;
      margin: 1px 0;
    }

    .number-display {
      font-size: 1.5rem;
      font-weight: 700;
      color: #bfdbfe;
      text-align: center;
      padding: 6px 0;
    }

    /* Tutor text */
    .tutor-text {
      font-size: 0.82rem;
      color: var(--text);
      line-height: 1.55;
      margin: 6px 0;
    }

    /* Choices */
    .choices {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .choice {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      border-radius: 4px;
      padding: 5px 7px;
      font-size: 0.75rem;
    }

    .choice.correct {
      background: #0a1e0a;
      border: 1px solid #16a34a;
    }

    .choice.wrong {
      background: #1e0a0a;
      border: 1px solid #991b1b;
    }

    .choice-icon {
      flex-shrink: 0;
      font-weight: 700;
    }

    .choice.correct .choice-icon { color: #4ade80; }
    .choice.wrong .choice-icon { color: #f87171; }

    .choice-label {
      color: var(--text);
      flex: 1;
    }

    .choice-arrow {
      color: var(--text-dim);
      font-size: 0.68rem;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .choice-arrow code {
      background: #0d1a30;
      border-radius: 3px;
      padding: 0 4px;
      font-size: 0.65rem;
      color: #7dd3fc;
    }

    /* Wrong-answer branches */
    .wrong-branches {
      margin-top: 8px;
      border-top: 1px dashed #2a3a5a;
      padding-top: 6px;
    }

    .wrong-branches-header {
      font-size: 0.68rem;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 5px;
    }

    .wrong-branch {
      background: #1a0f0f;
      border: 1px solid #3d1a1a;
      border-radius: 4px;
      padding: 5px 7px;
      margin-bottom: 4px;
    }

    .wrong-branch-choice {
      font-size: 0.7rem;
      color: #f87171;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .wrong-branch-text {
      font-size: 0.73rem;
      color: #c0a0a0;
      font-style: italic;
      line-height: 1.45;
    }

    .tag.small { font-size: 0.6rem; margin-top: 3px; }

    /* End marker */
    .end-marker {
      text-align: center;
      color: #f59e0b;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 10px;
      background: #1a1000;
      border-radius: var(--radius);
      border: 1px solid #92400e;
      margin-top: 4px;
    }

    /* ─── Filter Controls ──────────────────────────────────────── */
    .controls {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      flex-wrap: wrap;
      align-items: center;
    }

    .controls label {
      font-size: 0.78rem;
      color: var(--text-dim);
    }

    .filter-btn {
      background: var(--bg3);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }

    .filter-btn:hover { background: #1e3050; border-color: #3b82f6; }
    .filter-btn.active { background: #1e3a5f; border-color: #3b82f6; color: #93c5fd; }

    /* ─── Scrollbar Styling ────────────────────────────────────── */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: #2a3a5a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }

    /* ─── Highlight ────────────────────────────────────────────── */
    .step-card.dimmed { opacity: 0.25; }

    /* ─── Responsive note ─────────────────────────────────────── */
    @media (max-width: 900px) {
      .page-header { position: static; }
      .col-header { position: static; }
    }
  </style>
</head>
<body>

<div class="page-header">
  <h1>🍪 Kids Fraction App — Story Attempt Viewer</h1>
  <p>Comparing 10 story attempts across different themes and narrator styles. Columns 1-6: cookie sharing. Columns 7-10: pizza, pirate treasure, star stickers, watermelon. Happy path shown with wrong-answer branches.</p>

  <div class="controls">
    <label>Filter by step type:</label>
    <button class="filter-btn active" onclick="filterType('all')">All</button>
    <button class="filter-btn" onclick="filterType('narrate')">narrate</button>
    <button class="filter-btn" onclick="filterType('choice')">choice</button>
    <button class="filter-btn" onclick="filterType('distribute')">distribute</button>
    <button class="filter-btn" onclick="filterType('slice')">slice</button>
    <button class="filter-btn" onclick="filterType('show-fraction')">show-fraction</button>
    <button class="filter-btn" onclick="filterType('show-number')">show-number</button>
    <button class="filter-btn" onclick="filterType('distribute-halves')">dist-halves</button>
  </div>

  <div class="legend">
    ${Object.entries(TYPE_COLORS).map(([type, c]) =>
      `<div class="legend-item"><div class="legend-dot" style="background:${c.border}"></div> ${type}</div>`
    ).join("\n    ")}
  </div>
</div>

<div class="columns-wrapper">
${columnsHtml}
</div>

<script>
  let currentFilter = 'all';

  function filterType(type) {
    currentFilter = type;

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide cards
    document.querySelectorAll('.step-card').forEach(card => {
      if (type === 'all') {
        card.classList.remove('dimmed');
      } else {
        const cardType = card.dataset.type;
        if (cardType === type) {
          card.classList.remove('dimmed');
        } else {
          card.classList.add('dimmed');
        }
      }
    });
  }
</script>

</body>
</html>`;

  // Replace the TYPE_COLORS legend template literal (it's already rendered above in columnsHtml)
  // The legend in the HTML needs to be static text — fix: we computed it during template

  fs.writeFileSync(OUTPUT, html, "utf8");

  const stats = fs.statSync(OUTPUT);
  const sizeKb = Math.round(stats.size / 1024);
  console.log(`\nDone! Output: ${OUTPUT}`);
  console.log(`File size: ${sizeKb} KB`);
  console.log(`\nPer-attempt summary:`);
  allData.forEach(({ n, steps, happyPath }) => {
    const info = NARRATOR_STYLES[n];
    console.log(`  Attempt ${n} (${info.style}): ${Object.keys(steps).length} total steps, ${happyPath.length} happy-path steps`);
  });
}

main();
