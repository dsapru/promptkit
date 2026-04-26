import { NextRequest } from 'next/server'
import { runGemini } from '@/lib/gemini'

// Simple in-memory rate limiter: 6 calls per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 6
const WINDOW_MS = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (!checkRateLimit(ip)) {
    return Response.json(
      {
        error:
          "You've hit the rate limit (6 runs/min). Take a breath and try again shortly.",
      },
      { status: 429 }
    )
  }

  let body: {
    systemInstruction?: string
    userPrompt: string
    model: string
    temperature: number
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { systemInstruction, userPrompt, model, temperature } = body

  if (!userPrompt || !model || temperature === undefined) {
    return Response.json(
      { error: 'Missing required fields: userPrompt, model, temperature' },
      { status: 400 }
    )
  }

  try {
    const text = await runGemini({
      model,
      systemInstruction,
      userPrompt,
      temperature,
    })
    return Response.json({ text })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error from Gemini API'
    return Response.json({ error: message }, { status: 500 })
  }
}
