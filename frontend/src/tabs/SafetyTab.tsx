import { useState, useCallback } from 'react'
import { RefreshCw, ChevronDown, CheckCircle, AlertTriangle, Phone, Share2, Droplets, Wind, Thermometer, Gauge, Clock, MapPin, ShieldAlert } from 'lucide-react'
import type { RiskData, RiskLevel, HelplineData, UserConfig } from '../App'
import { getWeatherState, WeatherAnimationLayer } from '../App'
import axios from 'axios'

function ScoreRing({ score, level }: { score: number; level: RiskLevel }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const maxArc = circ * 0.75
  const gap = circ * 0.25
  const fill = (score / 10) * maxArc
  const color = level === 'SAFE' ? '#4ade80' : level === 'CAUTION' ? '#fb923c' : '#f87171'

  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Frosted glass ring bg */}
      <div style={{
        position: 'absolute', width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
      }} />
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ position: 'absolute', transform: 'rotate(135deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          stroke="rgba(255,255,255,0.15)" strokeDasharray={`${maxArc} ${gap}`} />
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          stroke={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          strokeDasharray={`${fill} ${circ}`} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -8 }}>
        <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{score.toFixed(1)}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>/10</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 2,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
        padding: '2px 8px', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.25)'
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: color, letterSpacing: '0.06em', textShadow: `0 0 8px ${color}` }}>{level}</span>
      </div>
    </div>
  )
}

