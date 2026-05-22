"use client";

import { useState, useEffect, useRef } from "react";

const SEARCH_CMD = "endgit search auth";
const INSTALL_CMD = "endgit install endstone-auth-me";

const SEARCH_RESULTS = [
  "Found 1 plugin(s):",
  "────────────────────────────────────────────────────────────",
  { type: "plugin", text: "[PY]  endstone-auth-me │ v1.0.0 │ 0 ⬇" },
  { type: "dim", text: "      Endstone plugin for authentication" },
  "────────────────────────────────────────────────────────────",
  { type: "dim", text: "Run endgit info <plugin> to view details, or endgit install <plugin> to install." },
];

const INSTALL_RESULTS = [
  { type: "dim", text: "→ Saved to: plugins/endstone_auth_me-1.0.0-py3-none-any.whl" },
  { type: "success", text: "✓ Installed endstone-auth-me@1.0.0" },
];

type Phase =
  | "typing-search"
  | "showing-search"
  | "clearing"
  | "typing-install"
  | "showing-install"
  | "idle";

export default function CLITerminal() {
  const [phase, setPhase] = useState<Phase>("typing-search");
  const [typedSearch, setTypedSearch] = useState(0);
  const [searchLines, setSearchLines] = useState(0);
  const [typedInstall, setTypedInstall] = useState(0);
  const [installLines, setInstallLines] = useState(0);
  const [cursor, setCursor] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    t.length = 0;

    if (phase === "typing-search") {
      setOpacity(1);
      setTypedSearch(0);
      setSearchLines(0);
      setTypedInstall(0);
      setInstallLines(0);
      setCursor(true);
      for (let i = 1; i <= SEARCH_CMD.length; i++) {
        t.push(setTimeout(() => setTypedSearch(i), i * 40));
      }
      t.push(setTimeout(() => {
        setCursor(false);
        setPhase("showing-search");
      }, SEARCH_CMD.length * 40 + 300));
    }

    if (phase === "showing-search") {
      for (let i = 1; i <= SEARCH_RESULTS.length; i++) {
        t.push(setTimeout(() => setSearchLines(i), i * 60));
      }
      t.push(setTimeout(() => setPhase("clearing"), SEARCH_RESULTS.length * 60 + 1500));
    }

    if (phase === "clearing") {
      setOpacity(0);
      t.push(setTimeout(() => setPhase("typing-install"), 400));
    }

    if (phase === "typing-install") {
      setOpacity(1);
      setTypedSearch(0);
      setSearchLines(0);
      setTypedInstall(0);
      setInstallLines(0);
      setCursor(true);
      for (let i = 1; i <= INSTALL_CMD.length; i++) {
        t.push(setTimeout(() => setTypedInstall(i), i * 40));
      }
      t.push(setTimeout(() => {
        setCursor(false);
        setPhase("showing-install");
      }, INSTALL_CMD.length * 40 + 300));
    }

    if (phase === "showing-install") {
      for (let i = 1; i <= INSTALL_RESULTS.length; i++) {
        t.push(setTimeout(() => setInstallLines(i), i * 400));
      }
      t.push(setTimeout(() => setPhase("idle"), INSTALL_RESULTS.length * 400 + 2000));
    }

    if (phase === "idle") {
      t.push(setTimeout(() => setPhase("typing-search"), 1000));
    }

    return () => t.forEach(clearTimeout);
  }, [phase]);

  const showSearch = phase === "typing-search" || phase === "showing-search" || phase === "clearing";
  const showSearchResults = phase === "showing-search" || phase === "clearing";
  const showInstallCmd = phase === "typing-install" || phase === "showing-install";
  const showInstallResults = phase === "showing-install";
  const showFinalCursor = phase === "idle";

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#0c1210] shadow-lg dark:bg-[#0a0f0d]">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <div className="size-3 rounded-full bg-red-400/80" />
        <div className="size-3 rounded-full bg-amber-400/80" />
        <div className="size-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-[0.65rem] text-white/30">endgit-cli</span>
      </div>
      <div
        className="min-h-[280px] space-y-1 p-5 font-mono text-[13px] leading-[1.6] transition-opacity duration-300"
        style={{ opacity }}
      >
        {/* Search */}
        {showSearch && (
          <>
            <div>
              <span className="text-white/50">$</span>
              <span className="ml-2 text-white/90">{SEARCH_CMD.slice(0, typedSearch)}</span>
              {phase === "typing-search" && cursor && (
                <span className="ml-0.5 inline-block h-[1.1em] w-[7px] animate-pulse bg-white/80" />
              )}
            </div>

            {showSearchResults && SEARCH_RESULTS.slice(0, searchLines).map((line, i) => {
              if (typeof line === "string") {
                return <div key={i} className="text-white/40">{line}</div>;
              }
              if (line.type === "plugin") {
                return <div key={i} className="text-primary">{line.text}</div>;
              }
              return <div key={i} className="text-white/40">{line.text}</div>;
            })}
          </>
        )}

        {/* Install command */}
        {showInstallCmd && (
          <div>
            <span className="text-white/50">$</span>
            <span className="ml-2 text-white/90">{INSTALL_CMD.slice(0, typedInstall)}</span>
            {phase === "typing-install" && cursor && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[7px] animate-pulse bg-white/80" />
            )}
          </div>
        )}

        {/* Install results */}
        {showInstallResults && INSTALL_RESULTS.slice(0, installLines).map((line, i) => (
          <div key={i} className={line.type === "success" ? "text-emerald-400" : "text-white/40"}>
            {line.text}
          </div>
        ))}

        {/* Final cursor */}
        {showFinalCursor && (
          <div className="flex items-center pt-1">
            <span className="text-white/50">$</span>
            <span className="ml-2 inline-block h-[1.1em] w-[7px] animate-pulse bg-white/80" />
          </div>
        )}
      </div>
    </div>
  );
}
