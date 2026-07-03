import { useState, useEffect } from 'react'
import { getStatisticsForSubjects } from '../api/client'
import type { SubjectStatistic } from '../types'
import SubjectStatisticCard from '../components/SubjectStatisticCard'

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<SubjectStatistic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatisticsForSubjects()
        setStatistics(data)
      } catch {
        setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate summary metrics
  const totalSubjects = statistics.length
  const totalTests = statistics.reduce(
    (sum, s) => sum + s.bands.reduce((innerSum, b) => innerSum + b.count, 0),
    0
  )

  return (
    <div className="min-h-screen hero-bg px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto animate-[fadeIn_0.3s_ease]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
              Statistics
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Statistics of the number of students with scores in the above 4 levels by subjects
            </p>
          </div>

          {/* Quick Metrics */}
          {!loading && !error && statistics.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="glass-card px-4 py-3 min-w-[120px]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none mb-1 font-semibold">subjects</p>
                <p className="text-xl font-bold text-slate-800 leading-tight">{totalSubjects}</p>
              </div>
              <div className="glass-card px-4 py-3 min-w-[150px]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none mb-1 font-semibold">Total tests</p>
                <p className="text-xl font-bold text-sky-600 leading-tight">{totalTests.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-5/80 border border-red-200 text-red-700 text-sm mb-8 font-medium">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-[340px] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl shimmer" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 rounded shimmer" />
                    <div className="h-3 w-32 rounded shimmer" />
                  </div>
                </div>
                <div className="h-32 w-full rounded-xl shimmer my-4" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 rounded shimmer" />
                  <div className="h-10 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Grid */}
        {!loading && !error && statistics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics.map((stat) => (
              <SubjectStatisticCard key={stat.subject} statistic={stat} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && statistics.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-slate-400 text-lg font-medium">Chưa có dữ liệu thống kê</p>
            <p className="text-slate-600 text-sm mt-1">
              Hãy hoàn tất việc seed dữ liệu để cập nhật bảng phân tích phổ điểm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
