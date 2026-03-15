#!/bin/bash
# Generates gallery.html from all .tsx/.ts files in step* folders
# Re-run anytime to pick up new agent outputs

cd "$(dirname "$0")/.."

OUTPUT="gallery/gallery.html"

# Collect all source files
FILES=$(find research/step* -name "*.tsx" -o -name "*.ts" 2>/dev/null | sort)

# Start HTML
cat > "$OUTPUT" << 'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Math Tutor — Attempt Gallery</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; display: flex; height: 100vh; }

  /* Sidebar */
  .sidebar { width: 280px; min-width: 280px; background: #161b22; border-right: 1px solid #30363d; overflow-y: auto; padding: 16px 0; }
  .sidebar h1 { font-size: 14px; padding: 8px 16px; color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; }
  .sidebar .step-group { margin-bottom: 8px; }
  .sidebar .step-label { font-size: 12px; color: #58a6ff; padding: 6px 16px; font-weight: 600; }
  .sidebar .file-link {
    display: block; padding: 6px 16px 6px 28px; color: #c9d1d9; text-decoration: none;
    font-size: 13px; font-family: 'SF Mono', Monaco, monospace; border-left: 3px solid transparent;
    transition: all 0.15s;
  }
  .sidebar .file-link:hover { background: #1f2937; color: #fff; }
  .sidebar .file-link.active { background: #1f2937; border-left-color: #58a6ff; color: #fff; }
  .sidebar .attempt-tag {
    display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 8px;
    margin-left: 4px; font-family: sans-serif; font-weight: 600;
  }
  .sidebar .attempt-tag.a1 { background: #1f6feb33; color: #58a6ff; }
  .sidebar .attempt-tag.a2 { background: #da363333; color: #f85149; }
  .sidebar .attempt-tag.a3 { background: #2ea04333; color: #3fb950; }
  .sidebar .attempt-tag.a4 { background: #d2992233; color: #d29922; }
  .sidebar .attempt-tag.a5 { background: #8b5cf633; color: #a78bfa; }
  .sidebar .attempt-tag.a6 { background: #ec489933; color: #f472b6; }

  /* Main content */
  .main { flex: 1; overflow-y: auto; padding: 0; }
  .page { display: none; padding: 24px 32px; }
  .page.active { display: block; }
  .page h2 { font-size: 18px; margin-bottom: 4px; }
  .page .filepath { font-size: 12px; color: #8b949e; font-family: monospace; margin-bottom: 16px; }
  .page pre { border-radius: 8px; font-size: 13px; line-height: 1.5; max-height: calc(100vh - 120px); overflow: auto; }
  .page pre code { padding: 16px !important; }

  /* Preview iframe */
  .preview-frame {
    width: 100%; height: 500px; border: 1px solid #30363d; border-radius: 8px;
    margin-bottom: 16px; background: #161b22;
  }
  .preview-label { font-size: 11px; color: #8b949e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .toggle-code { display: inline-block; padding: 4px 12px; border-radius: 6px; background: #21262d; color: #8b949e; border: 1px solid #30363d; cursor: pointer; font-size: 12px; margin-bottom: 12px; }
  .toggle-code:hover { background: #30363d; color: #e6edf3; }

  /* Stats bar */
  .stats { padding: 12px 16px; border-top: 1px solid #30363d; font-size: 11px; color: #8b949e; }
</style>
</head>
<body>
<div class="sidebar">
  <h1>Attempt Gallery</h1>
HEADER

# Build sidebar nav and collect file contents
declare -a PAGE_IDS
declare -a PAGE_PATHS
IDX=0
CURRENT_STEP=""

for FILE in $FILES; do
  # Parse step and attempt from path
  STEP=$(echo "$FILE" | sed 's|/.*||')
  ATTEMPT=$(echo "$FILE" | sed -n 's|.*\(attempt[0-9]*\).*|\1|p')
  FILENAME=$(basename "$FILE")
  PAGE_ID="page-${IDX}"

  # Step group header — close previous group if switching steps
  if [ "$STEP" != "$CURRENT_STEP" ]; then
    if [ -n "$CURRENT_STEP" ]; then
      echo "  </div>" >> "$OUTPUT"
    fi
    CURRENT_STEP="$STEP"
    STEP_LABEL=$(echo "$STEP" | sed 's/-/ /g' | sed 's/step/Step/')
    echo "  <div class=\"step-group\">" >> "$OUTPUT"
    echo "  <div class=\"step-label\">$STEP_LABEL</div>" >> "$OUTPUT"
  fi

  # Attempt tag class
  case "$ATTEMPT" in
    attempt1) ATAG="a1" ;;
    attempt2) ATAG="a2" ;;
    attempt3) ATAG="a3" ;;
    attempt4) ATAG="a4" ;;
    attempt5) ATAG="a5" ;;
    attempt6) ATAG="a6" ;;
    *) ATAG="a1" ;;
  esac

  ACTIVE=""
  if [ $IDX -eq 0 ]; then ACTIVE=" active"; fi

  echo "  <a href=\"#\" class=\"file-link${ACTIVE}\" data-page=\"${PAGE_ID}\">${FILENAME}<span class=\"attempt-tag ${ATAG}\">${ATTEMPT}</span></a>" >> "$OUTPUT"

  PAGE_IDS+=("$PAGE_ID")
  PAGE_PATHS+=("$FILE")
  IDX=$((IDX + 1))
done

# Close last step group
if [ -n "$CURRENT_STEP" ]; then
  echo "  </div>" >> "$OUTPUT"
fi

# Stats
TOTAL=${#PAGE_IDS[@]}
A1_COUNT=$(echo "$FILES" | grep -c "attempt1" || true)
A2_COUNT=$(echo "$FILES" | grep -c "attempt2" || true)
A3_COUNT=$(echo "$FILES" | grep -c "attempt3" || true)
A4_COUNT=$(echo "$FILES" | grep -c "attempt4" || true)
A5_COUNT=$(echo "$FILES" | grep -c "attempt5" || true)
A6_COUNT=$(echo "$FILES" | grep -c "attempt6" || true)
echo "  <div class=\"stats\">${TOTAL} files &middot; ${A1_COUNT} a1 &middot; ${A2_COUNT} a2 &middot; ${A3_COUNT} a3 &middot; ${A4_COUNT} a4 &middot; ${A5_COUNT} a5 &middot; ${A6_COUNT} a6</div>" >> "$OUTPUT"

cat >> "$OUTPUT" << 'SIDEBAR_END'
</div>
<div class="main">
SIDEBAR_END

# Build page content for each file
for i in "${!PAGE_IDS[@]}"; do
  PID="${PAGE_IDS[$i]}"
  FPATH="${PAGE_PATHS[$i]}"
  FNAME=$(basename "$FPATH")

  ACTIVE=""
  if [ $i -eq 0 ]; then ACTIVE=" active"; fi

  # Determine language for highlight.js
  LANG="typescript"

  # Check for a preview.html in the same directory
  DIRPATH=$(dirname "$FPATH")
  PREVIEW_PATH="${DIRPATH}/preview.html"

  echo "<div class=\"page${ACTIVE}\" id=\"${PID}\">" >> "$OUTPUT"
  echo "  <h2>${FNAME}</h2>" >> "$OUTPUT"
  echo "  <div class=\"filepath\">${FPATH}</div>" >> "$OUTPUT"

  # If a preview.html exists, embed it as an iframe
  if [ -f "$PREVIEW_PATH" ]; then
    echo "  <div class=\"preview-label\">Visual Preview</div>" >> "$OUTPUT"
    echo "  <iframe class=\"preview-frame\" src=\"../${PREVIEW_PATH}\"></iframe>" >> "$OUTPUT"
    echo "  <button class=\"toggle-code\" onclick=\"var c=this.nextElementSibling;c.style.display=c.style.display==='none'?'block':'none';this.textContent=c.style.display==='none'?'Show Source':'Hide Source'\">Show Source</button>" >> "$OUTPUT"
    echo "  <div style=\"display:none\">" >> "$OUTPUT"
  fi

  echo "  <pre><code class=\"language-${LANG}\">" >> "$OUTPUT"

  # Escape HTML entities in source code and append
  sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g' "$FPATH" >> "$OUTPUT"

  echo "</code></pre>" >> "$OUTPUT"

  # Close the toggle wrapper if we had a preview
  if [ -f "$PREVIEW_PATH" ]; then
    echo "  </div>" >> "$OUTPUT"
  fi

  echo "</div>" >> "$OUTPUT"
done

# Close HTML
cat >> "$OUTPUT" << 'FOOTER'
</div>

<script>
hljs.highlightAll();

// Tab navigation
document.querySelectorAll('.file-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.dataset.page;

    document.querySelectorAll('.file-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    link.classList.add('active');
    document.getElementById(pageId).classList.add('active');
  });
});
</script>
</body>
</html>
FOOTER

echo "Generated $OUTPUT with $TOTAL files"
