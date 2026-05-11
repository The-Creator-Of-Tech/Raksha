import { useState, useEffect, useCallback } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Home, MapPin, Settings, Star, MessageCircle } from 'lucide-react'

import { SafetyTab } from './tabs/SafetyTab'
import { ZonesTab } from './tabs/ZonesTab'
import { ChatTab } from './tabs/ChatTab'
import { SettingsTab } from './tabs/SettingsTab'
import { CreditsTab } from './tabs/CreditsTab'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingScreen } from './components/OnboardingScreen'

export type RiskLevel = 'SAFE' | 'CAUTION' | 'DANGER'
export type Theme = 'light' | 'dark'
export type WeatherState = 'default' | 'rain' | 'storm' | 'clear' | 'clouds' | 'hot' | 'mist' | 'snow'

export interface WeatherData {
  rainfall_mm: number; humidity_pct: number; wind_speed_kmh: number;
  temp_c: number; condition: string; description?: string; feels_like?: number;
}
export interface RiskData {
  risk_level: RiskLevel; score: number; decision: string;
  weather: WeatherData; elevation_m: number;
  historical_risk?: boolean;
  historical_details?: { zone_name?: string; nearest_zone?: string; distance_km?: number }
  nearby_zones?: { zone_name: string; risk_type: string; distance_km: number }[]
}
export interface HelplineData {
  country: string; emergency: string; disaster: string;
  disaster_name?: string; ambulance?: string; police?: string; fire?: string;
}
export interface UserConfig {
  kids_present: boolean; elderly_present: boolean; city: string; country: string;
}
export interface GoogleUser {
  name: string; email: string; picture: string; sub: string;
}

type Tab = 'safety' | 'zones' | 'chat' | 'settings' | 'credits'

// ── Map OpenWeatherMap condition → palette key ─────────────────────
export function getWeatherState(condition: string, tempC: number): WeatherState {
  const c = condition.toLowerCase()
  if (c.includes('thunderstorm'))                                        return 'storm'
  if (c.includes('snow') || c.includes('sleet') || c.includes('hail')) return 'snow'
  if (c.includes('rain') || c.includes('drizzle'))                      return 'rain'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze') ||
      c.includes('smoke') || c.includes('dust') || c.includes('sand'))  return 'mist'
  if (c.includes('cloud') || c.includes('overcast'))                    return 'clouds'
  if (c.includes('clear'))                                              return tempC >= 34 ? 'hot' : 'clear'
  return 'default'
}

// ── Weather emoji for badge ────────────────────────────────────────
export function getWeatherEmoji(state: WeatherState): string {
  const emojiMap: Record<WeatherState, string> = {
    rain:    '🌧️',
    storm:   '⛈️',
    clear:   '☀️',
    clouds:  '☁️',
    hot:     '🌡️',
    mist:    '🌫️',
    snow:    '❄️',
    default: '🌤️',
  }
  return emojiMap[state] ?? '🌤️'
}

