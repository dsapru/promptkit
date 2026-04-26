export type PromptConfig = {
  title?: string
  systemInstruction?: string
  userPrompt: string
  model: string
  temperature: number
  output?: string
}

export function generateTypeScript(config: PromptConfig): string {
  const lines: string[] = []
  lines.push(`import { GoogleGenerativeAI } from "@google/generative-ai";`)
  lines.push(``)
  lines.push(`const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);`)
  lines.push(``)
  lines.push(`async function main() {`)
  lines.push(`  const model = genAI.getGenerativeModel({`)
  lines.push(`    model: "${config.model}",`)
  if (config.systemInstruction) {
    lines.push(`    systemInstruction: ${JSON.stringify(config.systemInstruction)},`)
  }
  lines.push(`    generationConfig: {`)
  lines.push(`      temperature: ${config.temperature},`)
  lines.push(`    },`)
  lines.push(`  });`)
  lines.push(``)
  lines.push(`  const result = await model.generateContent(`)
  lines.push(`    ${JSON.stringify(config.userPrompt)}`)
  lines.push(`  );`)
  lines.push(`  console.log(result.response.text());`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`main();`)
  return lines.join('\n')
}

export function generatePython(config: PromptConfig): string {
  const lines: string[] = []
  lines.push(`import google.generativeai as genai`)
  lines.push(`import os`)
  lines.push(``)
  lines.push(`genai.configure(api_key=os.environ["GEMINI_API_KEY"])`)
  lines.push(``)
  lines.push(`model = genai.GenerativeModel(`)
  lines.push(`    model_name="${config.model}",`)
  if (config.systemInstruction) {
    lines.push(`    system_instruction=${JSON.stringify(config.systemInstruction)},`)
  }
  lines.push(`)`)
  lines.push(``)
  lines.push(`response = model.generate_content(`)
  lines.push(`    ${JSON.stringify(config.userPrompt)},`)
  lines.push(`    generation_config=genai.GenerationConfig(`)
  lines.push(`        temperature=${config.temperature},`)
  lines.push(`    ),`)
  lines.push(`)`)
  lines.push(`print(response.text)`)
  return lines.join('\n')
}
