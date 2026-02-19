import { useGameStore } from '../../stores/gameStore'
import './UI.css'

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div className="ui-overlay ui-main-menu">
      <div className="menu-card">
        <div className="menu-title-block">
          <h1 className="menu-title">PARKOUR</h1>
          <h2 className="menu-subtitle">From Rags to Ramparts</h2>
        </div>

        <div className="menu-level-previews">
          <div className="level-chip">🏚️ Poor Town</div>
          <div className="level-chip level-chip--arrow">→</div>
          <div className="level-chip">⛰️ Mountains</div>
          <div className="level-chip level-chip--arrow">→</div>
          <div className="level-chip">🏰 Castle</div>
        </div>

        <button className="btn btn--primary btn--large" onClick={startGame}>
          PLAY
        </button>

        <div className="controls-hint">
          <p className="controls-title">Controls</p>
          <div className="controls-grid">
            <span className="key">W A S D</span><span>Move</span>
            <span className="key">SPACE</span><span>Jump</span>
            <span className="key">SHIFT</span><span>Sprint</span>
            <span className="key">ESC</span><span>Pause</span>
            <span className="key">CLICK</span><span>Lock mouse</span>
          </div>
        </div>
      </div>
    </div>
  )
}
