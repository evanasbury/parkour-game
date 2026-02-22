import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGameStore } from '../../stores/gameStore'
import { lastAttackTime } from '../../systems/playerShared'

/** Arm with optional sword, rendered in its own transparent overlay canvas. */
function ArmModel({ hasSword }: { hasSword: boolean }) {
  const groupRef = useRef<Group>(null)
  const swingProgress = useRef(0)
  const lastSeenAttack = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = performance.now() / 1000

    // Detect new sword swing
    if (lastAttackTime.current !== lastSeenAttack.current) {
      lastSeenAttack.current = lastAttackTime.current
      swingProgress.current = 1.0
    }
    if (swingProgress.current > 0) {
      swingProgress.current = Math.max(0, swingProgress.current - delta * 5)
    }

    const swing = swingProgress.current

    // Idle bob and sway
    groupRef.current.position.y = -1.05 + Math.sin(t * 1.8) * 0.04
    groupRef.current.rotation.z = 0.12 + Math.sin(t * 1.8) * 0.012

    // Sword swing: thrust forward then pull back
    if (hasSword && swing > 0) {
      groupRef.current.position.z = -swing * 0.7
      groupRef.current.rotation.x = -swing * 1.1
    } else {
      groupRef.current.position.z = 0
      groupRef.current.rotation.x = 0
    }
  })

  return (
    <group
      ref={groupRef}
      position={[1.1, -1.05, 0]}
      rotation={[0.18, -0.55, 0.12]}
    >
      {/* ── Long-sleeve shirt ── */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[0.52, 1.4, 0.36]} />
        <meshToonMaterial color="#1A4A8A" />
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[0.54, 0.14, 0.38]} />
        <meshToonMaterial color="#163E75" />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[0.50, 0.62, 0.34]} />
        <meshToonMaterial color="#1A4A8A" />
      </mesh>

      {/* ── Skin — wrist ── */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.46, 0.22, 0.32]} />
        <meshToonMaterial color="#C8956A" />
      </mesh>

      {hasSword ? (
        /* ── Sword grip + blade ── */
        <group position={[0, 0.55, 0]}>
          {/* Handle */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.13, 0.55, 0.13]} />
            <meshToonMaterial color="#5D4037" />
          </mesh>
          {/* Guard */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.46, 0.1, 0.12]} />
            <meshToonMaterial color="#8B6914" />
          </mesh>
          {/* Blade */}
          <mesh position={[0, 1.0, 0]}>
            <boxGeometry args={[0.1, 1.15, 0.07]} />
            <meshToonMaterial color="#C8C8C8" />
          </mesh>
          {/* Blade highlight */}
          <mesh position={[0.05, 1.0, 0]}>
            <boxGeometry args={[0.02, 1.05, 0.05]} />
            <meshToonMaterial color="#F0F0F0" />
          </mesh>
        </group>
      ) : (
        /* ── Fist (default) ── */
        <group>
          <mesh position={[0, 0.68, 0]}>
            <boxGeometry args={[0.54, 0.46, 0.38]} />
            <meshToonMaterial color="#D4A07A" />
          </mesh>
          <mesh position={[0, 0.93, 0.04]}>
            <boxGeometry args={[0.50, 0.06, 0.28]} />
            <meshToonMaterial color="#BF8E66" />
          </mesh>
          <mesh position={[-0.29, 0.62, 0.06]}>
            <boxGeometry args={[0.10, 0.22, 0.18]} />
            <meshToonMaterial color="#C8956A" />
          </mesh>
        </group>
      )}
    </group>
  )
}

export function PlayerHand() {
  const hasSword = useGameStore((s) => s.hasSword)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: 420,
        height: 460,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <Canvas
        camera={{ fov: 42, position: [0, 0, 3.2], near: 0.1, far: 20 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} color="#FFF8E1" />
        <directionalLight position={[2, 4, 2]} intensity={1.4} color="#FFFDE7" />
        <directionalLight position={[-1, -1, 1]} intensity={0.3} color="#90CAF9" />
        <ArmModel hasSword={hasSword} />
      </Canvas>
    </div>
  )
}
