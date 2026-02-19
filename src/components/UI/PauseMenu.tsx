import { useGameStore } from '../../stores/gameStore'
import './UI.css'

export function PauseMenu() {
  const resumeGame = useGameStore((s) => s.resumeGame)
  const resetToMenu = useGameStore((s) => s.resetToMenu)

  const handleResume = () => {
    resumeGame()
    // Request pointer lock after a short delay (browser requires user gesture)
    setTimeout(() => {
      window.dispatchEvent(new Event('game:lock'))
    }, 100)
  }

  return (
    <div className="ui-overlay ui-pause">
      <div className="menu-card menu-card--narrow">
        <h2 className="pause-title">PAUSED</h2>
        <button className="btn btn--primary" onClick={handleResume}>
          ▶ Resume
        </button>
        <button className="btn btn--secondary" onClick={resetToMenu}>
          ⌂ Main Menu
        </button>
      </div>
    </div>
  )
}
