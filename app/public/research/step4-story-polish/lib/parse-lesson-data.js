// lib/parse-lesson-data.js
// Extracted parser, path walker, and shared constants from generate-story-viewer.js

const fs = require("fs");

// ─── Constants ───────────────────────────────────────────────────────────────

const NARRATOR_STYLES = {
  1: { name: "Attempt 1", style: "Casual & Friendly", emoji: "\u{1F60A}", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  2: { name: "Attempt 2", style: "Cookie Character (Cookie's POV)", emoji: "\u{1F36A}", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  3: { name: "Attempt 3", style: "Game Show Host", emoji: "\u{1F3A4}", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  4: { name: "Attempt 4", style: "Gentle Wise Professor (Mister Rogers)", emoji: "\u{1F393}", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  5: { name: "Attempt 5", style: "Silly Comedian", emoji: "\u{1F602}", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  6: { name: "Attempt 6", style: "Fantasy RPG Quest Guide", emoji: "\u2694\uFE0F", itemEmoji: "\u{1F36A}", itemName: "cookies" },
  7: { name: "Attempt 7", style: "Excited Party Host (Pizza)", emoji: "\u{1F355}", itemEmoji: "\u{1F355}", itemName: "pizza slices" },
  8: { name: "Attempt 8", style: "Pirate Captain (Treasure Coins)", emoji: "\u{1F3F4}\u200D\u2620\uFE0F", itemEmoji: "\u{1FA99}", itemName: "gold coins" },
  9: { name: "Attempt 9", style: "Cheerful Teacher (Star Stickers)", emoji: "\u2B50", itemEmoji: "\u2B50", itemName: "star stickers" },
  10: { name: "Attempt 10", style: "Chill Picnic DJ (Watermelon)", emoji: "\u{1F349}", itemEmoji: "\u{1F349}", itemName: "watermelon slices" },
  11: { name: "Attempt 11", style: "Adventurous Explorer (Treasure Feast)", emoji: "\u{1F5FA}\uFE0F", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  12: { name: "Attempt 12", style: "Cozy Sleepover (Midnight Snack)", emoji: "\u{1F319}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  13: { name: "Attempt 13", style: "Silly Game Show (Monster Bake-Off)", emoji: "\u{1F3AC}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  14: { name: "Attempt 14", style: "Curious Scientist (Lab Experiment)", emoji: "\u{1F52C}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  15: { name: "Attempt 15", style: "Cozy Kitchen Baking", emoji: "\u{1F9C1}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  16: { name: "Attempt 16", style: "Space Station Astronauts", emoji: "\u{1F680}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  17: { name: "Attempt 17", style: "Garden Party Bugs", emoji: "\u{1F338}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  18: { name: "Attempt 18", style: "Pirate Treasure Island", emoji: "\u{1F3F4}\u200D\u2620\uFE0F", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  19: { name: "Attempt 19", style: "Art Studio Monsters", emoji: "\u{1F3A8}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  20: { name: "Attempt 20", style: "Forest Music Festival", emoji: "\u{1F3B5}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  21: { name: "Attempt 21", style: "Underwater Adventure", emoji: "\u{1F419}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  22: { name: "Attempt 22", style: "Campfire Night", emoji: "\u{1F3D5}\uFE0F", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  23: { name: "Attempt 23", style: "Toy Workshop", emoji: "\u{1F916}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
  24: { name: "Attempt 24", style: "Dragon Bakery", emoji: "\u{1F409}", itemEmoji: "\u{1F36B}", itemName: "chocolate bars" },
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

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Parser ──────────────────────────────────────────────────────────────────

function parseSteps(filePath) {
  const src = fs.readFileSync(filePath, "utf8");

  const startMatch = src.match(/export\s+const\s+lessonSteps[^=]*=\s*\{/);
  if (!startMatch) throw new Error(`Could not find lessonSteps in ${filePath}`);

  const startIdx = startMatch.index + startMatch[0].length - 1;
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }

  const body = src.slice(startIdx + 1, endIdx);
  const jsBody = `({\n${body}\n})`;

  let steps;
  try {
    steps = new Function(`"use strict"; return ${jsBody}`)();
  } catch (e) {
    steps = extractStepsLineByLine(src);
  }

  return steps;
}

function extractStepsLineByLine(src) {
  const steps = {};
  const lines = src.split("\n");
  let inSteps = false;
  let depth = 0;
  let currentKey = null;
  let blockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inSteps && /export\s+const\s+lessonSteps/.test(line)) {
      inSteps = true;
      depth = 0;
      continue;
    }

    if (!inSteps) continue;

    for (const ch of line) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
    }

    if (depth === 1 && !currentKey) {
      const keyMatch = line.match(/^\s*"([^"]+)"\s*:\s*\{/);
      if (keyMatch) {
        currentKey = keyMatch[1];
        blockLines = [line];
      }
    } else if (currentKey) {
      blockLines.push(line);
      if (depth === 1) {
        const block = blockLines.join("\n");
        steps[currentKey] = parseStepBlock(currentKey, block);
        currentKey = null;
        blockLines = [];
      }
    }

    if (depth === 0 && inSteps) break;
  }

  return steps;
}

function parseStepBlock(id, block) {
  const step = { id };

  const typeM = block.match(/\btype\s*:\s*"([^"]+)"/);
  if (typeM) step.type = typeM[1];

  const tutorM = block.match(/tutorText\s*:\s*([\s\S]*?)(?=,\s*\n\s*(?:taskHeader|choices|next|cookieCount|characterCount|expectedPerPerson|showNumber|showFractionNum|showFractionDen|wholeNumber|allowKnife|sfx|tutorEmotion|id|type|\})|$)/);
  if (tutorM) {
    let raw = tutorM[1].trim();
    raw = raw.replace(/"\s*\+\s*"/g, "").replace(/"\s*\+\s*\n\s*"/g, "");
    const strMatch = raw.match(/^"([\s\S]*)"$/);
    if (strMatch) step.tutorText = strMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    else {
      const segments = [];
      const re = /"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = re.exec(raw)) !== null) segments.push(m[1]);
      if (segments.length) step.tutorText = segments.join("").replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
  }

  const headerM = block.match(/taskHeader\s*:\s*"([^"]+)"/);
  if (headerM) step.taskHeader = headerM[1];

  const nextM = block.match(/\bnext\s*:\s*"([^"]+)"/);
  if (nextM) step.next = nextM[1];

  const sfxM = block.match(/\bsfx\s*:\s*"([^"]+)"/);
  if (sfxM) step.sfx = sfxM[1];

  const emotionM = block.match(/tutorEmotion\s*:\s*"([^"]+)"/);
  if (emotionM) step.tutorEmotion = emotionM[1];

  const showNumM = block.match(/showNumber\s*:\s*"([^"]+)"/);
  if (showNumM) step.showNumber = showNumM[1];

  const snM = block.match(/showFractionNum\s*:\s*(\d+)/);
  if (snM) step.showFractionNum = parseInt(snM[1]);
  const sdM = block.match(/showFractionDen\s*:\s*(\d+)/);
  if (sdM) step.showFractionDen = parseInt(sdM[1]);
  const wnM = block.match(/wholeNumber\s*:\s*(\d+)/);
  if (wnM) step.wholeNumber = parseInt(wnM[1]);

  const ccM = block.match(/cookieCount\s*:\s*(\d+)/);
  if (ccM) step.cookieCount = parseInt(ccM[1]);
  const charM = block.match(/characterCount\s*:\s*(\d+)/);
  if (charM) step.characterCount = parseInt(charM[1]);
  const eppM = block.match(/expectedPerPerson\s*:\s*(\d+)/);
  if (eppM) step.expectedPerPerson = parseInt(eppM[1]);

  if (/allowKnife\s*:\s*true/.test(block)) step.allowKnife = true;

  const choicesSection = block.match(/choices\s*:\s*\[([\s\S]*?)\]/);
  if (choicesSection) {
    step.choices = [];
    const choicesText = choicesSection[1];
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

// ─── Path Walker ─────────────────────────────────────────────────────────────

function walkHappyPath(steps) {
  const keys = Object.keys(steps);
  let currentId = keys.includes("start") ? "start" : keys[0];

  const visited = new Set();
  const path = [];

  while (currentId && currentId !== "end" && !visited.has(currentId)) {
    visited.add(currentId);
    const step = steps[currentId];
    if (!step) break;

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

    if (step.choices) {
      const correctChoice = step.choices.find(c => c.correct);
      if (correctChoice) {
        currentId = correctChoice.next;
      } else {
        currentId = step.choices[0]?.next;
      }
    } else {
      currentId = step.next;
    }
  }

  return path;
}

module.exports = {
  parseSteps,
  walkHappyPath,
  NARRATOR_STYLES,
  TYPE_COLORS,
  escapeHtml,
};
