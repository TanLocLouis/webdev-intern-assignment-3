import { useState, useCallback, useRef } from 'react'
import { getStudentScores } from '../api/client'
import type { StudentResult, ScoreEntry } from '../types'

import ScoreCard from '../components/ScoreCard'

export default function HomePage() {
  const [sbd, setSbd] = useState('')
  const [result, setResult] = useState<StudentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async () => {
    const trimmed = sbd.trim()

    // Validate: must be exactly 8 digits
    if (!/^\d+$/.test(trimmed)) {
      setError('Student ID must consist of exactly 8 digits.')
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    // Fetch student scores from the API
    try {
      const data = await getStudentScores(trimmed)
      setResult(data)

      // Scroll to result on mobile
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = err as { response?: { status?: number; data?: { message?: string } } }
        if (resp.response?.status === 404) {
          setError('Not found. Please check the student ID and try again.')
        } else {
          setError(resp.response?.data?.message ?? 'An error occurred while querying. Please try again.')
        }
      } else {
        setError('Unable to connect to the server. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }, [sbd])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen hero-bg">
      {/* Search Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
        {/* Decorative blurs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo / Title */}
        <div className="relative z-10 text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">G-Scores</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium">
            Search student scores in the 2024 Vietnamese National High School Exam.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 w-full max-w-xl">
          <div className="glass-card p-2 glow-blue flex items-center gap-2">
            {/* Search icon */}
            <div className="pl-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
            </div>
            <input
              id="sbd-input"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={sbd}
              onChange={(e) => {
                setSbd(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter student ID (e.g., 01000093)"
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 py-3 px-2 text-base sm:text-lg font-medium"
            />
            <button
              id="search-btn"
              onClick={handleSearch}
              disabled={loading || !sbd.trim()}
              className="btn-primary flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm animate-[fadeIn_0.2s_ease] font-medium">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Result */}
      {result && (
        <section ref={resultRef} className="px-4 pb-20 animate-[fadeIn_0.3s_ease]">
          <div className="max-w-3xl mx-auto">
            {/* Student header card */}
            <div className="glass-card p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-xs uppercase mb-1 font-semibold tracking-wider">Số báo danh</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-wide">{result.sbd}</h2>
                </div>
                <div className="flex items-center gap-4">
                  {result.ma_ngoai_ngu && (
                    <div className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200/80">
                      <span className="text-sky-700 text-sm font-bold">🌐 {result.ma_ngoai_ngu}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Score grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.scores.map((score: ScoreEntry) => (
                  <ScoreCard key={score.subject} score={score} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 sm:p-8">
              <div className="h-8 w-48 rounded-lg shimmer mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl shimmer" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
