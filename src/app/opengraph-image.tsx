import { ImageResponse } from 'next/og'

export const alt = 'PromptKit: Shareable, Versionable Prompts for the Gemini API'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Fetch Inter SemiBold from Google Fonts CDN
  const interData = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#09090b',
          padding: '72px 80px 60px',
        }}
      >
        {/* Top gradient glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: 300,
            width: 700,
            height: 500,
            borderRadius: '50%',
            background:
              'linear-gradient(180deg, rgba(124,58,237,0.18) 0%, rgba(59,130,246,0.06) 60%, transparent 100%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52 }}>
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
          <span
            style={{
              color: '#a1a1aa',
              fontSize: 20,
              fontFamily: 'Inter',
              letterSpacing: '-0.02em',
            }}
          >
            PromptKit
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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

          {/* Subheading */}
          <div
            style={{
              fontSize: 28,
              color: '#52525b',
              fontFamily: 'Inter',
              lineHeight: 1.5,
            }}
          >
            PromptKit: shareable, versionable prompts for the Gemini API.{' '}
            <span style={{ color: '#71717a' }}>Like CodePen, for prompts.</span>
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1c1c1e',
            paddingTop: 24,
          }}
        >
          <span style={{ color: '#3f3f46', fontSize: 18, fontFamily: 'Inter' }}>
            Built with Antigravity
          </span>
          <span style={{ color: '#3f3f46', fontSize: 18, fontFamily: 'Inter' }}>
            promptkit-seven.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
