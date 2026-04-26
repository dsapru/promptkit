'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Check, Code2, ChevronDown, AlertTriangle, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateTypeScript, generatePython } from '@/lib/codegen'
import type { PromptConfig } from '@/components/PromptEditor'

interface OutputPanelProps {
  output: string
  error: string | null
  isRunning: boolean
  config: PromptConfig
}

function SkeletonLoader() {
  return (
    <div className="space-y-2.5 p-5 animate-pulse">
      {[90, 75, 60, 85, 45].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded bg-muted/50"
          style={{ width: `${w}%` }}
        />
      ))}
      <div className="h-3 rounded bg-muted/50 w-[30%]" />
      <div className="mt-4 space-y-2">
        {[70, 55, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded bg-muted/50"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function OutputPanel({
  output,
  error,
  isRunning,
  config,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false)
  const [codeMenuOpen, setCodeMenuOpen] = useState(false)

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success('Output copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCode = async (lang: 'typescript' | 'python') => {
    const code =
      lang === 'typescript'
        ? generateTypeScript({ ...config, output })
        : generatePython({ ...config, output })
    await navigator.clipboard.writeText(code)
    toast.success(`${lang === 'typescript' ? 'TypeScript' : 'Python'} snippet copied`)
    setCodeMenuOpen(false)
  }

  return (
    <div className="flex flex-col h-full border-l border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Output</span>
          {output && !isRunning && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
              ✓ Ready
            </span>
          )}
        </div>

        {output && !isRunning && (
          <div className="flex items-center gap-1.5">
            {/* Copy output */}
            <Button
              id="copy-output-button"
              size="sm"
              variant="ghost"
              onClick={copyOutput}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
            </Button>

            {/* Copy as code dropdown */}
            <div className="relative">
              <Button
                id="copy-code-button"
                size="sm"
                variant="ghost"
                onClick={() => setCodeMenuOpen((o) => !o)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="ml-1">Copy as code</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </Button>
              {codeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCodeMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-md border border-border bg-popover shadow-lg shadow-black/30 overflow-hidden">
                    <button
                      id="copy-typescript-button"
                      onClick={() => copyCode('typescript')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <span className="text-blue-400 font-mono text-xs font-bold">TS</span>
                      TypeScript snippet
                    </button>
                    <button
                      id="copy-python-button"
                      onClick={() => copyCode('python')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <span className="text-yellow-400 font-mono text-xs font-bold">PY</span>
                      Python snippet
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isRunning ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="p-5">
            <div className="flex items-start gap-3 p-4 rounded-md border border-destructive/30 bg-destructive/10">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive mb-1">
                  Error
                </p>
                <p className="text-sm text-destructive/80 font-mono leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : output ? (
          <pre
            id="output-content"
            className="p-5 text-sm font-mono leading-relaxed text-foreground whitespace-pre-wrap break-words"
          >
            {output}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Terminal className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Run your prompt to see output here
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Press <kbd className="font-mono">⌘↵</kbd> to run
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
