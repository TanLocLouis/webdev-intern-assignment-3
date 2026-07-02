import { useState, useEffect } from 'react'
import { getTopGroupA } from '../api/client'
import type { TopGroupAStudent } from '../types'
import StudentRankCard from '../components/StudentRankCard'

export default function TopGroupAPage() {
  const [students, setStudents] = useState<TopGroupAStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopGroupA()
        setStudents(data)
      } catch {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen hero-bg px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Top 10 in Group A
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Mathematics · Physics · Chemistry — Highest Scores
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl shimmer" />
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {!loading && !error && students.length > 0 && (
          <div className="space-y-3">
            {students.map((student, index) => (
              <StudentRankCard key={student.sbd} student={student} index={index} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && students.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500 text-lg">Chưa có dữ liệu xếp hạng.</p>
          </div>
        )}
      </div>
    </div>
  )
}
