'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Hero, { EXAMPLE_PROMPT } from '@/components/Hero'
import PromptEditor, { type PromptConfig } from '@/components/PromptEditor'
import OutputPanel from '@/components/OutputPanel'

const DEFAULT_CONFIG: PromptConfig = {
  title: '',
  systemInstruction: '',
  userPrompt: '',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
}

export default function HomePage() {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)

  const [config, setConfig] = useState<PromptConfig>(DEFAULT_CONFIG)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canSave, setCanSave] = useState(false)

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
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save')
      } else {
        toast.success('Saved! Redirecting to your prompt…')
        router.push(`/p/${data.id}?token=${data.editToken}`)
      }
    } catch {
      toast.error('Network error — could not save')
    } finally {
      setIsSaving(false)
    }
  }, [canSave, config, output, router])

  const handleTryExample = useCallback(
    (example: typeof EXAMPLE_PROMPT) => {
      setConfig({
        title: example.title,
        systemInstruction: example.systemInstruction,
        userPrompt: example.userPrompt,
        model: example.model,
        temperature: example.temperature,
      })
      setOutput('')
      setError(null)
      setCanSave(false)
      // Scroll to editor
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    },
    []
  )

  return (
    <main className="flex flex-col min-h-screen">
      <Hero onTryExample={handleTryExample} />

      {/* Editor section */}
      <div ref={editorRef} className="flex-1 max-w-[1400px] w-full mx-auto">
        {/* Navbar-like prompt bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              New prompt
            </span>
          </div>
          <div className="ml-auto text-[11px] text-muted-foreground/50 hidden md:block">
            Changes are local until you Save
          </div>
        </div>

        {/* Two-pane split */}
        <div className="flex flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {/* Left pane — editor */}
          <div className="w-full md:w-1/2 border-r border-border/50 min-h-[600px] md:min-h-0">
            <PromptEditor
              config={config}
              onChange={setConfig}
              onRun={handleRun}
              onSave={handleSave}
              isRunning={isRunning}
              isSaving={isSaving}
              canSave={canSave}
              readOnly={false}
            />
          </div>

          {/* Right pane — output */}
          <div className="w-full md:w-1/2 min-h-[400px] md:min-h-0">
            <OutputPanel
              output={output}
              error={error}
              isRunning={isRunning}
              config={config}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
