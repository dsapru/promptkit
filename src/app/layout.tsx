import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PromptKit — Shareable, Versionable Prompts for the Gemini API',
  description:
    'PromptKit gives you shareable URLs, version history, and side-by-side diffs for your Gemini prompts. Like CodePen, for prompts.',
  keywords: ['Gemini API', 'prompts', 'AI', 'version control', 'shareable prompts'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--popover-foreground))',
            },
          }}
        />
      </body>
    </html>
  )
}
