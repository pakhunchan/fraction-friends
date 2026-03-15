#!/usr/bin/env node
// generate-story-viewer-v2.js
// Generates the 2-column story viewer (happy path | errors) for all 10 attempts.

const fs = require("fs");
const path = require("path");

const { parseSteps, walkHappyPath, NARRATOR_STYLES } = require("./lib/parse-lesson-data");
const { renderAttempt } = require("./lib/render-attempt");
const { generateHeader, generateFooter } = require("./lib/html-scaffold");

const BASE = path.resolve(__dirname);
const BASIC_ATTEMPTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const EQUIV_ATTEMPTS = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const ATTEMPTS = [...BASIC_ATTEMPTS, ...EQUIV_ATTEMPTS];
const OUTPUT = path.resolve(__dirname, "../../gallery/story-viewer.html");

function main() {
  console.log("Story Viewer v2 — 2-Column Layout Generator");
  console.log("=============================================\n");

  // Parse all attempts
  const allData = ATTEMPTS.map(n => {
    const filePath = path.join(BASE, `attempt${n}`, "lessonData.ts");
    console.log(`  Parsing attempt ${n}...`);

    let steps;
    try {
      steps = parseSteps(filePath);
    } catch (e) {
      console.error(`  ERROR parsing attempt ${n}: ${e.message}`);
      steps = {};
    }

    const stepCount = Object.keys(steps).length;
    const happyPath = walkHappyPath(steps);
    console.log(`    ${stepCount} total steps, ${happyPath.length} happy-path steps`);

    return { n, steps, happyPath };
  });

  console.log("\nGenerating HTML...");

  // Build attempt summaries for nav buttons
  const attemptSummaries = allData.map(({ n, steps, happyPath }) => {
    const info = NARRATOR_STYLES[n];
    return {
      num: n,
      name: info.name,
      style: info.style,
      emoji: info.emoji,
      happyCount: happyPath.length,
      totalCount: Object.keys(steps).length,
    };
  });

  // Generate HTML sections for each attempt
  const sectionsHtml = allData.map(({ n, steps, happyPath }) =>
    renderAttempt(n, steps, happyPath)
  ).join("\n\n");

  // Split summaries by category for tab nav
  const basicSummaries = attemptSummaries.filter(a => a.num <= 14);
  const equivSummaries = attemptSummaries.filter(a => a.num > 14);

  // Assemble full HTML
  const html = generateHeader(attemptSummaries, basicSummaries, equivSummaries) + sectionsHtml + generateFooter();

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT, html, "utf8");

  const stats = fs.statSync(OUTPUT);
  const sizeKb = Math.round(stats.size / 1024);
  console.log(`\nDone! Output: ${OUTPUT}`);
  console.log(`File size: ${sizeKb} KB`);
  console.log(`\nPer-attempt summary:`);
  allData.forEach(({ n, steps, happyPath }) => {
    const info = NARRATOR_STYLES[n];
    console.log(`  Attempt ${n} (${info.style}): ${Object.keys(steps).length} total, ${happyPath.length} happy-path`);
  });
}

main();
