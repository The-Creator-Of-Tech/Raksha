import { MapPin, AlertTriangle, CheckCircle, Flame, Droplets, Wind } from 'lucide-react'
import React from 'react'
import type { RiskData, UserConfig } from '../App'

interface Props { riskData: RiskData | null; config: UserConfig }

function riskMeta(type: string): { color: string; icon: React.ReactElement; bg: string } {
  const t = type.toLowerCase()
  if (t.includes('flood') || t.includes('cyclone'))
    return { color: '#60a5fa', icon: <Droplets size={18} color="#60a5fa" />, bg: 'rgba(96,165,250,0.12)' }
  if (t.includes('heat') || t.includes('drought') || t.includes('fire'))
    return { color: '#fb923c', icon: <Flame size={18} color="#fb923c" />, bg: 'rgba(251,146,60,0.12)' }
  if (t.includes('wind') || t.includes('storm'))
    return { color: '#a78bfa', icon: <Wind size={18} color="#a78bfa" />, bg: 'rgba(167,139,250,0.12)' }
  return { color: '#4ade80', icon: <AlertTriangle size={18} color="#4ade80" />, bg: 'rgba(74,222,128,0.12)' }
}

export function ZonesTab({ riskData, config }: Props) {
  const zones = riskData?.nearby_zones ?? []

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ paddingTop: 4, marginBottom: 4 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Risk Zones
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Historical disaster zones near {config.city}
        </p>
      </div>

      {/* Location summary card */}
      {riskData && (
        <div className="glass-card anim-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="glass-icon-badge" style={{ width: 44, height: 44, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <MapPin size={20} color="#60a5fa" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: '#fff' }}>Your Location</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{config.city}, {config.country}</p>
            </div>
            <div className="glass-badge" style={{
              color: riskData.risk_level === 'SAFE' ? '#4ade80' : riskData.risk_level === 'CAUTION' ? '#fb923c' : '#f87171',
              borderColor: riskData.risk_level === 'SAFE' ? 'rgba(74,222,128,0.3)' : riskData.risk_level === 'CAUTION' ? 'rgba(251,146,60,0.3)' : 'rgba(248,113,113,0.3)',
              background: riskData.risk_level === 'SAFE' ? 'rgba(74,222,128,0.1)' : riskData.risk_level === 'CAUTION' ? 'rgba(251,146,60,0.1)' : 'rgba(248,113,113,0.1)',
            }}>
              {riskData.risk_level}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { val: riskData.score.toFixed(1), label: 'Risk Score', color: '#fb923c' },
              { val: `${riskData.elevation_m}m`, label: 'Elevation', color: '#60a5fa' },
              { val: `${riskData.weather.rainfall_mm}mm`, label: 'Rainfall', color: '#a78bfa' },
            ].map(({ val, label, color }) => (
              <div key={label} className="glass-stat-tile" style={{ textAlign: 'center', padding: '12px 8px' }}>
                <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700, color: '#fff', textShadow: `0 0 12px ${color}60` }}>{val}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section label */}
      <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 0' }}>
        Nearby Zones
      </p>

      {/* Zones list */}
      {zones.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {zones.map((zone, i) => {
            const meta = riskMeta(zone.risk_type)
            return (
              <div key={i} className="glass-card anim-fade-up" style={{ animationDelay: `${i * 60}ms`, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="glass-icon-badge" style={{ width: 40, height: 40, background: meta.bg, border: `1px solid ${meta.color}30` }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{zone.zone_name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                      {zone.distance_km.toFixed(1)} km away
                    </p>
                  </div>
                  <div className="glass-badge" style={{ color: meta.color, borderColor: `${meta.color}40`, background: meta.bg }}>
                    {zone.risk_type}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 36, textAlign: 'center' }}>
          <div className="glass-icon-badge" style={{ width: 56, height: 56, margin: '0 auto 16px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
            <CheckCircle size={26} color="#4ade80" />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#fff' }}>No nearby high-risk zones</p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            No historical disaster zones were found in your area.
          </p>
        </div>
      )}

      {!riskData && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div className="glass-icon-badge" style={{ width: 56, height: 56, margin: '0 auto 16px' }}>
            <MapPin size={24} color="rgba(255,255,255,0.4)" />
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Go to Safety tab to load zone data.</p>
        </div>
      )}
    </div>
  )
}
