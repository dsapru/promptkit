/**
 * Seed script — inserts the featured "Brain dump to PRD" prompt into Supabase
 * and prints the ID to hardcode in src/components/Hero.tsx.
 *
 * Usage:
 *   pnpm tsx scripts/seed-featured.ts
 *
 * Requirements:
 *   - .env.local must have NEXT_PUBLIC_SUPABASE_URL and
 *     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *   - The `prompts` table must already exist in Supabase (run the SQL from README)
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

// ── Parse .env.local manually (no extra deps needed) ──────────────────────────
function parseEnvFile(path: string): Record<string, string> {
  const env: Record<string, string> = {}
  try {
    const lines = readFileSync(path, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      env[key] = val
    }
  } catch {
    // file not found — will fail on the validation below
  }
  return env
}

const env = parseEnvFile('.env.local')

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌  Missing env vars. Make sure .env.local has:\n' +
      '   NEXT_PUBLIC_SUPABASE_URL\n' +
      '   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)'
  )
  process.exit(1)
}

if (supabaseUrl.startsWith('your_') || supabaseKey.startsWith('your_')) {
  console.error('❌  .env.local still has placeholder values. Fill in real credentials first.')
  process.exit(1)
}

// ── Featured prompt data ───────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are an experienced product manager who writes crisp, scannable PRDs. Take a rough brain dump from the user and turn it into a structured PRD with these sections, in this order:

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
- Success metrics must be specific and measurable, with a target if implied by the input.`

const USER_PROMPT = `We keep losing customers in onboarding. Our setup wizard has 7 steps and takes 8 minutes on average. Time to first value is too long. Want to redesign for time-to-first-value under 90 seconds. Mobile is most affected. Engineering bandwidth is one designer plus two engineers for six weeks.`

// ── Insert ─────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const editToken = randomBytes(18).toString('base64url').slice(0, 24)

  console.log('⏳  Inserting featured prompt into Supabase…')

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      title: 'Brain dump to PRD',
      system_instruction: SYSTEM_INSTRUCTION,
      user_prompt: USER_PROMPT,
      model: 'gemini-2.5-pro',
      temperature: 0.4,
      output: null,
      parent_id: null,
      edit_token: editToken,
    })
    .select('id')
    .single()

  if (error) {
    console.error('❌  Supabase error:', error.message)
    process.exit(1)
  }

  console.log('\n✅  Featured prompt seeded!')
  console.log(`   Prompt ID  : ${data.id}`)
  console.log(`   Edit token : ${editToken}`)
  console.log(`   Public URL : /p/${data.id}`)
  console.log()
  console.log('👉  Now hardcode the ID in src/components/Hero.tsx:')
  console.log()
  console.log(`   const FEATURED_PROMPT_ID = '${data.id}'`)
  console.log()
}

main()
