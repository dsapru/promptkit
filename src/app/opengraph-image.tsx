import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'PromptKit: Shareable, Versionable Prompts for the Gemini API'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Font bundled locally — no network dependency at build time.
  // One-time setup: curl -sL https://fonts.bunny.net/inter/files/inter-latin-600-normal.woff \
  //                      -o public/fonts/Inter-SemiBold.woff
  const fontData = await readFile(
    join(process.cwd(), 'public', 'fonts', 'Inter-SemiBold.woff')
  )

  return new ImageResponse(
    (
      // Root — Satori rule: every element with >1 child MUST have display:flex
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // Subtle radial gradient baked into the background
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(124,58,237,0.20) 0%, transparent 70%), #09090b',
          padding: '72px 80px 60px',
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 52,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Inter',
            }}
          >
            P
          </div>
          <div
            style={{
              color: '#a1a1aa',
              fontSize: 20,
              fontFamily: 'Inter',
              letterSpacing: '-0.02em',
            }}
          >
            PromptKit
          </div>
        </div>

        {/* Main area */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Headline line 1 — single text child, no flex needed */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: '#fafafa',
              lineHeight: 1.08,
              fontFamily: 'Inter',
              letterSpacing: '-0.03em',
            }}
          >
            Stop pasting prompts
          </div>

          {/* Headline line 2 — violet accent */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: '#a78bfa',
              lineHeight: 1.08,
              fontFamily: 'Inter',
              letterSpacing: '-0.03em',
              marginBottom: 36,
            }}
          >
            into Slack.
          </div>

          {/* Subhead — single text string, avoids mixed text+element children */}
          <div
            style={{
              fontSize: 28,
              color: '#71717a',
              fontFamily: 'Inter',
              lineHeight: 1.5,
            }}
          >
            PromptKit: shareable, versionable prompts for the Gemini API. Like CodePen, for prompts.
          </div>
        </div>

        {/* Footer — two children, must be flex */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1c1c1e',
            paddingTop: 24,
          }}
        >
          <div style={{ color: '#3f3f46', fontSize: 18, fontFamily: 'Inter' }}>
            Built with Antigravity
          </div>
          <div style={{ color: '#3f3f46', fontSize: 18, fontFamily: 'Inter' }}>
            promptkit-seven.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
