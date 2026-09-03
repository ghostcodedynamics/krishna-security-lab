import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

interface TerminalProps {
  className?: string;
  initialLines?: TerminalLine[];
  onCommand?: (command: string) => string | Promise<string>;
  prompt?: string;
  title?: string;
}

const defaultLines: TerminalLine[] = [
  { type: 'system', text: 'SECURITY LAB TERMINAL v0.1.0' },
  { type: 'system', text: 'Type "help" for available commands.' },
  { type: 'output', text: '' },
];

export function Terminal({
  className,
  initialLines = defaultLines,
  onCommand,
  prompt = '$',
  title = 'SECURITY LAB TERMINAL',
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isProcessing) return;

    setLines((prev) => [...prev, { type: 'input', text: `${prompt} ${cmd}` }]);
    setInput('');
    setIsProcessing(true);

    try {
      let result: string;
      if (onCommand) {
        result = await onCommand(cmd);
      } else {
        result = await defaultCommandHandler(cmd);
      }
      if (result) {
        setLines((prev) => [
          ...prev,
          ...result.split('\n').map((text) => ({ type: 'output' as const, text })),
        ]);
      }
    } catch (err) {
      setLines((prev) => [
        ...prev,
        { type: 'error', text: err instanceof Error ? err.message : 'Command failed' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-slate-700/60 bg-bg-primary overflow-hidden font-mono text-sm',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary border-b border-slate-700/50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-accent/80" />
          <span className="w-3 h-3 rounded-full bg-gold/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-accent/80" />
        </div>
        <span className="ml-2 text-xs text-slate-400 tracking-wider">{title}</span>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto max-h-80 min-h-[200px] space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'whitespace-pre-wrap break-words',
              line.type === 'input' && 'text-gold-light',
              line.type === 'output' && 'text-slate-300',
              line.type === 'error' && 'text-rose-accent',
              line.type === 'system' && 'text-cyan-accent/80'
            )}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-slate-700/50 bg-bg-secondary/50">
        <span className="text-gold-light select-none">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-600 caret-gold"
          placeholder={isProcessing ? 'Processing...' : 'Enter command...'}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}

async function defaultCommandHandler(cmd: string): Promise<string> {
  const lower = cmd.toLowerCase();
  if (lower === 'help') {
    return [
      'Available commands:',
      '  help          Show this help',
      '  lab status    Show lab environments status',
      '  clear         Clear terminal (refresh page for now)',
      '  whoami        Show current context',
    ].join('\n');
  }
  if (lower === 'lab status') {
    return [
      'Authentication Lab ........ ONLINE',
      'API Lab ................... LOCKED',
      'Database Lab .............. LOCKED',
      'XSS Lab ................... LOCKED',
      'IDOR Lab .................. LOCKED',
      'JWT Lab ................... LOCKED',
    ].join('\n');
  }
  if (lower === 'whoami') {
    return 'guest@krishna-security-lab ~ Phase 1';
  }
  if (lower === 'clear') {
    return 'Use browser refresh to clear for now.';
  }
  return `Command not found: ${cmd}. Type "help" for available commands.`;
}
