import { useGameStore } from '../../stores/gameStore'
import { LEVELS } from '../../types/game.types'
import './UI.css'

export function LevelComplete() {
  const nextLevel = useGameStore((s) => s.nextLevel)
  const resetToMenu = useGameStore((s) => s.resetToMenu)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const elapsedTime = useGameStore((s) => s.elapsedTime)

  const completedLevel = LEVELS[currentLevel - 1]
  const nextLevelData = LEVELS[currentLevel]

  const mins = Math.floor(elapsedTime / 60)
  const secs = Math.floor(elapsedTime % 60)
    .toString()
    .padStart(2, '0')

  const handleNext = () => {
    nextLevel()
    setTimeout(() => {
      window.dispatchEvent(new Event('game:lock'))
    }, 150)
  }

  return (
    <div className="ui-overlay ui-level-complete">
      <div className="menu-card">
        <div className="complete-star">⭐</div>
        <h2 className="complete-title">Level Complete!</h2>
        <p className="complete-level-name">{completedLevel?.name}</p>
        <div className="complete-stats">
          <div className="stat-block">
            <span className="stat-label">Time</span>
            <span className="stat-value">
              {mins}:{secs}
            </span>
          </div>
        </div>
        {nextLevelData && (
          <p className="next-level-hint">
            Next: <strong>{nextLevelData.name}</strong>
            <br />
            <em>{nextLevelData.subtitle}</em>
          </p>
        )}
        <button className="btn btn--primary btn--large" onClick={handleNext}>
          Continue →
        </button>
        <button className="btn btn--ghost" onClick={resetToMenu}>
          Main Menu
        </button>
      </div>
    </div>
  )
}
