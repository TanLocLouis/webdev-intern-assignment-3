import type { TopGroupAStudent } from '../types'

function rankMedal(index: number): string {
  return `${index + 1}`
}

function SubjectPill({ label, score }: { label: string; score: number | null | undefined }) {
  return (
    <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
      <span className="text-[10px] text-slate-500 block leading-none">{label}</span>
      <span className="text-sm font-semibold text-white">{score != null ? score.toFixed(2) : '—'}</span>
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
        transition-all duration-200 hover:bg-white/[0.07] hover:border-white/20
        animate-[fadeIn_0.3s_ease_both]
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Rank */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0}`}>
        {rankMedal(index)}
      </div>

      {/* Student Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* SBD */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">SBD</p>
            <p className="text-lg sm:text-xl font-bold text-white tracking-wide">{student.sbd}</p>
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
