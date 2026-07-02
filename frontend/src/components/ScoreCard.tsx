import type { ScoreEntry } from '../types'

// Map score band to CSS class + label
function bandLabel(band: string): string {
  switch (band) {
    case '>=8':   return 'Giỏi'
    case '[6,8)': return 'Khá'
    case '[4,6)': return 'Trung Bình'
    case '<4':    return 'Yếu'
    default:      return 'Không thi'
  }
}

function bandClass(band: string): string {
  switch (band) {
    case '>=8':   return 'band-excellent'
    case '[6,8)': return 'band-good'
    case '[4,6)': return 'band-average'
    case '<4':    return 'band-poor'
    default:      return 'band-na'
  }
}

// Score Card
function ScoreCard({ score }: { score: ScoreEntry }) {
  const notTaken = score.score === null

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-4 transition-all duration-200 border
        ${notTaken
          ? 'bg-slate-50 border-slate-100'
          : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className={`text-sm font-semibold ${notTaken ? 'text-slate-400' : 'text-slate-500'}`}>
              {score.displayName}
            </p>
            <p className={`text-xl font-extrabold ${notTaken ? 'text-slate-300' : 'text-slate-800'}`}>
              {notTaken ? '—' : score.score!.toFixed(2)}
            </p>
          </div>
        </div>
        {!notTaken && (
          <span className={`score-badge ${bandClass(score.band)}`}>
            {bandLabel(score.band)}
          </span>
        )}
      </div>
    </div>
  )
}

export default ScoreCard;