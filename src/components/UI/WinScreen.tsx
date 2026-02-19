import { useGameStore } from '../../stores/gameStore'
import './UI.css'

export function WinScreen() {
  const resetToMenu = useGameStore((s) => s.resetToMenu)
  const elapsedTime = useGameStore((s) => s.elapsedTime)

  const mins = Math.floor(elapsedTime / 60)
  const secs = Math.floor(elapsedTime % 60)
    .toString()
    .padStart(2, '0')

  return (
    <div className="ui-overlay ui-win">
      <div className="menu-card">
        <div className="win-crowns">👑 🏰 👑</div>
        <h1 className="win-title">YOU WIN!</h1>
        <p className="win-subtitle">
          From pauper to castle conqueror — the mythic keep is yours!
        </p>
        <div className="complete-stats">
          <div className="stat-block">
            <span className="stat-label">Final Time</span>
            <span className="stat-value">
              {mins}:{secs}
            </span>
          </div>
        </div>
        <div className="win-stars">⭐⭐⭐</div>
        <button
          className="btn btn--primary btn--large"
          onClick={resetToMenu}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