// Seeded pseudo-random to avoid re-renders changing positions
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const WeatherAnimationLayer = ({ state }: { state: WeatherState }) => {
  return (
    <>
      {/* ── RAIN drops ── */}
      {(state === 'rain') && (
        <div className="weather-anim-layer">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${seededRand(i * 3) * 100}%`,
                animationDuration: `${0.35 + seededRand(i * 7) * 0.35}s`,
                animationDelay: `${seededRand(i * 11) * 1.5}s`,
                opacity: 0.5 + seededRand(i * 5) * 0.5,
                height: `${50 + seededRand(i * 13) * 50}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── STORM: heavy rain + lightning flash ── */}
      {state === 'storm' && (
        <div className="weather-anim-layer">
          {/* Heavy rain */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop storm-drop"
              style={{
                left: `${seededRand(i * 3) * 100}%`,
                animationDuration: `${0.25 + seededRand(i * 7) * 0.25}s`,
                animationDelay: `${seededRand(i * 11) * 1}s`,
                opacity: 0.6 + seededRand(i * 5) * 0.4,
                height: `${60 + seededRand(i * 13) * 60}px`,
                width: `${1.5 + seededRand(i * 17) * 1.5}px`,
              }}
            />
          ))}
          {/* Lightning bolts */}
          <div className="lightning-bolt lb-1" />
          <div className="lightning-bolt lb-2" />
          {/* Dark storm clouds */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`sc-${i}`} className="cloud dark-cloud storm-cloud" style={{
              top: `${seededRand(i * 4) * 50}%`,
              left: `-300px`,
              width: `${280 + seededRand(i * 6) * 180}px`,
              height: `${100 + seededRand(i * 8) * 80}px`,
              animationDuration: `${15 + seededRand(i * 9) * 15}s`,
              animationDelay: `-${seededRand(i * 12) * 15}s`,
            }} />
          ))}
        </div>
      )}

      {/* ── CLEAR / SUNNY ── */}
      {state === 'clear' && (
        <div className="weather-anim-layer">
          {/* Sun orb + rotating rays */}
          <div className="sun-container capsule-sun">
            <div className="sun-halo sun-halo-outer" />
            <div className="sun-halo sun-halo-mid" />
            <div className="sun-rays-ring" />
            <div className="sun-core-exact" />
          </div>
          {/* Lens flares */}
          <div className="lens-flare-exact lf-1" />
          <div className="lens-flare-exact lf-2" />
          <div className="lens-flare-exact lf-3" />
          {/* Floating light particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`sp-${i}`} className="sun-particle" style={{
              left: `${20 + seededRand(i * 7) * 70}%`,
              top: `${10 + seededRand(i * 11) * 80}%`,
              animationDelay: `${seededRand(i * 5) * 3}s`,
              animationDuration: `${2 + seededRand(i * 9) * 2}s`,
              width: `${3 + seededRand(i * 13) * 5}px`,
              height: `${3 + seededRand(i * 13) * 5}px`,
            }} />
          ))}
          {/* Wispy clouds at bottom */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`cc-${i}`} className="cloud clear-cloud" style={{
              top: `${55 + seededRand(i * 4) * 35}%`,
              left: `-300px`,
              width: `${180 + seededRand(i * 6) * 120}px`,
              height: `${50 + seededRand(i * 8) * 30}px`,
              animationDuration: `${45 + seededRand(i * 9) * 20}s`,
              animationDelay: `-${seededRand(i * 12) * 25}s`,
              opacity: 0.5,
            }} />
          ))}
        </div>
      )}

      {/* ── HOT / HEAT ── */}
      {state === 'hot' && (
        <div className="weather-anim-layer">
          {/* Blazing sun */}
          <div className="sun-container capsule-sun">
            <div className="sun-halo sun-halo-outer heat-halo" />
            <div className="sun-halo sun-halo-mid heat-halo" />
            <div className="sun-rays-ring heat-rays" />
            <div className="sun-core-exact heat" />
          </div>
          {/* Heat shimmer waves */}
          <div className="heat-shimmer hs-1" />
          <div className="heat-shimmer hs-2" />
          <div className="heat-shimmer hs-3" />
          {/* Heat haze particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`hp-${i}`} className="heat-particle" style={{
              left: `${10 + seededRand(i * 7) * 80}%`,
              animationDelay: `${seededRand(i * 5) * 2}s`,
              animationDuration: `${2.5 + seededRand(i * 9) * 2}s`,
            }} />
          ))}
          {/* Lens flares — orange tinted */}
          <div className="lens-flare-exact lf-1 heat-flare" />
          <div className="lens-flare-exact lf-2 heat-flare" />
        </div>
      )}

      {/* ── CLOUDS ── */}
      {state === 'clouds' && (
        <div className="weather-anim-layer">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`cl-${i}`} className={`cloud ${i % 2 === 0 ? 'light-cloud' : 'mid-cloud'}`} style={{
              top: `${seededRand(i * 4) * 80}%`,
              left: `-300px`,
              width: `${200 + seededRand(i * 6) * 200}px`,
              height: `${70 + seededRand(i * 8) * 70}px`,
              animationDuration: `${25 + seededRand(i * 9) * 20}s`,
              animationDelay: `-${seededRand(i * 12) * 20}s`,
              opacity: 0.5 + seededRand(i * 3) * 0.4,
            }} />
          ))}
        </div>
      )}

      {/* ── MIST / FOG ── */}
      {state === 'mist' && (
        <div className="weather-anim-layer">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`mist-${i}`} className="mist-layer" style={{
              top: `${seededRand(i * 4) * 90}%`,
              animationDuration: `${8 + seededRand(i * 6) * 8}s`,
              animationDelay: `${seededRand(i * 9) * 5}s`,
              opacity: 0.3 + seededRand(i * 3) * 0.3,
              height: `${40 + seededRand(i * 7) * 60}px`,
            }} />
          ))}
        </div>
      )}

      {/* ── SNOW ── */}
      {state === 'snow' && (
        <div className="weather-anim-layer">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${seededRand(i * 3) * 100}%`,
              animationDuration: `${2 + seededRand(i * 7) * 3}s`,
              animationDelay: `${seededRand(i * 11) * 3}s`,
              width: `${4 + seededRand(i * 13) * 6}px`,
              height: `${4 + seededRand(i * 13) * 6}px`,
              opacity: 0.6 + seededRand(i * 5) * 0.4,
            }} />
          ))}
        </div>
      )}
    </>
  );
};

export const WeatherBackground = ({ state }: { state: WeatherState }) => {
  const bgClassMap: Record<WeatherState, string> = {
    rain:    'rain-bg',
    storm:   'storm-bg',
    clear:   'sunny-bg',
    hot:     'heat-bg',
    clouds:  'clouds-bg',
    mist:    'mist-bg',
    snow:    'snow-bg',
    default: '',
  }
  const bgClass = bgClassMap[state] ?? ''

  return (
    <div className={`weather-bg-container ${bgClass}`}>
      <WeatherAnimationLayer state={state} />
    </div>
  );
};

function AppInner() {
  const [tab, setTab]           = useState<Tab>('safety')
  const [theme, setTheme]       = useState<Theme>(() => (localStorage.getItem('raksha_theme') as Theme) || 'light')
  const [user, setUser]         = useState<GoogleUser | null>(null)
  const [config, setConfig]     = useState<UserConfig | null>(null)
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [weatherState, setWeatherState] = useState<WeatherState>('default')

  const applyDynamicColor = (score: number, currentTheme: Theme) => {
    const isDark = currentTheme === 'dark'
    // Score 0 -> Blue (210), Score 10 -> Red (0)
    const h = Math.max(0, 210 - (score * 21))
    
    const pL = isDark ? 70 : 35
    const pcL = isDark ? 20 : 90
    const onPL = isDark ? 10 : 100
    const onPcL = isDark ? 90 : 10
    
    const root = document.documentElement
    root.style.setProperty('--md-primary', `hsl(${h}, 75%, ${pL}%)`)
    root.style.setProperty('--md-on-primary', `hsl(${h}, 100%, ${onPL}%)`)
    root.style.setProperty('--md-primary-container', `hsl(${h}, 80%, ${pcL}%)`)
    root.style.setProperty('--md-on-primary-container', `hsl(${h}, 100%, ${onPcL}%)`)
    
    // Subtle surface tinting with transparency to blend with frosted glass
    root.style.setProperty('--md-surface', `hsla(${h}, 40%, ${isDark ? 12 : 98}%, 0.8)`)
    root.style.setProperty('--md-surface-container-low', `hsla(${h}, 40%, ${isDark ? 12 : 97}%, 0.85)`)
    root.style.setProperty('--md-surface-container', `hsla(${h}, 40%, ${isDark ? 15 : 95}%, 0.9)`)
    root.style.setProperty('--md-surface-container-high', `hsla(${h}, 40%, ${isDark ? 18 : 93}%, 0.95)`)
  }

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('raksha_theme', theme)
    if (riskData) {
      applyDynamicColor(riskData.score, theme)
    }
  }, [theme, riskData])

  // Apply risk palette to DOM whenever risk data changes
  useEffect(() => {
    if (riskData) {
      document.documentElement.setAttribute('data-risk', riskData.risk_level.toLowerCase())
      applyDynamicColor(riskData.score, theme)
      
      if (riskData.weather) {
        const state = getWeatherState(riskData.weather.condition, riskData.weather.temp_c)
        setWeatherState(state)
        document.documentElement.setAttribute('data-weather', state)
      }
    }
  }, [riskData, theme])

  // Restore session
  useEffect(() => {
    const u = localStorage.getItem('raksha_user')
    const c = localStorage.getItem('raksha_config')
    if (u) setUser(JSON.parse(u))
    if (c) {
      const cfg = JSON.parse(c)
      setConfig(cfg)
      const cached = localStorage.getItem('raksha_last_data')
      if (cached) {
        const d = JSON.parse(cached)
        setRiskData(d)
        if (d.weather) {
          const state = getWeatherState(d.weather.condition, d.weather.temp_c)
          setWeatherState(state)
          document.documentElement.setAttribute('data-weather', state)
        }
        document.documentElement.setAttribute('data-risk', d.risk_level.toLowerCase())
        applyDynamicColor(d.score, theme)
        
        const t = localStorage.getItem('raksha_last_updated')
        if (t) setLastUpdated(new Date(t))
      }
      fetchRisk(cfg)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRiskData = async (lat: number, lon: number, cfg: UserConfig) => {
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, ...cfg })
      })
      if (!res.ok) throw new Error('API error')
      const data: RiskData = await res.json()
      setRiskData(data)
      setLastUpdated(new Date())
      setError(null)
      localStorage.setItem('raksha_last_data', JSON.stringify(data))
      localStorage.setItem('raksha_last_updated', new Date().toISOString())
    } catch {
      const cached = localStorage.getItem('raksha_last_data')
      if (cached) { setRiskData(JSON.parse(cached)); setError('offline') }
      else setError('Could not connect. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRisk = useCallback(async (cfg: UserConfig) => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      // Browser doesn't support geolocation — fall back to city-based coords
      getRiskData(20.5937, 78.9629, cfg)
      return
    }

    navigator.geolocation.getCurrentPosition(
      pos => getRiskData(pos.coords.latitude, pos.coords.longitude, cfg),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('location_denied')
          setLoading(false)
        } else {
          // Timeout or unavailable — fall back silently
          getRiskData(20.5937, 78.9629, cfg)
        }
      },
      { maximumAge: 0, timeout: 10000, enableHighAccuracy: false }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin    = (u: GoogleUser) => { setUser(u); localStorage.setItem('raksha_user', JSON.stringify(u)) }
  const handleOnboard  = (cfg: UserConfig) => { setConfig(cfg); localStorage.setItem('raksha_config', JSON.stringify(cfg)); fetchRisk(cfg) }
  const handleLogout   = () => {
    ['raksha_user','raksha_config','raksha_last_data','raksha_last_updated'].forEach(k => localStorage.removeItem(k))
    setUser(null); setConfig(null); setRiskData(null); setTab('safety')
    setWeatherState('default')
    document.documentElement.removeAttribute('data-weather')
    document.documentElement.removeAttribute('data-risk')
    const root = document.documentElement
    root.style.removeProperty('--md-primary')
    root.style.removeProperty('--md-on-primary')
    root.style.removeProperty('--md-primary-container')
    root.style.removeProperty('--md-on-primary-container')
    root.style.removeProperty('--md-surface')
    root.style.removeProperty('--md-surface-container-low')
    root.style.removeProperty('--md-surface-container')
    root.style.removeProperty('--md-surface-container-high')
  }
  const handleUpdate   = (cfg: UserConfig) => { setConfig(cfg); localStorage.setItem('raksha_config', JSON.stringify(cfg)); fetchRisk(cfg) }
  const toggleTheme    = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  if (!user)   return (
    <>
      <WeatherBackground state="default" />
      <LoginScreen onLogin={handleLogin} theme={theme} />
    </>
  )
  if (!config) return (
    <>
      <WeatherBackground state="default" />
      <OnboardingScreen user={user} onComplete={handleOnboard} />
    </>
  )

  const navItems: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: 'safety',   icon: Home,            label: 'Safety'   },
    { id: 'zones',    icon: MapPin,          label: 'Zones'    },
    { id: 'chat',     icon: MessageCircle,   label: 'Chat'     },
    { id: 'settings', icon: Settings,        label: 'Settings' },
    { id: 'credits',  icon: Star,            label: 'Credits'  },
  ]

  const weatherEmoji  = getWeatherEmoji(weatherState)
  const weatherLabel  = riskData?.weather?.condition
    ? `${weatherEmoji} ${riskData.weather.condition}`
    : null

  return (
    <>
      <WeatherBackground state={weatherState} />
      <div className="app-shell">
        {/* Top app bar */}
      <header className="glass-top-bar">
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Raksha</span>
        {weatherLabel && (
          <span className="glass-badge" style={{ marginRight: 8, fontSize: 11 }}>
            {weatherLabel}
          </span>
        )}
        {error === 'offline' && (
          <span className="glass-badge" style={{ marginRight: 8, fontSize: 11, color: '#fb923c', borderColor: 'rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.1)' }}>
            Offline
          </span>
        )}
        {user.picture
          ? <img src={user.picture} alt={user.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
          : <div className="glass-icon-badge" style={{ width: 34, height: 34, fontSize: 14, fontWeight: 700 }}>{user.name?.[0]}</div>
        }
      </header>

      {/* Tab content */}
      <main className="tab-content">
        {tab === 'safety'   && <SafetyTab config={config} riskData={riskData} loading={loading} error={error} lastUpdated={lastUpdated} onRefresh={() => fetchRisk(config)} />}
        {tab === 'zones'    && <ZonesTab riskData={riskData} config={config} />}
        {tab === 'chat'     && <ChatTab />}
        {tab === 'settings' && <SettingsTab user={user} config={config} theme={theme} onUpdate={handleUpdate} onLogout={handleLogout} onToggleTheme={toggleTheme} />}
        {tab === 'credits'  && <CreditsTab />}
      </main>

      {/* Bottom nav */}
      <nav className="glass-nav-bar">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`glass-nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <div className="glass-nav-indicator">
              <Icon size={20} strokeWidth={tab === id ? 2.5 : 1.8} />
            </div>
            <span className="glass-nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
    </>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AppInner />
    </GoogleOAuthProvider>
  )
}
