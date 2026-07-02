import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { SubjectStatistic } from '../types'

interface SubjectStatisticCardProps {
  statistic: SubjectStatistic
}

// Map colors to bands
const BAND_COLORS: Record<string, string> = {
  '>=8': '#10b981',    // Emerald green
  '[6,8)': '#3b82f6',   // Blue
  '[4,6)': '#f59e0b',   // Amber
  '<4': '#ef4444',      // Red
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
    <div className="glass-card p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {statistic.displayName}
            </h3>
            <p className="text-xs text-slate-500">
              Tổng số thí sinh: <span className="font-semibold text-slate-300">{total.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ color: '#fff', fontSize: '13px' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAND_COLORS[entry.band] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
