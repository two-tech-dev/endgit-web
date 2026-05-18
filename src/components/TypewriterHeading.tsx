"use client";

import { useEffect, useState } from "react";

export default function TypewriterHeading() {
  const fullText = "The plugin registry for ";
  const highlightText = "Endstone";

  const [textIndex, setTextIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => setTextIndex(textIndex + 1), 40);
      return () => clearTimeout(timeout);
    } else if (highlightIndex < highlightText.length) {
      const timeout = setTimeout(
        () => setHighlightIndex(highlightIndex + 1),
        70,
      );
      return () => clearTimeout(timeout);
    } else {
      // Done typing, cursor disappears
      setShowCursor(false);
    }
  }, [textIndex, highlightIndex, fullText.length, highlightText.length]);

  return (
    <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
      {/* Invisible placeholder to reserve exact space */}
      <h1
        className="heading-1"
        style={{
          visibility: "hidden",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
        }}
      >
        {fullText}
        <span style={{ color: "var(--accent-primary)" }}>{highlightText}</span>
      </h1>

      {/* Absolutely positioned typing text */}
      <h1
        className="heading-1"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
          pointerEvents: "none",
        }}
      >
        {fullText.slice(0, textIndex)}
        <span style={{ color: "var(--accent-primary)" }}>
          {highlightText.slice(0, highlightIndex)}
        </span>
        <span
          style={{
            opacity:
              textIndex < fullText.length ||
              highlightIndex < highlightText.length
                ? 1
                : showCursor
                  ? 1
                  : 0,
            color: "var(--accent-primary)",
            marginLeft: "2px",
            display: "inline-block",
            fontWeight: 300,
          }}
        >
          |
        </span>
      </h1>
    </div>
  );
}
