import { Shield, Zap, Cloud, Code2, Brain, Award, Heart, GitBranch } from 'lucide-react'

const TECH = [
  { icon: <Brain size={20} color="#a78bfa" />, name: 'Groq LLaMA 3.3-70b', desc: 'AI-powered daily decisions', color: '#a78bfa' },
  { icon: <Cloud size={20} color="#60a5fa" />, name: 'OpenWeatherMap', desc: 'Real-time hyperlocal weather', color: '#60a5fa' },
  { icon: <Zap size={20} color="#fb923c" />, name: 'scikit-learn RF', desc: 'ML risk score prediction', color: '#fb923c' },
  { icon: <Code2 size={20} color="#4ade80" />, name: 'FastAPI + React', desc: 'Backend & frontend stack', color: '#4ade80' },
]

export function CreditsTab() {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

      {/* Hackathon hero card */}
      <div className="glass-hero-card anim-fade-up">
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="glass-icon-badge" style={{ width: 32, height: 32, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
              <Award size={16} color="#fbbf24" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Official Entry
            </span>
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            WeatherWise Hack
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
            Team Code: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>XXX-523</strong>
          </p>
          <div className="glass-badge" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', gap: 6 }}>
            <Shield size={12} /> Made for WeatherWise Hack
          </div>
        </div>
      </div>

      {/* About */}
      <div>
        <p className="glass-section-label">About</p>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="glass-icon-badge" style={{ width: 48, height: 48, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Shield size={24} color="#4ade80" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Raksha</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Safe Daily Decision</p>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Raksha (रक्षा) means <em style={{ color: 'rgba(255,255,255,0.8)' }}>protection</em> in Sanskrit. We built this app to
            give families one clear, AI-powered safety decision every day — based on
            hyperlocal flood, heat, and storm risk — so you never have to guess
            whether it's safe to step outside.
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <p className="glass-section-label">Built With</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TECH.map(({ icon, name, desc, color }, i) => (
            <div key={name} className="glass-card anim-fade-up" style={{ animationDelay: `${i * 60}ms`, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="glass-icon-badge" style={{ width: 40, height: 40, background: `${color}15`, border: `1px solid ${color}30` }}>
                  {icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub */}
      <div>
        <p className="glass-section-label">Source</p>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="glass-icon-badge" style={{ width: 40, height: 40 }}>
                <GitBranch size={20} color="rgba(255,255,255,0.6)" />
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: '#fff' }}>View on GitHub</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Open source — MIT License</p>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '0 0 4px' }}>
          Made with <Heart size={11} color="#f87171" style={{ filter: 'drop-shadow(0 0 4px #f87171)' }} /> for WeatherWise Hack
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Raksha v1.0 · Team XXX-523
        </p>
      </div>
    </div>
  )
}
