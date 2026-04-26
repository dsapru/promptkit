'use client'

import { useEffect, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Play, Save, GitFork, Loader2 } from 'lucide-react'

export type PromptConfig = {
  title: string
  systemInstruction: string
  userPrompt: string
  model: string
  temperature: number
}

const MODELS = [
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
]

interface PromptEditorProps {
  config: PromptConfig
  onChange: (config: PromptConfig) => void
  onRun: () => void
  onSave: () => void
  isRunning: boolean
  isSaving: boolean
  canSave: boolean
  readOnly?: boolean
  onFork?: () => void
}

export default function PromptEditor({
  config,
  onChange,
  onRun,
  onSave,
  isRunning,
  isSaving,
  canSave,
  readOnly = false,
  onFork,
}: PromptEditorProps) {
  const runButtonRef = useRef<HTMLButtonElement>(null)

  // Cmd+Enter / Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!isRunning) onRun()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isRunning, onRun])

  const update = (patch: Partial<PromptConfig>) =>
    onChange({ ...config, ...patch })

  return (
    <div className="flex flex-col h-full gap-4 p-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="prompt-title" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Title
        </Label>
        <input
          id="prompt-title"
          type="text"
          placeholder="Untitled prompt"
          value={config.title}
          onChange={(e) => update({ title: e.target.value })}
          disabled={readOnly}
          className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      {/* System Instruction */}
      <div className="space-y-1.5">
        <Label htmlFor="system-instruction" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          System Instruction
        </Label>
        <Textarea
          id="system-instruction"
          placeholder="You are a helpful assistant..."
          value={config.systemInstruction}
          onChange={(e) => update({ systemInstruction: e.target.value })}
          disabled={readOnly}
          rows={6}
          className="resize-none font-mono text-sm bg-muted/30 border-border/60 focus:border-ring placeholder:text-muted-foreground/40"
        />
      </div>

      {/* User Prompt */}
      <div className="space-y-1.5 flex-1">
        <Label htmlFor="user-prompt" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          User Prompt
        </Label>
        <Textarea
          id="user-prompt"
          placeholder="Enter your prompt here..."
          value={config.userPrompt}
          onChange={(e) => update({ userPrompt: e.target.value })}
          disabled={readOnly}
          rows={8}
          className="resize-none font-mono text-sm bg-muted/30 border-border/60 focus:border-ring placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Model + Temperature */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="model-select" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Model
          </Label>
          <Select
            value={config.model}
            onValueChange={(v) => { if (v) update({ model: v }) }}
            disabled={readOnly}
          >
            <SelectTrigger id="model-select" className="text-sm bg-muted/30 border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-sm">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex justify-between">
            Temperature
            <span className="text-foreground font-mono">{config.temperature.toFixed(1)}</span>
          </Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={[config.temperature]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v
                if (typeof val === 'number') update({ temperature: val })
              }}
              disabled={readOnly}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1">
              <span>0 — precise</span>
              <span>2 — creative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <Button
          ref={runButtonRef}
          id="run-button"
          onClick={onRun}
          disabled={isRunning || !config.userPrompt.trim()}
          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-150"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running…
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run
              <kbd className="ml-2 opacity-50 text-[10px] font-mono">⌘↵</kbd>
            </>
          )}
        </Button>

        {readOnly ? (
          <Button
            id="fork-button"
            variant="outline"
            onClick={onFork}
            className="flex-1 border-border/60 hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5 transition-all duration-150"
          >
            <GitFork className="w-4 h-4 mr-2" />
            Fork
          </Button>
        ) : (
          <Button
            id="save-button"
            variant="outline"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="flex-1 border-border/60 hover:border-border transition-all duration-150 disabled:opacity-40"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
