'use client'

import { Zap } from 'lucide-react'

// ─── Featured Prompt ──────────────────────────────────────────────────────────
// Seeded via `pnpm seed`. Used to identify the canonical public example.
const FEATURED_PROMPT_ID = '03ad0713-bccb-4607-8dce-a14a4cbde1aa'
export { FEATURED_PROMPT_ID }

export const EXAMPLE_PROMPT = {
  title: 'Brain dump to PRD',
  systemInstruction: `You are an experienced product manager who writes crisp, scannable PRDs. Take a rough brain dump from the user and turn it into a structured PRD with these sections, in this order:

1. Problem
2. Goals
3. Non-goals
4. Proposed solution
5. Success metrics
6. Risks and open questions

Rules:
- Be concise. No filler. No hedging language.
- Where the brain dump has gaps, flag them under Open questions instead of inventing details.
- Use markdown headings (##) for each section.
- Use bullet points within sections, not paragraphs.
- Success metrics must be specific and measurable, with a target if implied by the input.`,
  userPrompt: `We keep losing customers in onboarding. Our setup wizard has 7 steps and takes 8 minutes on average. Time to first value is too long. Want to redesign for time-to-first-value under 90 seconds. Mobile is most affected. Engineering bandwidth is one designer plus two engineers for six weeks.`,
  model: 'gemini-2.5-pro',
  temperature: 0.4,
}

interface HeroProps {
  onTryExample: (example: typeof EXAMPLE_PROMPT) => void
}

const GITHUB_URL = 'https://github.com/dsapru/promptkit'

export default function Hero({ onTryExample }: HeroProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50 bg-background">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gradient orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-violet-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium">
              <Zap className="w-3 h-3" />
              Powered by Gemini API
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-foreground leading-[1.1] mb-5">
            Stop pasting prompts
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              into Slack.
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            PromptKit gives you shareable URLs, version history, and side-by-side
            diffs for your Gemini prompts.{' '}
            <span className="text-foreground/80">Like CodePen, for prompts.</span>
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Primary: scroll to editor + load featured example */}
            <button
              id="hero-try-example"
              onClick={() => onTryExample(EXAMPLE_PROMPT)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-150 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-4 h-4" />
              Try the example
            </button>

            {/* Secondary: GitHub */}
            <a
              id="hero-github-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:border-border/80 hover:bg-muted/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Attribution strip */}
      <div className="border-b border-border/30 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center gap-1.5 text-[12px] text-muted-foreground/50">
          Built in a jiffy with{' '}
          <a
            href="https://antigravity.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/70 hover:text-violet-400 transition-colors underline underline-offset-2 decoration-dotted"
          >
            Antigravity
          </a>
          .{' '}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/70 hover:text-violet-400 transition-colors underline underline-offset-2 decoration-dotted"
          >
            Open source
          </a>
          .
        </div>
      </div>
    </>
  )
}
