import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://promptkit-seven.vercel.app'
const TITLE = 'PromptKit: Shareable, Versionable Prompts for the Gemini API'
const DESCRIPTION =
  'PromptKit gives you shareable URLs, version history, and side-by-side diffs for your Gemini prompts. Like CodePen, for prompts.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Gemini API', 'prompts', 'AI', 'version control', 'shareable prompts'],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'PromptKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
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
        <Analytics />
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
