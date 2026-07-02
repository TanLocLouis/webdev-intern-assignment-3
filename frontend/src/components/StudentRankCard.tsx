import type { TopGroupAStudent } from '../types'

function rankMedal(index: number): string {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `${index + 1}`
}

function rankBgClass(index: number): string {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return 'bg-slate-100 text-slate-500 border border-slate-200/40'
}

function SubjectPill({ label, score }: { label: string; score: number | null | undefined }) {
  return (
    <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
      <span className="text-[10px] text-slate-500 block leading-none font-semibold mb-0.5">{label}</span>
      <span className="text-sm font-bold text-slate-700">{score != null ? score.toFixed(2) : '—'}</span>
    </div>
  )
}

interface StudentRankCardProps {
  student: TopGroupAStudent
  index: number
}

export default function StudentRankCard({ student, index }: StudentRankCardProps) {
  const toan = student.scores.find(s => s.subject === 'toan')?.score
  const vatLi = student.scores.find(s => s.subject === 'vat_li')?.score
  const hoaHoc = student.scores.find(s => s.subject === 'hoa_hoc')?.score

  return (
    <div
      className={`
        glass-card p-4 sm:p-5 flex items-center gap-4 sm:gap-6
        transition-all duration-200 hover:bg-slate-50/50 hover:border-slate-200
        animate-[fadeIn_0.3s_ease_both]
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Rank */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${rankBgClass(index)}`}>
        {rankMedal(index)}
      </div>

      {/* Student Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* SBD */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">SBD</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-wide">{student.sbd}</p>
          </div>

          {/* Subject scores */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <SubjectPill label="Toán" score={toan} />
            <SubjectPill label="Lí" score={vatLi} />
            <SubjectPill label="Hóa" score={hoaHoc} />
          </div>
        </div>
      </div>

      {/* Total score */}
      <div className="text-right shrink-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Tổng</p>
        <p className="text-xl sm:text-2xl font-extrabold gradient-text">
          {student.total_score.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