function HelplineSheet({ data, onClose }: { data: HelplineData; onClose: () => void }) {
  const lines = [
    { label: 'Emergency', num: data.emergency, emoji: '🚨' },
    { label: data.disaster_name || 'Disaster', num: data.disaster, emoji: '🌊' },
    ...(data.ambulance ? [{ label: 'Ambulance', num: data.ambulance, emoji: '🚑' }] : []),
    ...(data.police   ? [{ label: 'Police',    num: data.police,    emoji: '🚔' }] : []),
    ...(data.fire     ? [{ label: 'Fire',      num: data.fire,      emoji: '🚒' }] : []),
  ]
  return (
    <div className="glass-scrim" onClick={onClose}>
      <div className="glass-sheet" onClick={e => e.stopPropagation()}>
        <div className="glass-drag-handle" />
        <p className="md-title-large" style={{ margin: '0 0 4px' }}>Emergency Helplines</p>
        <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)', margin: '0 0 20px' }}>{data.country}</p>
        {lines.map((l, i) => (
          <div key={l.label}>
            {i > 0 && <div className="glass-divider" />}
            <a href={`tel:${l.num}`} className="glass-list-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{l.emoji}</span>
              <div style={{ flex: 1 }}>
                <p className="md-body-large" style={{ margin: 0 }}>{l.label}</p>
                <p className="md-body-medium" style={{ margin: 0, color: 'var(--md-on-surface-variant)' }}>{l.num}</p>
              </div>
              <Phone size={16} color="rgba(255,255,255,0.4)" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  config: UserConfig; riskData: RiskData | null; loading: boolean
  error: string | null; lastUpdated: Date | null; onRefresh: () => void
}

export function SafetyTab({ config, riskData, loading, error, lastUpdated, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [helplineData, setHelplineData] = useState<HelplineData | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  const handleRefresh = async () => {
    if (refreshing) return
    setRefreshing(true); onRefresh(); setTimeout(() => setRefreshing(false), 2000)
  }

  const handleSafe = useCallback(async () => {
    if (confirmed) return
    setConfirmed(true)
    navigator.geolocation.getCurrentPosition(
      pos => axios.post('/api/safe-confirm', { lat: pos.coords.latitude, lon: pos.coords.longitude, city: config.city }),
      ()  => axios.post('/api/safe-confirm', { lat: 0, lon: 0, city: config.city })
    )
  }, [confirmed, config.city])

  const handleHelpline = async () => {
    if (!helplineData) {
      try {
        const r = await fetch(`/api/helplines?country=${encodeURIComponent(config.country)}`)
        setHelplineData(await r.json())
      } catch { /* show default */ }
    }
    setShowSheet(true)
  }

  const handleShare = async () => {
    if (!riskData) return
    const text = `🛡️ Raksha: ${riskData.decision}`
    if (navigator.share) { try { await navigator.share({ title: 'Raksha', text }) } catch { /**/ } }
    else { try { await navigator.clipboard.writeText(text) } catch { /**/ } }
  }

  const level = riskData?.risk_level
  const riskClass = level === 'DANGER' ? 'capsule-danger' : level === 'CAUTION' ? 'capsule-caution' : 'capsule-safe'
  const riskTitle = level === 'DANGER' ? 'High Risk' : level === 'CAUTION' ? 'Moderate Risk' : 'All Clear'
  const riskSub   = level === 'DANGER' ? 'Stay indoors. Avoid flooded areas.' : level === 'CAUTION' ? 'Be prepared. Monitor conditions.' : 'Conditions are safe today.'
  const chipColor = level === 'DANGER' ? '#f87171' : level === 'CAUTION' ? '#fb923c' : '#4ade80'
  const chipLabel = level === 'DANGER' ? 'DANGER' : level === 'CAUTION' ? 'CAUTION' : 'SAFE'
  const weatherState = riskData?.weather ? getWeatherState(riskData.weather.condition, riskData.weather.temp_c) : 'default'

  if (loading && !riskData) return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[180, 90, 56].map(h => (
        <div key={h} className="glass-skeleton" style={{ height: h }} />
      ))}
    </div>
  )

  if (error && error !== 'offline' && !riskData) return (
    <div style={{ padding: 24, textAlign: 'center', paddingTop: 80 }}>
      <div className="glass-icon-badge" style={{ margin: '0 auto 20px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)' }}>
        <AlertTriangle size={28} color="#f87171" />
      </div>
      {error === 'location_denied' ? (
        <>
          <p className="md-title-medium" style={{ marginBottom: 8, color: '#fff' }}>Location access denied</p>
          <p className="md-body-medium" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            Raksha needs your location to show accurate weather and risk data.
          </p>
          <p className="md-body-medium" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24, fontSize: 12 }}>
            To fix this: open your browser's site settings and allow location for this page, then tap Retry.
          </p>
        </>
      ) : (
        <>
          <p className="md-title-medium" style={{ marginBottom: 8, color: '#fff' }}>Something went wrong</p>
          <p className="md-body-medium" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{error}</p>
        </>
      )}
      <button className="glass-btn glass-btn-primary" onClick={onRefresh}>Retry</button>
    </div>
  )

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Location bar */}
      <div className="glass-pill-bar">
        <MapPin size={14} color="rgba(255,255,255,0.7)" />
        <span className="md-body-medium" style={{ color: 'rgba(255,255,255,0.8)', flex: 1, fontSize: 13 }}>
          {config.city}, {config.country}
        </span>
        {lastUpdated && (
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <button className="glass-icon-btn" onClick={handleRefresh} aria-label="Refresh">
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none', color: 'rgba(255,255,255,0.7)' }} />
        </button>
      </div>

      {riskData && (
        <>
          {/* ── Hero Risk Capsule ── */}
          <div className={`front-capsule ${riskClass}`}>
            <div className="capsule-anim-container">
              <WeatherAnimationLayer state={weatherState} />
            </div>

            {/* Glass shine overlay */}
            <div className="capsule-shine" />

            {/* RISK STATUS label */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <ShieldAlert size={13} style={{ color: chipColor, filter: `drop-shadow(0 0 4px ${chipColor})` }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: chipColor, letterSpacing: '0.12em', textShadow: `0 0 8px ${chipColor}` }}>
                RISK STATUS
              </span>
            </div>

            {/* Main row */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.3)', lineHeight: 1.1 }}>
                  {riskTitle}
                </h2>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{riskSub}</p>

                {/* Status chip */}
                <div className="glass-status-chip" style={{ borderColor: `${chipColor}40` }}>
                  <AlertTriangle size={12} color={chipColor} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: chipColor }}>{chipLabel}</span>
                  <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                    {level === 'SAFE' ? 'Stay informed' : level === 'CAUTION' ? 'Monitor conditions' : 'Take shelter'}
                  </span>
                </div>
              </div>
              <ScoreRing score={riskData.score} level={riskData.risk_level} />
            </div>
          </div>

          {/* ── AI Recommendation ── */}
          <div className="glass-card anim-fade-up d-100">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="glass-icon-badge" style={{ width: 32, height: 32 }}>
                <ShieldAlert size={16} color="rgba(255,255,255,0.8)" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Today's Recommendation
              </span>
            </div>
            <p className="md-body-large" style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>{riskData.decision}</p>
          </div>

          {/* ── Why? Expandable ── */}
          <div className="glass-card anim-fade-up d-150" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.9)'
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>Why this recommendation?</span>
              <ChevronDown size={18} color="rgba(255,255,255,0.5)"
                style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>

            {expanded && (
              <div style={{ padding: '0 16px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  {[
                    { icon: <Droplets size={15} color="#60a5fa" />, label: 'Rainfall', val: `${riskData.weather.rainfall_mm} mm`, glow: '#60a5fa' },
                    { icon: <Wind size={15} color="#a78bfa" />,     label: 'Wind',     val: `${riskData.weather.wind_speed_kmh.toFixed(1)} km/h`, glow: '#a78bfa' },
                    { icon: <Thermometer size={15} color="#f87171" />, label: 'Temp',  val: `${riskData.weather.temp_c}°C`, glow: '#f87171' },
                    { icon: <Gauge size={15} color="#34d399" />,    label: 'Humidity', val: `${riskData.weather.humidity_pct}%`, glow: '#34d399' },
                  ].map(({ icon, label, val, glow }) => (
                    <div key={label} className="glass-stat-tile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>{icon}</div>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', textShadow: `0 0 12px ${glow}40` }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="glass-stat-tile" style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Elevation</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{riskData.elevation_m} m above sea level</span>
                </div>

                {riskData.historical_risk && riskData.historical_details?.zone_name && (
                  <div className="glass-stat-tile" style={{ borderColor: 'rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.08)' }}>
                    <span style={{ fontSize: 11, color: '#fb923c', fontWeight: 600, display: 'block', marginBottom: 4 }}>⚠ Historical Risk Zone</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{riskData.historical_details.zone_name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="anim-fade-up d-200" style={{ display: 'flex', gap: 10 }}>
            <button
              className={`glass-btn ${confirmed ? 'glass-btn-success' : 'glass-btn-primary'}`}
              style={{ flex: 1, minHeight: 52 }}
              onClick={handleSafe}
            >
              <CheckCircle size={17} /> {confirmed ? 'Confirmed ✓' : "I'm Safe"}
            </button>
            <button className="glass-btn glass-btn-secondary" style={{ flex: 1, minHeight: 52 }} onClick={handleHelpline}>
              <Phone size={17} /> Helplines
            </button>
          </div>

          <button onClick={handleShare} className="glass-text-btn">
            <Share2 size={15} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Share safety status</span>
          </button>
        </>
      )}

      {!riskData && !loading && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div className="glass-icon-badge" style={{ width: 72, height: 72, margin: '0 auto 20px', fontSize: 32 }}>🛡️</div>
          <p className="md-body-large" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>Tap to get your safety status.</p>
          <button className="glass-btn glass-btn-primary glass-btn-lg" onClick={onRefresh}>Get Safety Status</button>
        </div>
      )}

      {showSheet && (
        <HelplineSheet
          data={helplineData ?? { country: 'International', emergency: '112', disaster: '112', disaster_name: 'Emergency Services' }}
          onClose={() => setShowSheet(false)}
        />
      )}
    </div>
  )
}
