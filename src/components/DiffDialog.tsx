'use client'

import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { Prompt } from '@/lib/supabase'

// Dynamically import to avoid SSR issues with react-diff-viewer
const ReactDiffViewer = dynamic(() => import('react-diff-viewer-continued'), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
      Loading diff…
    </div>
  ),
})

interface DiffDialogProps {
  open: boolean
  onClose: () => void
  older: Prompt | null
  newer: Prompt | null
}

function modelLabel(model: string) {
  if (model.includes('2.5-pro')) return 'Gemini 2.5 Pro'
  if (model.includes('2.5-flash-lite')) return 'Gemini 2.5 Flash Lite'
  if (model.includes('2.5-flash')) return 'Gemini 2.5 Flash'
  return model
}

export default function DiffDialog({ open, onClose, older, newer }: DiffDialogProps) {
  if (!older || !newer) return null

  const diffStyles = {
    variables: {
      dark: {
        diffViewerBackground: 'transparent',
        addedBackground: 'rgba(34, 197, 94, 0.08)',
        addedColor: '#86efac',
        removedBackground: 'rgba(239, 68, 68, 0.08)',
        removedColor: '#fca5a5',
        wordAddedBackground: 'rgba(34, 197, 94, 0.25)',
        wordRemovedBackground: 'rgba(239, 68, 68, 0.25)',
        addedGutterBackground: 'rgba(34, 197, 94, 0.12)',
        removedGutterBackground: 'rgba(239, 68, 68, 0.12)',
        gutterBackground: 'transparent',
        gutterColor: 'rgba(255,255,255,0.2)',
        codeFoldBackground: 'rgba(255,255,255,0.03)',
        codeFoldGutterBackground: 'rgba(255,255,255,0.03)',
        codeFoldContentColor: 'rgba(255,255,255,0.3)',
        emptyLineBackground: 'transparent',
      },
    },
    contentText: {
      fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
      fontSize: '12px',
    },
  }

  const settings = [
    {
      key: 'Model',
      older: modelLabel(older.model),
      newer: modelLabel(newer.model),
    },
    {
      key: 'Temperature',
      older: String(older.temperature),
      newer: String(newer.temperature),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-background border-border/60 shadow-2xl shadow-black/40">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            Version Diff
            <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground font-normal">
              side-by-side
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* System Instruction */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              System Instruction
            </h3>
            <div className="rounded-md overflow-hidden border border-border/40 bg-muted/10">
              <ReactDiffViewer
                oldValue={older.system_instruction || ''}
                newValue={newer.system_instruction || ''}
                splitView={true}
                useDarkTheme={true}
                hideLineNumbers={false}
                styles={diffStyles}
              />
            </div>
          </section>

          {/* User Prompt */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              User Prompt
            </h3>
            <div className="rounded-md overflow-hidden border border-border/40 bg-muted/10">
              <ReactDiffViewer
                oldValue={older.user_prompt}
                newValue={newer.user_prompt}
                splitView={true}
                useDarkTheme={true}
                hideLineNumbers={false}
                styles={diffStyles}
              />
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Settings
            </h3>
            <div className="rounded-md border border-border/40 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground w-1/4">Setting</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Older version</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">This version</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map(({ key, older: o, newer: n }) => (
                    <tr key={key} className="border-b border-border/30 last:border-0">
                      <td className="px-4 py-2.5 text-muted-foreground font-medium">{key}</td>
                      <td className={`px-4 py-2.5 font-mono ${o !== n ? 'text-red-400 bg-red-500/5' : 'text-foreground/70'}`}>
                        {o}
                      </td>
                      <td className={`px-4 py-2.5 font-mono ${o !== n ? 'text-emerald-400 bg-emerald-500/5' : 'text-foreground/70'}`}>
                        {n}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
