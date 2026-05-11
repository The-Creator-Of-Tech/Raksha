import { useState } from 'react'
import { Moon, Sun, LogOut, Save, MapPin, Users } from 'lucide-react'
import type { UserConfig, GoogleUser, Theme } from '../App'

interface Props {
  user: GoogleUser; config: UserConfig; theme: Theme
  onUpdate: (c: UserConfig) => void; onLogout: () => void; onToggleTheme: () => void
}

export function SettingsTab({ user, config, theme, onUpdate, onLogout, onToggleTheme }: Props) {
  const [city, setCity] = useState(config.city)
  const [country, setCountry] = useState(config.country)
  const [kids, setKids] = useState(config.kids_present)
  const [elderly, setElderly] = useState(config.elderly_present)
  const [saved, setSaved] = useState(false)

  const dirty = city !== config.city || country !== config.country
    || kids !== config.kids_present || elderly !== config.elderly_present

  const handleSave = () => {
    onUpdate({ city, country, kids_present: kids, elderly_present: elderly })
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* User card */}
      <div className="glass-card anim-fade-up" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user.picture
            ? <img src={user.picture} alt={user.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
            : <div className="glass-icon-badge" style={{ width: 52, height: 52, fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {user.name?.[0]}
              </div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div>
        <p className="glass-section-label">Appearance</p>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="glass-list-item">
            <div className="glass-icon-badge" style={{ width: 38, height: 38, background: theme === 'dark' ? 'rgba(167,139,250,0.15)' : 'rgba(251,191,36,0.15)', border: `1px solid ${theme === 'dark' ? 'rgba(167,139,250,0.3)' : 'rgba(251,191,36,0.3)'}` }}>
              {theme === 'dark' ? <Moon size={18} color="#a78bfa" /> : <Sun size={18} color="#fbbf24" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 1px', fontSize: 14, fontWeight: 600, color: '#fff' }}>Dark Mode</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{theme === 'dark' ? 'Currently on' : 'Currently off'}</p>
            </div>
            <label className="glass-switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={onToggleTheme} />
              <div className="glass-switch-track" />
              <div className="glass-switch-thumb" />
            </label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="glass-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={12} /> Location
        </p>
        <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'City', val: city, set: setCity, placeholder: 'e.g. Mumbai' },
            { label: 'Country', val: country, set: setCountry, placeholder: 'e.g. India' },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
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
      <div>
        <p className="glass-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={12} /> Household
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

      {/* Save */}
      {dirty && (
        <button className="glass-btn glass-btn-primary glass-btn-lg" style={{ width: '100%' }} onClick={handleSave}>
          <Save size={17} /> {saved ? 'Saved & refreshed ✓' : 'Save & Refresh'}
        </button>
      )}

      {/* Sign out */}
      <div style={{ marginTop: 4 }}>
        <div className="glass-divider" style={{ marginBottom: 14 }} />
        <button
          className="glass-text-btn"
          style={{ width: '100%', justifyContent: 'flex-start', color: '#f87171', padding: '10px 4px' }}
          onClick={onLogout}
        >
          <LogOut size={16} color="#f87171" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Sign out</span>
        </button>
      </div>
    </div>
  )
}
