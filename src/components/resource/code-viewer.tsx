import { useState, useMemo } from "react";
import { Check, Copy, Download, Maximize2, Terminal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  filename?: string;
  language?: string;
  code: string;
  inExplorer?: boolean;
}

export function CodeViewer({ filename = "code.ts", language = "typescript", code, inExplorer = false }: CodeViewerProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloading file...");
  };

  // Simple, fast regex-based syntax highlighter for the preview
  const highlightedCode = useMemo(() => {
    if (!code) return null;
    let html = code
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    // Strings
    html = html.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`)/g, '<span class="text-green-300">$1</span>');
    // Keywords
    html = html.replace(/\b(import|from|export|default|function|const|let|var|return|if|else|for|while|class|extends|new|await|async)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
    // Types/Classes
    html = html.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="text-yellow-200">$1</span>');
    // Built-ins
    html = html.replace(/\b(document|window|console|Math|JSON)\b/g, '<span class="text-cyan-300">$1</span>');
    // Comments
    html = html.replace(/(\/\/.*)/g, '<span class="text-neutral-500 italic">$1</span>');
    
    return { __html: html };
  }, [code]);

  return (
    <div className={cn(
      "overflow-hidden flex flex-col h-full bg-[#0a0a0a]",
      !inExplorer && "rounded-[24px] border border-white/10 shadow-2xl"
    )}>
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          {!inExplorer && (
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              {filename}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? "COPIED ✓" : "COPY"}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {!inExplorer && (
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className={cn(
        "p-6 md:p-8 font-mono text-sm leading-relaxed overflow-auto text-neutral-300 custom-scrollbar flex-1",
        !inExplorer && "min-h-[300px] max-h-[600px]"
      )}>
        <pre className={cn("font-inherit", filename.endsWith('.txt') || filename.endsWith('.md') ? "whitespace-pre-wrap break-words" : "whitespace-pre")}>
          {highlightedCode ? (
            <code dangerouslySetInnerHTML={highlightedCode} />
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
