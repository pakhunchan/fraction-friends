"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface ReportIssueProps {
  stepId?: string;
}

const ISSUE_CATEGORIES = [
  "Page doesn't continue",
  "Button doesn't work",
  "Object interaction broken",
  "Audio not playing",
  "Layout looks wrong",
  "Text is cut off or missing",
  "Characters not responding",
  "Other",
] as const;

type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export function ReportIssue({ stepId }: ReportIssueProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Set<IssueCategory>>(new Set());
  const [otherText, setOtherText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const toggleCategory = useCallback((cat: IssueCategory) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selected.size === 0) return;
    setSubmitting(true);

    const report = {
      categories: Array.from(selected),
      otherText: selected.has("Other") ? otherText : undefined,
      url: window.location.href,
      stepId: stepId ?? null,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
    };

    // Log to console
    console.log("[ReportIssue]", JSON.stringify(report, null, 2));

    // Send to API
    try {
      await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch (err) {
      console.error("[ReportIssue] Failed to send report:", err);
    }

    setSubmitting(false);
    setSubmitted(true);

    // Reset and close after brief delay
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setSelected(new Set());
      setOtherText("");
    }, 1500);
  }, [selected, otherText, stepId]);

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-50">
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10
            flex items-center justify-center text-white/50 hover:text-white/80
            transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
          title="Report an issue"
        >
          {/* Bug icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2l1.88 1.88" />
            <path d="M14.12 3.88L16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 116 0v1" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
          </svg>
        </button>
      )}

      {/* Modal panel */}
      {isOpen && (
        <div
          className="w-72 rounded-xl bg-[#1a2540] border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-medium text-[#e8ecff]">Report Issue</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            /* Thank-you state */
            <div className="px-4 py-8 text-center">
              <div className="text-2xl mb-2">Thanks!</div>
              <p className="text-xs text-white/50">Your report has been logged.</p>
            </div>
          ) : (
            <>
              {/* Categories */}
              <div className="px-4 py-3 max-h-60 overflow-y-auto space-y-1.5">
                {ISSUE_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2.5 py-1 cursor-pointer group"
                  >
                    <span
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        selected.has(cat)
                          ? "bg-blue-500 border-blue-500"
                          : "border-white/20 group-hover:border-white/40"
                      }`}
                    >
                      {selected.has(cat) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-xs text-[#e8ecff]/80 group-hover:text-[#e8ecff]">
                      {cat}
                    </span>
                  </label>
                ))}

                {/* Other text input */}
                {selected.has("Other") && (
                  <textarea
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#e8ecff] placeholder-white/30 resize-none focus:outline-none focus:border-blue-500/50"
                    rows={3}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/10">
                <button
                  onClick={handleSubmit}
                  disabled={selected.size === 0 || submitting}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selected.size === 0 || submitting
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  }`}
                >
                  {submitting ? "Sending..." : "Submit Report"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
