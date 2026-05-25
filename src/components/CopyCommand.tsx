"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-surface-secondary border border-border px-3 lg:px-4 py-3 rounded-sm font-mono text-xs lg:text-sm grid grid-cols-[1fr_auto] items-center gap-2 overflow-x-auto">
      <code className="whitespace-nowrap text-text-primary">{command}</code>
      <button
        onClick={handleCopy}
        className="touch-target bg-transparent border-none cursor-pointer p-3 grid place-items-center"
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check size={16} className="text-success" />
        ) : (
          <Copy size={16} className="text-text-muted" />
        )}
      </button>
    </div>
  );
}
