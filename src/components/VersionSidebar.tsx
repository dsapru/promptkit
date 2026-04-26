'use client'

import { formatDistanceToNow } from '@/lib/time'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GitBranch, GitCommit, ScanSearch } from 'lucide-react'
import type { Prompt } from '@/lib/supabase'
import type { PromptConfig } from '@/components/PromptEditor'

interface VersionSidebarProps {
  versions: Prompt[]
  currentId: string
  onLoad: (version: Prompt) => void
  onCompare: (version: Prompt) => void
}

function modelShort(model: string) {
  if (model.includes('2.5-pro')) return '2.5 Pro'
  if (model.includes('2.5-flash-lite')) return '2.5 Lite'
  if (model.includes('2.5-flash')) return '2.5 Flash'
  return model
}

export default function VersionSidebar({
  versions,
  currentId,
  onLoad,
  onCompare,
}: VersionSidebarProps) {
  if (versions.length === 0) return null

  return (
    <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-border/50 bg-background flex flex-col">
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Version History
          </span>
          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
            {versions.length}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {versions.map((v, index) => {
          const isCurrent = v.id === currentId
          const versionNumber = versions.length - index
          return (
            <div key={v.id} className="relative">
              {/* Timeline line */}
              {index < versions.length - 1 && (
                <div className="absolute left-[1.9rem] top-10 bottom-0 w-px bg-border/50" />
              )}
              <div
                className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 ${
                  isCurrent ? 'bg-violet-500/5 border-l-2 border-violet-500' : 'border-l-2 border-transparent'
                }`}
                onClick={() => onLoad(v)}
              >
                {/* Version dot */}
                <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  isCurrent
                    ? 'border-violet-500 bg-violet-500/20'
                    : 'border-border bg-background'
                }`}>
                  <GitCommit className={`w-2.5 h-2.5 ${isCurrent ? 'text-violet-400' : 'text-muted-foreground/50'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-violet-400' : 'text-muted-foreground'}`}>
                      v{versionNumber}
                    </span>
                    {isCurrent && (
                      <Badge className="text-[9px] px-1 py-0 bg-violet-500/20 text-violet-400 border-violet-500/30">
                        current
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto border-border/50 text-muted-foreground/70">
                      {modelShort(v.model)}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-border/50 text-muted-foreground/70">
                      t={v.temperature}
                    </Badge>
                  </div>

                  <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                    {v.user_prompt}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground/50">
                      {formatDistanceToNow(v.created_at)}
                    </span>
                    {!isCurrent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCompare(v)
                        }}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-violet-400 transition-all duration-150"
                        title="Compare with current version"
                      >
                        <ScanSearch className="w-3 h-3" />
                        Compare
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {index < versions.length - 1 && <Separator className="opacity-30 mx-4" />}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
