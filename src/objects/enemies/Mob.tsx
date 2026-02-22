import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { playerRef, respawnPoint, lastAttackTime, playerForward } from '../../systems/playerShared'
import { useGameStore } from '../../stores/gameStore'

interface MobProps {
  id: string
  position: [number, number, number]
  /** Patrol oscillates between patrolA ↔ patrolB (defaults to stationary) */
  patrolA?: [number, number, number]
  patrolB?: [number, number, number]
  /** Oscillation speed (radians/sec) */
  speed?: number
  color?: string
}

export function Mob({
  id,
  position,
  patrolA,
  patrolB,
  speed = 0.7,
  color = '#2D4A1E',
}: MobProps) {
  const groupRef = useRef<Group>(null)
  const lastHitRef = useRef(0)
  const killMob = useGameStore((s) => s.killMob)
  const isDead = useGameStore((s) => s.deadMobs.includes(id))

  const A = patrolA ?? position
  const B = patrolB ?? position

  useFrame(() => {
    if (!groupRef.current) return
    // Re-check from store to avoid stale closure values
    if (useGameStore.getState().deadMobs.includes(id)) return

    const t = performance.now() / 1000

    // Patrol: smooth oscillation between A and B
    const pct = (Math.sin(t * speed) + 1) / 2
    groupRef.current.position.x = A[0] + (B[0] - A[0]) * pct
    groupRef.current.position.y = A[1] + (B[1] - A[1]) * pct
    groupRef.current.position.z = A[2] + (B[2] - A[2]) * pct

    // Face the direction of movement
    const dx = B[0] - A[0]
    const dz = B[2] - A[2]
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      const dir = Math.cos(t * speed) > 0 ? 1 : -1
      groupRef.current.rotation.y = Math.atan2(dx * dir, dz * dir)
    }

    // Idle bob
    groupRef.current.position.y += Math.sin(t * 3) * 0.04

    const player = playerRef.current
    if (!player) return
    const pp = player.translation()
    const mp = groupRef.current.position

    const dx2 = mp.x - pp.x
    const dy2 = mp.y - pp.y
    const dz2 = mp.z - pp.z
    const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2)

    // Mob touches player → respawn
    if (dist < 1.5 && performance.now() - lastHitRef.current > 2000) {
      lastHitRef.current = performance.now()
      const sp = respawnPoint.current
      player.setTranslation({ x: sp[0], y: sp[1] + 1, z: sp[2] }, true)
      player.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }

    // Sword hit: player swung recently + mob is within reach + in front of player
    const { hasSword } = useGameStore.getState()
    if (
      hasSword &&
      performance.now() - lastAttackTime.current < 600 &&
      dist < 3.5
    ) {
      const dot =
        (dx2 / dist) * playerForward.x + (dz2 / dist) * playerForward.z
      if (dot > 0.35) {
        killMob(id)
      }
    }
  })

  if (isDead) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Red eyes */}
      <mesh position={[0.13, 1.82, 0.25]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshToonMaterial color="#FF1111" />
      </mesh>
      <mesh position={[-0.13, 1.82, 0.25]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshToonMaterial color="#FF1111" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.3]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.38, 1.15, 0]}>
        <boxGeometry args={[0.2, 0.55, 0.2]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.38, 1.15, 0]}>
        <boxGeometry args={[0.2, 0.55, 0.2]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.15, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.65, 0.2]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.15, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.65, 0.2]} />
        <meshToonMaterial color={color} />
      </mesh>
    </group>
  )
}
