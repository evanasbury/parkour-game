import { useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { LEVELS } from '../../types/game.types'
import './UI.css'

export function HUD() {
  const elapsedTime = useGameStore((s) => s.elapsedTime)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const checkpointsReached = useGameStore((s) => s.checkpointsReached)
  const tick = useGameStore((s) => s.tick)

  const level = LEVELS[currentLevel - 1]

  // Tick timer every frame
  useEffect(() => {
    let id: number
    const loop = () => {
      tick(Date.now())
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [tick])

  const mins = Math.floor(elapsedTime / 60)
  const secs = Math.floor(elapsedTime % 60)
    .toString()
    .padStart(2, '0')

  const levelColors = ['#FF8F00', '#1976D2', '#7B1FA2']
  const levelColor = levelColors[(currentLevel - 1) % 3]

  return (
    <>
      {/* Crosshair */}
      <div className="crosshair">
        <div className="crosshair-h" />
        <div className="crosshair-v" />
      </div>

      {/* Top-left: Level info */}
      <div className="hud-topleft">
        <div className="hud-badge" style={{ borderColor: levelColor }}>
          <span className="hud-level-num" style={{ color: levelColor }}>
            {currentLevel}
          </span>
          <span className="hud-level-name">{level?.name ?? ''}</span>
        </div>
      </div>

      {/* Top-right: Timer */}
      <div className="hud-topright">
        <div className="hud-timer">
          ⏱ {mins}:{secs}
        </div>
      </div>

      {/* Bottom-left: Checkpoint count */}
      <div className="hud-bottomleft">
        {checkpointsReached.length > 0 && (
          <div className="hud-checkpoint-badge">
            ✓ Checkpoint saved
          </div>
        )}
      </div>

      {/* Click-to-lock prompt */}
      <div className="hud-click-hint">Click to lock mouse</div>
    </>
  )
}
