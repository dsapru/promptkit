import { supabase } from '@/lib/supabase'
import { randomBytes } from 'crypto'

function generateEditToken(): string {
  return randomBytes(18).toString('base64url').slice(0, 24)
}

export async function POST(request: Request) {
  let body: {
    title?: string
    systemInstruction?: string
    userPrompt: string
    model: string
    temperature: number
    output?: string
    parentId?: string
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    title,
    systemInstruction,
    userPrompt,
    model,
    temperature,
    output,
    parentId,
  } = body

  if (!userPrompt || !model || temperature === undefined) {
    return Response.json(
      { error: 'Missing required fields: userPrompt, model, temperature' },
      { status: 400 }
    )
  }

  const editToken = generateEditToken()

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      title: title || null,
      system_instruction: systemInstruction || null,
      user_prompt: userPrompt,
      model,
      temperature,
      output: output || null,
      parent_id: parentId || null,
      edit_token: editToken,
    })
    .select('id')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ id: data.id, editToken })
}
