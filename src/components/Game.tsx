import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useGameStore } from '../stores/gameStore'
import { LEVELS } from '../types/game.types'
import { PlayerController } from '../systems/PlayerController'
import { Level1Town } from './levels/Level1Town'
import { Level2Mountains } from './levels/Level2Mountains'
import { Level3Castle } from './levels/Level3Castle'
import { HUD } from './UI/HUD'
import { PauseMenu } from './UI/PauseMenu'
import { LevelComplete } from './UI/LevelComplete'
import { WinScreen } from './UI/WinScreen'
import { PlayerHand } from './UI/PlayerHand'
import { lastAttackTime } from '../systems/playerShared'

/** Inner 3-D scene — runs inside <Canvas> */
function GameScene() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const phase = useGameStore((s) => s.phase)
  const spawn = LEVELS[currentLevel - 1]?.spawnPoint ?? [0, 3, -22]

  return (
    // key on Physics forces a full remount (incl. player body) on level change
    <Physics
      key={currentLevel}
      gravity={[0, -20, 0]}
      paused={phase !== 'playing'}
    >
      <PlayerController spawnPoint={spawn as [number, number, number]} />
      {currentLevel === 1 && <Level1Town />}
      {currentLevel === 2 && <Level2Mountains />}
      {currentLevel === 3 && <Level3Castle />}
    </Physics>
  )
}

export function Game() {
  const phase = useGameStore((s) => s.phase)

  const handleClick = () => {
    if (phase === 'playing') {
      window.dispatchEvent(new Event('game:lock'))
      // Sword attack — stamp the timestamp so mobs can detect it this frame
      if (useGameStore.getState().hasSword) {
        lastAttackTime.current = performance.now()
      }
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 500 }}
        onClick={handleClick}
        style={{ display: 'block' }}
        onCreated={({ gl }) => gl.setClearColor('#87CEEB')}
      >
        <GameScene />
      </Canvas>

      {/* HTML overlays layered on top of the canvas */}
      {(phase === 'playing' || phase === 'paused') && <HUD />}
      {phase === 'playing' && <PlayerHand />}
      {phase === 'paused' && <PauseMenu />}
      {phase === 'levelComplete' && <LevelComplete />}
      {phase === 'win' && <WinScreen />}
    </div>
  )
}
