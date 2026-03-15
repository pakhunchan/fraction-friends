// lib/html-scaffold.js
// Generates the HTML header (with CSS + nav + tabs) and footer (with JS)

const { TYPE_COLORS } = require("./parse-lesson-data");

function generateHeader(attemptSummaries, basicSummaries, equivSummaries) {
  // attemptSummaries: [{ num, name, style, emoji, happyCount, totalCount }]
  // basicSummaries: attempts 1-14, equivSummaries: attempts 15-24

  const legendHtml = Object.entries(TYPE_COLORS).map(([type, c]) =>
    `<div class="legend-item"><div class="legend-dot" style="background:${c.border}"></div> ${type}</div>`
  ).join("\n        ");

  const basicNavHtml = basicSummaries.map(a =>
    `<button class="nav-btn" data-attempt="${a.num}" data-tab="basic" onclick="scrollToAttempt(${a.num})">${a.emoji} ${a.num}</button>`
  ).join("\n            ");

  const equivNavHtml = equivSummaries.map(a =>
    `<button class="nav-btn" data-attempt="${a.num}" data-tab="equiv" onclick="scrollToAttempt(${a.num})">${a.emoji} ${a.num}</button>`
  ).join("\n            ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Story Attempt Viewer v2 \u2014 2-Column Layout</title>
  <style>
    /* === Reset & Base === */
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
    }

    html { font-size: 14px; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
    }

    /* === Sticky Nav Bar === */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 200;
      background: var(--bg2);
      border-bottom: 2px solid var(--border);
      padding: 12px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .top-nav-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .top-nav h1 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-bright);
      margin-right: 12px;
      white-space: nowrap;
    }

    /* === Tab Buttons === */
    .tab-buttons {
      display: flex;
      gap: 4px;
    }

    .tab-btn {
      background: var(--bg3);
      border: 1px solid var(--border);
      color: var(--text-dim);
      border-radius: 6px 6px 0 0;
      padding: 6px 16px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .tab-btn:hover {
      background: #1e3050;
      color: var(--text);
    }

    .tab-btn.active {
      background: var(--bg);
      border-color: var(--accent);
      border-bottom-color: var(--bg);
      color: #93c5fd;
    }

    /* === Nav Buttons Row === */
    .nav-buttons-row {
      display: none;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    .nav-buttons-row.active {
      display: flex;
    }

    .nav-btn {
      background: var(--bg3);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .nav-btn:hover { background: #1e3050; border-color: var(--accent); }
    .nav-btn.active { background: #1e3a5f; border-color: var(--accent); color: #93c5fd; font-weight: 600; }

    /* === Legend === */
    .page-meta {
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      padding: 10px 24px;
    }

    .page-meta p {
      color: var(--text-dim);
      font-size: 0.8rem;
      margin-bottom: 8px;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* === Attempt Sections === */
    .sections-wrapper {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }

    .attempt-section {
      margin-bottom: 48px;
    }

    .attempt-header {
      background: var(--bg3);
      border-radius: var(--radius) var(--radius) 0 0;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    .attempt-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-bright);
    }

    .attempt-stats {
      display: flex;
      gap: 6px;
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

    /* === Two-Column Grid === */
    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 var(--radius) var(--radius);
      overflow: hidden;
    }

    .grid-col-header {
      background: var(--bg3);
      padding: 8px 16px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      border-bottom: 1px solid var(--border);
    }

    .grid-col-header.left-header { border-right: 1px solid var(--border); }

    .grid-cell {
      padding: 10px 14px;
      min-height: 60px;
    }

    .grid-cell.left-cell {
      border-right: 1px solid var(--border);
      border-bottom: 1px solid #151e3508;
    }

    .grid-cell.right-cell {
      border-bottom: 1px solid #151e3508;
      display: flex;
      flex-direction: column;
      gap: 6px;
      justify-content: center;
    }

    /* Dashed connector line from left to right for error rows */
    .grid-cell.right-cell.has-errors {
      position: relative;
    }

    .grid-cell.right-cell.has-errors::before {
      content: "";
      position: absolute;
      left: -1px;
      top: 50%;
      width: 18px;
      height: 0;
      border-top: 2px dashed #8b5cf6;
      transform: translateY(-50%);
    }

    /* === Step Card === */
    .step-card {
      border: 1px solid #2a3a5a;
      border-radius: var(--radius);
      padding: 12px;
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
    .tag.small { font-size: 0.6rem; margin-top: 3px; }

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

    .tutor-text {
      font-size: 0.82rem;
      color: var(--text);
      line-height: 1.55;
      margin: 6px 0;
    }

    /* Choices on step cards */
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

    .choice-icon { flex-shrink: 0; font-weight: 700; }
    .choice.correct .choice-icon { color: #4ade80; }
    .choice.wrong .choice-icon { color: #f87171; }

    .choice-label {
      color: var(--text);
      flex: 1;
    }

    /* === Error Cards (right column) === */
    .error-card {
      background: #1a0f0f;
      border: 1px solid #3d1a1a;
      border-radius: var(--radius);
      padding: 10px 12px;
      margin-left: 16px;
    }

    .error-choice {
      font-size: 0.75rem;
      color: #f87171;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .error-text {
      font-size: 0.75rem;
      color: #c0a0a0;
      font-style: italic;
      line-height: 1.45;
      margin-bottom: 4px;
    }

    .error-retry {
      font-size: 0.65rem;
      color: var(--text-dim);
      margin-top: 4px;
    }

    /* === End Marker === */
    .end-marker {
      text-align: center;
      color: #f59e0b;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 12px;
      background: #1a1000;
      border-top: 1px solid var(--border);
    }

    /* === Scrollbar === */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: #2a3a5a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

    /* === Responsive === */
    @media (max-width: 700px) {
      .two-col-grid { grid-template-columns: 1fr; }
      .grid-col-header.left-header { border-right: none; }
      .grid-cell.left-cell { border-right: none; }
      .grid-cell.right-cell.has-errors::before { display: none; }
      .error-card { margin-left: 0; }
    }
  </style>
</head>
<body>

<nav class="top-nav">
  <div class="top-nav-row">
    <h1>\u{1F36A} Story Viewer v2</h1>
    <div class="tab-buttons">
      <button class="tab-btn active" data-tab="basic" onclick="switchTab('basic')">Basic Fractions</button>
      <button class="tab-btn" data-tab="equiv" onclick="switchTab('equiv')">Fraction Equivalence</button>
    </div>
  </div>
  <div class="nav-buttons-row active" id="nav-basic">
    ${basicNavHtml}
  </div>
  <div class="nav-buttons-row" id="nav-equiv">
    ${equivNavHtml}
  </div>
</nav>

<div class="page-meta">
  <p>2-column layout: happy path on the left, wrong-answer branches on the right. Use tabs to switch between Basic Fractions (1\u201314) and Fraction Equivalence (15\u201324).</p>
  <div class="legend">
    ${legendHtml}
  </div>
</div>

<div class="sections-wrapper">
`;
}

function generateFooter() {
  return `
</div><!-- /sections-wrapper -->

<script>
  // Tab switching
  function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update nav button rows
    document.querySelectorAll('.nav-buttons-row').forEach(row => {
      row.classList.remove('active');
    });
    const navRow = document.getElementById('nav-' + tab);
    if (navRow) navRow.classList.add('active');

    // Show/hide attempt sections
    document.querySelectorAll('.attempt-section').forEach(sec => {
      if (sec.dataset.category === tab) {
        sec.style.display = '';
      } else {
        sec.style.display = 'none';
      }
    });

    // Reset nav button highlights
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Scroll to top of sections
    const wrapper = document.querySelector('.sections-wrapper');
    if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Scroll to attempt section
  function scrollToAttempt(num) {
    const el = document.getElementById('attempt-' + num);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // IntersectionObserver to highlight active nav button
  const sections = document.querySelectorAll('.attempt-section');
  const navBtns = document.querySelectorAll('.nav-btn');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id; // "attempt-N"
        const num = id.replace('attempt-', '');
        // Only highlight nav buttons in the active tab
        const activeTab = document.querySelector('.tab-btn.active');
        const activeTabName = activeTab ? activeTab.dataset.tab : 'basic';
        navBtns.forEach(btn => {
          if (btn.dataset.tab === activeTabName) {
            btn.classList.toggle('active', btn.dataset.attempt === num);
          }
        });
      }
    });
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));

  // Initialize: show basic tab by default, hide equiv sections
  document.addEventListener('DOMContentLoaded', function() {
    switchTab('basic');
  });
</script>

</body>
</html>`;
}

module.exports = { generateHeader, generateFooter };
