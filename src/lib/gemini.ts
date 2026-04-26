import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function runGemini({
  model,
  systemInstruction,
  userPrompt,
  temperature,
}: {
  model: string
  systemInstruction?: string
  userPrompt: string
  temperature: number
}): Promise<string> {
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemInstruction || undefined,
    generationConfig: {
      temperature,
    },
  })

  const result = await genModel.generateContent(userPrompt)
  return result.response.text()
}
