import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Shield, Zap, CloudRain, Thermometer, Wind, Loader2 } from 'lucide-react'
import type { GoogleUser } from '../App'

interface Props { onLogin: (user: GoogleUser) => void; theme: string }

export function LoginScreen({ onLogin }: Props) {
  const hasClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const demoLogin = () => onLogin({
    name: 'Demo User', email: 'demo@raksha.app', picture: '', sub: 'demo_' + Date.now()
  })

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setGoogleError(null)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch user info')
        const profile = await res.json()
        onLogin({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          sub: profile.sub,
        })
      } catch {
        setGoogleError('Sign-in failed. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setGoogleError('Google sign-in was cancelled or failed.')
      setGoogleLoading(false)
    },
  })

  const features = [
    { icon: <CloudRain size={14} />, label: 'Flood & rain risk', color: '#60a5fa' },
    { icon: <Thermometer size={14} />, label: 'Heat alerts', color: '#fb923c' },
    { icon: <Wind size={14} />, label: 'Storm warnings', color: '#a78bfa' },
    { icon: <Zap size={14} />, label: 'AI decisions', color: '#4ade80' },
  ]

  return (
    <div className="app-shell" style={{ justifyContent: 'space-between', padding: '0 20px', minHeight: '100dvh' }}>

      {/* Top section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 72, paddingBottom: 32 }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 24,
            background: 'rgba(74,222,128,0.15)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(74,222,128,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            <Shield size={38} color="#4ade80" style={{ filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.6))' }} />
          </div>
        </div>

        <h1 className="anim-fade-up" style={{ margin: '0 0 10px', fontSize: 42, fontWeight: 800, color: '#fff', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          Raksha
        </h1>
        <p className="anim-fade-up d-100" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 32px', fontSize: 15, maxWidth: 280, lineHeight: 1.6 }}>
          One daily safety decision for your family — based on real weather and local risk data.
        </p>

        {/* Feature chips */}
        <div className="anim-fade-up d-200" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {features.map(f => (
            <span key={f.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)',
            }}>
              <span style={{ color: f.color, filter: `drop-shadow(0 0 4px ${f.color})` }}>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="anim-slide-up d-300" style={{ paddingBottom: 48, width: '100%' }}>
        <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          {hasClientId ? (
            <button
              className="glass-btn glass-btn-primary glass-btn-lg"
              style={{ width: '100%', opacity: googleLoading ? 0.7 : 1 }}
              onClick={() => { setGoogleError(null); googleLogin() }}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in…' : 'Sign in with Google'}
            </button>
          ) : (
            <button className="glass-btn glass-btn-primary glass-btn-lg" style={{ width: '100%' }} onClick={demoLogin}>
              <Shield size={17} /> Get Started
            </button>
          )}

          {googleError && (
            <p style={{ fontSize: 12, color: '#f87171', marginTop: 10, textAlign: 'center' }}>
              {googleError}
            </p>
          )}

          {hasClientId && (
            <button className="glass-text-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={demoLogin}>
              Continue without account
            </button>
          )}

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 16, textAlign: 'center' }}>
            Your data stays on your device.
          </p>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Made for WeatherWise Hack · Team XXX-523
        </p>
      </div>
    </div>
  )
}
