import { notFound } from 'next/navigation'
import { supabase, type Prompt } from '@/lib/supabase'
import SharedPromptClient from './SharedPromptClient'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchAncestors(prompt: Prompt): Promise<Prompt[]> {
  const ancestors: Prompt[] = []
  let current = prompt

  while (current.parent_id) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', current.parent_id)
      .single()

    if (error || !data) break
    ancestors.push(data as Prompt)
    current = data as Prompt
  }

  return ancestors
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase.from('prompts').select('title, user_prompt').eq('id', id).single()
  
  const title = data?.title || `Prompt ${id.slice(0, 8)}`
  const description = data?.user_prompt?.slice(0, 160) || 'A shared Gemini prompt'

  return {
    title: `${title} — PromptKit`,
    description,
  }
}

export default async function SharedPromptPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const sp = await searchParams
  const token = typeof sp.token === 'string' ? sp.token : null

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const prompt = data as Prompt
  const ancestors = await fetchAncestors(prompt)

  return (
    <SharedPromptClient
      prompt={prompt}
      ancestors={ancestors}
      editToken={token}
    />
  )
}
