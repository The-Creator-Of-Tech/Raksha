import { useState } from 'react'
import { Shield, MapPin, Users } from 'lucide-react'
import type { UserConfig, GoogleUser } from '../App'

interface Props { user: GoogleUser; onComplete: (config: UserConfig) => void }

export function OnboardingScreen({ user, onComplete }: Props) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [kids, setKids] = useState(false)
  const [elderly, setElderly] = useState(false)

  return (
    <div className="app-shell" style={{ padding: '0 20px', minHeight: '100dvh', justifyContent: 'space-between' }}>
      <div style={{ paddingTop: 72, paddingBottom: 24 }}>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 18,
          background: 'rgba(74,222,128,0.15)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(74,222,128,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(74,222,128,0.15)',
        }}>
          <Shield size={28} color="#4ade80" style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.5))' }} />
        </div>

        <h1 className="anim-fade-up" style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Welcome, {user.name.split(' ')[0]}
        </h1>
        <p className="anim-fade-up d-50" style={{ color: 'rgba(255,255,255,0.55)', margin: '0 0 32px', fontSize: 14, lineHeight: 1.6 }}>
          Tell us about your location and household so we can personalise your safety alerts.
        </p>

        {/* Location */}
        <div className="anim-fade-up d-100" style={{ marginBottom: 20 }}>
          <p className="glass-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={12} /> Location
          </p>
          <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'City', val: city, set: setCity, placeholder: 'e.g. Mumbai' },
              { label: 'Country', val: country, set: setCountry, placeholder: 'e.g. India' },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
                <input
                  className="glass-input"
                  type="text"
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Household */}
        <div className="anim-fade-up d-200">
          <p className="glass-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={12} /> Household members
          </p>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { label: 'Children present', sub: 'Under 12 years old', val: kids, set: setKids },
              { label: 'Elderly present',  sub: '65 years and above', val: elderly, set: setElderly },
            ].map(({ label, sub, val, set }, i) => (
              <div key={label}>
                {i > 0 && <div className="glass-divider" />}
                <div className="glass-list-item">
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 1px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{sub}</p>
                  </div>
                  <label className="glass-switch">
                    <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
                    <div className="glass-switch-track" />
                    <div className="glass-switch-thumb" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="anim-fade-up d-300" style={{ paddingBottom: 40 }}>
        <button
          className="glass-btn glass-btn-primary glass-btn-lg"
          style={{ width: '100%', opacity: (!city.trim() || !country.trim()) ? 0.45 : 1 }}
          disabled={!city.trim() || !country.trim()}
          onClick={() => onComplete({ city, country, kids_present: kids, elderly_present: elderly })}
        >
          <Shield size={17} /> Protect My Family
        </button>
      </div>
    </div>
  )
}
