"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, CheckCircle, XCircle, Clock } from "lucide-react";

const INITIAL_LINE_LIMIT = 500;

interface Props {
  buildId: string;
  initialLogs?: string;
  initialStatus?: string;
}

export default function LiveBuildLog({
  buildId,
  initialLogs,
  initialStatus,
}: Props) {
  const [logs, setLogs] = useState(initialLogs || "");
  const [status, setStatus] = useState(initialStatus || "RUNNING");
  const [duration, setDuration] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (status !== "RUNNING" && status !== "QUEUED") return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const eventSource = new EventSource(
      `${apiUrl}/api/v1/builds/${buildId}/stream`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "log") {
        setLogs((prev) => prev + data.content);
      } else if (data.type === "finish") {
        setStatus(data.status);
        setDuration(data.duration);
        eventSource.close();
      } else if (data.type === "error") {
        setStatus("ERROR");
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [buildId, status]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const isRunning = status === "RUNNING" || status === "QUEUED";
  const isSuccess = status === "SUCCESS";

  const allLines = logs ? logs.split("\n") : [];
  const totalLines = allLines.length;
  const isTruncated = !isRunning && !showAll && totalLines > INITIAL_LINE_LIMIT;
  const visibleLines = isTruncated
    ? allLines.slice(totalLines - INITIAL_LINE_LIMIT)
    : allLines;
  const hiddenCount = totalLines - visibleLines.length;

  const lineOffset = isTruncated ? hiddenCount : 0;

  // Custom log parser for syntax highlighting
  const parseLogLine = (line: string, index: number) => {
    let color = "#cbd5e1"; // default slate-300
    let fontWeight = "normal";

    if (line.includes("✅"))
      color = "#10b981"; // success green
    else if (
      line.includes("❌") ||
      line.includes("ERROR") ||
      line.includes("Failed permanently")
    )
      color = "#ef4444"; // error red
    else if (line.includes("⚠️") || line.includes("Warning"))
      color = "#f59e0b"; // warning yellow
    else if (line.trim().startsWith("[") && line.includes("]")) {
      color = "#38bdf8"; // cyan for steps like [1/5]
      fontWeight = "600";
    } else if (line.includes("->"))
      color = "#94a3b8"; // muted slate-400 for sub-steps
    else if (line.includes("Security Scan")) color = "#c084fc"; // purple for security

    return (
      <div
        key={index}
        style={{ display: "flex", gap: "1rem", minHeight: "1.5rem" }}
      >
        <span
          style={{
            color: "#334155",
            minWidth: "2rem",
            textAlign: "right",
            userSelect: "none",
            fontSize: "0.75rem",
            paddingTop: "0.1rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          {index + 1 + lineOffset}
        </span>
        <span
          style={{
            color,
            fontWeight,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            flex: 1,
          }}
        >
          {line}
        </span>
      </div>
    );
  };

  return (
    <div
      className="card"
      style={{
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        background: "#09090b", // Very dark background
      }}
    >
      {/* Header */}
      <div
        className="live-build-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(10px)",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Terminal size={16} color="#38bdf8" />
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#f8fafc",
              letterSpacing: "0.02em",
            }}
          >
            Execution Log
          </span>
          {isRunning && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.6875rem",
                color: "#38bdf8",
                fontWeight: 700,
                letterSpacing: "0.05em",
                background: "rgba(56, 189, 248, 0.1)",
                padding: "2px 8px",
                borderRadius: "99px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#38bdf8",
                  animation: "pulse 1.5s infinite",
                }}
              />
              LIVE
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8125rem",
          }}
        >
          {duration !== null && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
              }}
            >
              <Clock size={14} /> {duration}s
            </span>
          )}
          {!isRunning &&
            (isSuccess ? (
              <CheckCircle size={16} color="#10b981" />
            ) : (
              <XCircle size={16} color="#ef4444" />
            ))}
        </div>
      </div>

      {/* Log Output */}
      <div
        ref={logRef}
        onScroll={() => {
          if (logRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = logRef.current;
            setAutoScroll(scrollHeight - scrollTop - clientHeight < 50);
          }
        }}
        style={{
          margin: 0,
          padding: "1rem 0",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {isTruncated && (
          <div style={{ textAlign: "center", padding: "0.5rem 0 0.75rem" }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38bdf8",
                padding: "0.375rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Show all {totalLines} lines ({hiddenCount} hidden)
            </button>
          </div>
        )}
        {logs ? (
          visibleLines.map((line, i) => parseLogLine(line, i))
        ) : (
          <div style={{ display: "flex", gap: "1rem", minHeight: "1.5rem" }}>
            <span
              style={{
                color: "#334155",
                minWidth: "2rem",
                textAlign: "right",
                fontSize: "0.75rem",
                paddingTop: "0.1rem",
              }}
            >
              1
            </span>
            <span style={{ color: "#64748b", fontStyle: "italic" }}>
              Waiting for build agent to start...
            </span>
          </div>
        )}
        {isRunning && (
          <div style={{ display: "flex", gap: "1rem", minHeight: "1.5rem" }}>
            <span
              style={{
                color: "#334155",
                minWidth: "2rem",
                textAlign: "right",
                fontSize: "0.75rem",
                paddingTop: "0.1rem",
              }}
            >
              {logs ? allLines.length + 1 : 2}
            </span>
            <span
              style={{
                color: "#38bdf8",
                animation: "blink 1s step-end infinite",
              }}
            >
              ▋
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        /* Custom scrollbar for the terminal */
        div::-webkit-scrollbar { width: 8px; }
        div::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        div::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        div::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
