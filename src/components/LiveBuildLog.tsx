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
    let colorClass = "text-[#cbd5e1]"; // default slate-300
    let fontWeightClass = "font-normal";

    if (line.includes("✅")) {
      colorClass = "text-success"; // success green
    } else if (
      line.includes("❌") ||
      line.includes("ERROR") ||
      line.includes("Failed permanently")
    ) {
      colorClass = "text-error"; // error red
    } else if (line.includes("⚠️") || line.includes("Warning")) {
      colorClass = "text-warning"; // warning yellow
    } else if (line.trim().startsWith("[") && line.includes("]")) {
      colorClass = "text-accent"; // cyan for steps like [1/5]
      fontWeightClass = "font-semibold";
    } else if (line.includes("->")) {
      colorClass = "text-text-muted"; // muted slate-400 for sub-steps
    } else if (line.includes("Security Scan")) {
      colorClass = "text-purple-400"; // purple for security
    }

    return (
      <div key={index} className="flex items-start gap-4 min-h-[1.5rem] pr-4">
        <span className="text-[#334155] min-w-[2rem] text-right select-none text-xs pt-0.5 font-mono shrink-0">
          {index + 1 + lineOffset}
        </span>
        <span
          className={`whitespace-pre-wrap break-words flex-1 font-mono ${colorClass} ${fontWeightClass}`}
        >
          {line}
        </span>
      </div>
    );
  };

  return (
    <div className="card overflow-hidden border border-white/5 shadow-2xl bg-[#09090b]">
      {/* Header */}
      <div className="live-build-header grid grid-cols-[1fr_auto] items-center px-3 lg:px-5 py-3 border-b border-white/5 bg-white/[0.02] backdrop-blur-md gap-3">
        <div className="flex items-center gap-3">
          <Terminal size={16} className="text-accent" />
          <span className="font-semibold text-sm text-[#f8fafc] tracking-wide">
            Execution Log
          </span>
          {isRunning && (
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] text-accent font-bold tracking-wider bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-[0.8125rem]">
          {duration !== null && (
            <span className="flex items-center gap-1.5 text-text-muted">
              <Clock size={14} /> {duration}s
            </span>
          )}
          {!isRunning &&
            (isSuccess ? (
              <CheckCircle size={16} className="text-success" />
            ) : (
              <XCircle size={16} className="text-error" />
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
        className="m-0 py-4 font-mono text-[0.8125rem] max-h-[500px] overflow-y-auto scrollbar-terminal"
      >
        {isTruncated && (
          <div className="text-center py-2 pb-3">
            <button
              onClick={() => setShowAll(true)}
              className="bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-accent/20 transition-colors duration-150"
            >
              Show all {totalLines} lines ({hiddenCount} hidden)
            </button>
          </div>
        )}
        {logs ? (
          visibleLines.map((line, i) => parseLogLine(line, i))
        ) : (
          <div className="flex items-start gap-4 min-h-[1.5rem] pr-4">
            <span className="text-[#334155] min-w-[2rem] text-right text-xs pt-0.5 font-mono shrink-0">
              1
            </span>
            <span className="text-text-muted italic">
              Waiting for build agent to start...
            </span>
          </div>
        )}
        {isRunning && (
          <div className="flex items-start gap-4 min-h-[1.5rem] pr-4">
            <span className="text-[#334155] min-w-[2rem] text-right text-xs pt-0.5 font-mono shrink-0">
              {logs ? allLines.length + 1 : 2}
            </span>
            <span className="text-accent animate-pulse font-mono">▋</span>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Custom scrollbar for the terminal */
        .scrollbar-terminal::-webkit-scrollbar { width: 8px; }
        .scrollbar-terminal::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .scrollbar-terminal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `,
        }}
      />
    </div>
  );
}
