import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { SubjectStatistic } from '../types'

interface SubjectStatisticCardProps {
  statistic: SubjectStatistic
}

// Map colors to bands (emerald, blue, amber, red)
const BAND_COLORS: Record<string, string> = {
  '>=8': '#10b981',    // Emerald
  '[6,8)': '#3b82f6',   // Blue
  '[4,6)': '#f59e0b',   // Amber
  '<4': '#ef4444',      // Red
}

// Translate bands to labels
function getBandLabel(band: string): string {
  switch (band) {
    case '>=8': return 'Giỏi (≥8)'
    case '[6,8)': return 'Khá [6,8)'
    case '[4,6)': return 'T.Bình [4,6)'
    case '<4': return 'Yếu (<4)'
    default: return band
  }
}

export default function SubjectStatisticCard({ statistic }: SubjectStatisticCardProps) {
  const total = statistic.bands.reduce((sum, b) => sum + b.count, 0)

  // Recharts requires a flat object array
  const chartData = statistic.bands.map((b) => ({
    band: b.band,
    name: b.band === '>=8' ? 'Giỏi' : b.band === '[6,8)' ? 'Khá' : b.band === '[4,6)' ? 'T.Bình' : 'Yếu',
    value: b.count,
  }))

  return (
    <div className="glass-card p-5 flex flex-col justify-between hover:border-slate-200 transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {statistic.displayName}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Tổng số thí sinh: <span className="font-bold text-slate-700">{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
              }}
              labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ color: '#0f172a', fontSize: '13px' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAND_COLORS[entry.band] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {statistic.bands.map((b) => {
          const percentage = total > 0 ? ((b.count / total) * 100).toFixed(1) : '0.0'
          return (
            <div
              key={b.band}
              className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: BAND_COLORS[b.band] }}
                />
                <span className="text-slate-500 font-medium truncate">{getBandLabel(b.band)}</span>
              </div>
              <div className="text-right shrink-0 ml-1">
                <p className="font-bold text-slate-800">{b.count.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 font-semibold">{percentage}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
