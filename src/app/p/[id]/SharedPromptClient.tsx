'use client'

import { useState, useCallback, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { supabase, type Prompt } from '@/lib/supabase'
import PromptEditor, { type PromptConfig } from '@/components/PromptEditor'
import OutputPanel from '@/components/OutputPanel'
import VersionSidebar from '@/components/VersionSidebar'
import DiffDialog from '@/components/DiffDialog'
import { Share2, Check, GitBranch, ExternalLink, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SharedPromptClientProps {
  prompt: Prompt
  ancestors: Prompt[]
  editToken: string | null
}

export default function SharedPromptClient({
  prompt,
  ancestors,
  editToken,
}: SharedPromptClientProps) {
  const router = useRouter()
  const isReadOnly = !editToken || editToken !== prompt.edit_token

  // Build version list: current prompt + ancestors (newest first)
  const versions = [prompt, ...ancestors]

  const [config, setConfig] = useState<PromptConfig>({
    title: prompt.title || '',
    systemInstruction: prompt.system_instruction || '',
    userPrompt: prompt.user_prompt,
    model: prompt.model,
    temperature: prompt.temperature,
  })
  const [output, setOutput] = useState(prompt.output || '')
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canSave, setCanSave] = useState(!!prompt.output)
  const [copied, setCopied] = useState(false)

  // Diff dialog state
  const [diffOpen, setDiffOpen] = useState(false)
  const [diffTarget, setDiffTarget] = useState<Prompt | null>(null)

  const handleRun = useCallback(async () => {
    if (!config.userPrompt.trim()) return
    setIsRunning(true)
    setError(null)
    setOutput('')

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: config.systemInstruction,
          userPrompt: config.userPrompt,
          model: config.model,
          temperature: config.temperature,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setOutput(data.text)
        setCanSave(true)
      }
    } catch {
      setError('Network error — could not reach the API')
    } finally {
      setIsRunning(false)
    }
  }, [config])

  const handleSave = useCallback(async () => {
    if (!canSave) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.title,
          systemInstruction: config.systemInstruction,
          userPrompt: config.userPrompt,
          model: config.model,
          temperature: config.temperature,
          output,
          parentId: prompt.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save')
      } else {
        toast.success('New version saved!')
        router.push(`/p/${data.id}?token=${data.editToken}`)
      }
    } catch {
      toast.error('Network error — could not save')
    } finally {
      setIsSaving(false)
    }
  }, [canSave, config, output, prompt.id, router])

  const handleFork = useCallback(async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.title ? `Fork of ${config.title}` : 'Forked prompt',
          systemInstruction: config.systemInstruction,
          userPrompt: config.userPrompt,
          model: config.model,
          temperature: config.temperature,
          output,
          parentId: prompt.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to fork')
      } else {
        toast.success('Forked! You now own this version.')
        router.push(`/p/${data.id}?token=${data.editToken}`)
      }
    } catch {
      toast.error('Network error — could not fork')
    } finally {
      setIsSaving(false)
    }
  }, [config, output, prompt.id, router])

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${prompt.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Share URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLoadVersion = (v: Prompt) => {
    setConfig({
      title: v.title || '',
      systemInstruction: v.system_instruction || '',
      userPrompt: v.user_prompt,
      model: v.model,
      temperature: v.temperature,
    })
    setOutput(v.output || '')
    setError(null)
    setCanSave(!!v.output)
    router.push(`/p/${v.id}`)
  }

  const handleCompare = (v: Prompt) => {
    setDiffTarget(v)
    setDiffOpen(true)
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-10 overflow-hidden">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
        >
          <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">P</span>
          </div>
          PromptKit
        </a>

        <span className="text-border/80 hidden sm:inline">/</span>

        <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[200px] hidden sm:inline">
          {prompt.title || `Prompt ${prompt.id.slice(0, 8)}…`}
        </span>

        {isReadOnly && (
          <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400 bg-amber-500/5 ml-1">
            read-only
          </Badge>
        )}

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {ancestors.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <GitBranch className="w-3 h-3" />
              <span>{ancestors.length + 1} versions</span>
            </div>
          )}

          <button
            id="share-button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 hover:border-border text-xs text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <a
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border/60 hover:border-border text-xs text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">New prompt</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Two-pane split */}
        <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto">
          {/* Left — editor */}
          <div className="w-full md:w-1/2 border-r border-border/50 min-h-[600px] md:min-h-0">
            <PromptEditor
              config={config}
              onChange={setConfig}
              onRun={handleRun}
              onSave={handleSave}
              onFork={handleFork}
              isRunning={isRunning}
              isSaving={isSaving}
              canSave={canSave}
              readOnly={isReadOnly}
            />
          </div>

          {/* Right — output */}
          <div className="w-full md:w-1/2 min-h-[400px] md:min-h-0 border-r border-border/50">
            <OutputPanel
              output={output}
              error={error}
              isRunning={isRunning}
              config={config}
            />
          </div>
        </div>

        {/* Version sidebar */}
        {versions.length > 1 && (
          <VersionSidebar
            versions={versions}
            currentId={prompt.id}
            onLoad={handleLoadVersion}
            onCompare={handleCompare}
          />
        )}
      </div>

      {/* Diff dialog */}
      <DiffDialog
        open={diffOpen}
        onClose={() => setDiffOpen(false)}
        older={diffTarget}
        newer={prompt}
      />
    </main>
  )
}
