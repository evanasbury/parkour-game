import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { playerRef } from '../../systems/playerShared'
import { useGameStore } from '../../stores/gameStore'

interface SwordPickupProps {
  position: [number, number, number]
}

export function SwordPickup({ position }: SwordPickupProps) {
  const groupRef = useRef<Group>(null)
  const hasSword = useGameStore((s) => s.hasSword)
  const pickedUpSword = useGameStore((s) => s.pickedUpSword)

  useFrame(() => {
    if (!groupRef.current || useGameStore.getState().hasSword) return

    const t = performance.now() / 1000
    groupRef.current.rotation.y = t * 1.8
    groupRef.current.position.y = position[1] + Math.sin(t * 2.2) * 0.18

    const player = playerRef.current
    if (!player) return
    const pp = player.translation()
    const dx = position[0] - pp.x
    const dy = position[1] - pp.y
    const dz = position[2] - pp.z
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.2) {
      pickedUpSword()
    }
  })

  if (hasSword) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Blade */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.1, 1.1, 0.06]} />
        <meshToonMaterial color="#C8C8C8" />
      </mesh>
      {/* Blade edge highlight */}
      <mesh position={[0.05, 0.55, 0]}>
        <boxGeometry args={[0.02, 1.0, 0.04]} />
        <meshToonMaterial color="#EFEFEF" />
      </mesh>
      {/* Cross-guard */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.1, 0.1]} />
        <meshToonMaterial color="#8B6914" />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -0.32, 0]}>
        <boxGeometry args={[0.1, 0.52, 0.1]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
      {/* Pommel */}
      <mesh position={[0, -0.62, 0]}>
        <boxGeometry args={[0.18, 0.16, 0.16]} />
        <meshToonMaterial color="#8B6914" />
      </mesh>
      {/* Glow point so it's visible from a distance */}
      <pointLight color="#FFD700" intensity={3} distance={6} decay={2} />
    </group>
  )
}
