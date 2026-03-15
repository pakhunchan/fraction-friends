// lib/render-attempt.js
// Renders one attempt as a 2-column grid section (happy path | errors)

const { NARRATOR_STYLES, TYPE_COLORS, escapeHtml } = require("./parse-lesson-data");

const ATTEMPT_ACCENT_COLORS = {
  1: "#3b82f6", 2: "#22c55e", 3: "#f59e0b", 4: "#a78bfa", 5: "#f43f5e",
  6: "#06b6d4", 7: "#f97316", 8: "#eab308", 9: "#14b8a6", 10: "#ec4899",
  11: "#8b5cf6", 12: "#0ea5e9", 13: "#d946ef", 14: "#84cc16",
  15: "#f472b6", 16: "#38bdf8", 17: "#a3e635", 18: "#fbbf24",
  19: "#c084fc", 20: "#2dd4bf", 21: "#60a5fa", 22: "#fb923c",
  23: "#4ade80", 24: "#f87171",
};

function renderStepCard(step, index, attemptNum) {
  const typeInfo = TYPE_COLORS[step.type] || TYPE_COLORS.narrate;
  const itemInfo = NARRATOR_STYLES[attemptNum] || { itemEmoji: "\u{1F36A}", itemName: "cookies" };

  let html = `<div class="step-card" data-type="${escapeHtml(step.type)}" style="border-color:${typeInfo.border}; background:${typeInfo.bg}">`;

  // Header row: step number + type badge + tags
  html += `<div class="step-header">`;
  html += `<span class="step-num">#${index + 1}</span>`;
  html += `<span class="type-badge" style="background:${typeInfo.border}22; color:${typeInfo.text}; border:1px solid ${typeInfo.border}">${escapeHtml(typeInfo.label)}</span>`;

  const tags = [];
  if (step.sfx) tags.push(`<span class="tag sfx-tag">\u{1F50A} ${escapeHtml(step.sfx)}</span>`);
  if (step.tutorEmotion) tags.push(`<span class="tag emotion-tag">\u{1F604} ${escapeHtml(step.tutorEmotion)}</span>`);
  if (tags.length) html += `<span class="tags-row">${tags.join("")}</span>`;

  html += `</div>`;

  // Step ID
  html += `<div class="step-id">${escapeHtml(step.id)}</div>`;

  // Task header
  if (step.taskHeader) {
    html += `<div class="task-header">\u{1F4CB} ${escapeHtml(step.taskHeader)}</div>`;
  }

  // Distribute info
  if (step.cookieCount !== undefined) {
    html += `<div class="distribute-info">${itemInfo.itemEmoji} ${step.cookieCount} ${itemInfo.itemName} \u2192 \u{1F465} ${step.characterCount} people`;
    if (step.expectedPerPerson !== undefined) html += ` (${step.expectedPerPerson} each)`;
    if (step.allowKnife) html += ` \u{1F52A}`;
    html += `</div>`;
  }

  // Fraction display
  if (step.type === "show-fraction" && step.showFractionNum !== undefined) {
    html += `<div class="fraction-display">`;
    if (step.wholeNumber !== undefined) html += `<span class="whole-num">${step.wholeNumber}</span>`;
    html += `<span class="fraction"><span class="frac-num">${step.showFractionNum}</span><span class="frac-bar"></span><span class="frac-den">${step.showFractionDen}</span></span>`;
    html += `</div>`;
  }
  if (step.type === "show-number" && step.showNumber) {
    html += `<div class="number-display">${escapeHtml(step.showNumber)}</div>`;
  }

  // Tutor text
  if (step.tutorText) {
    html += `<div class="tutor-text">${escapeHtml(step.tutorText)}</div>`;
  }

  // Choices (shown inline on the step card — correct highlighted)
  if (step.choices && step.choices.length) {
    html += `<div class="choices">`;
    for (const choice of step.choices) {
      const isCorrect = !!choice.correct;
      html += `<div class="choice ${isCorrect ? "correct" : "wrong"}">`;
      html += `<span class="choice-icon">${isCorrect ? "\u2713" : "\u2717"}</span>`;
      html += `<span class="choice-label">${escapeHtml(choice.label)}</span>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function renderErrorCard(choice, wrongStep) {
  let html = `<div class="error-card">`;
  html += `<div class="error-choice">\u2717 "${escapeHtml(choice.label)}"</div>`;
  if (wrongStep.tutorText) {
    html += `<div class="error-text">${escapeHtml(wrongStep.tutorText)}</div>`;
  }
  if (wrongStep.sfx) {
    html += `<span class="tag sfx-tag small">\u{1F50A} ${escapeHtml(wrongStep.sfx)}</span>`;
  }
  html += `<div class="error-retry">\u21A9 Retries same question</div>`;
  html += `</div>`;
  return html;
}

function renderAttempt(attemptNum, steps, happyPath) {
  const info = NARRATOR_STYLES[attemptNum];
  const accent = ATTEMPT_ACCENT_COLORS[attemptNum] || "#3b82f6";
  const totalSteps = Object.keys(steps).length;

  const category = attemptNum <= 14 ? "basic" : "equiv";
  let html = `<section class="attempt-section" id="attempt-${attemptNum}" data-category="${category}">`;

  // Section header
  html += `<div class="attempt-header" style="border-top:3px solid ${accent}">`;
  html += `<div class="attempt-title">${info.emoji} ${escapeHtml(info.name)} \u2014 ${escapeHtml(info.style)}</div>`;
  html += `<div class="attempt-stats">`;
  html += `<span class="stat-badge">${happyPath.length} happy-path steps</span>`;
  html += `<span class="stat-badge secondary">${totalSteps} total steps</span>`;
  html += `</div>`;
  html += `</div>`;

  // Two-column grid
  html += `<div class="two-col-grid">`;

  // Column headers (row 1)
  html += `<div class="grid-col-header left-header" style="grid-column:1; grid-row:1">HAPPY PATH</div>`;
  html += `<div class="grid-col-header right-header" style="grid-column:2; grid-row:1">ERRORS / MISTAKES</div>`;

  let row = 2;

  happyPath.forEach(({ step, wrongBranches }, i) => {
    // Left column: step card + connector arrow
    html += `<div class="grid-cell left-cell" style="grid-column:1; grid-row:${row}">`;
    html += renderStepCard(step, i, attemptNum);
    if (i < happyPath.length - 1) {
      html += `<div class="connector">\u2193</div>`;
    }
    html += `</div>`;

    // Right column: error cards (only for choice steps with wrong branches)
    if (wrongBranches && wrongBranches.length) {
      html += `<div class="grid-cell right-cell has-errors" style="grid-column:2; grid-row:${row}">`;
      for (const { choice, step: ws } of wrongBranches) {
        html += renderErrorCard(choice, ws);
      }
      html += `</div>`;
    }

    row++;
  });

  // End marker spanning both columns
  html += `<div class="end-marker" style="grid-column:1/3; grid-row:${row}">\u2B50 END</div>`;

  html += `</div>`; // two-col-grid
  html += `</section>`;

  return html;
}

module.exports = { renderAttempt };
