import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Group } from 'three'
import { playerRef } from '../systems/playerShared'
import { useGameStore } from '../stores/gameStore'

interface GoalProps {
  position: [number, number, number]
}

export function Goal({ position }: GoalProps) {
  const starRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const reached = useRef(false)
  const completeLevel = useGameStore((s) => s.completeLevel)
  const phase = useGameStore((s) => s.phase)

  useFrame((state, delta) => {
    if (!starRef.current || !groupRef.current) return

    // Animate the star
    starRef.current.rotation.y += delta * 1.8
    starRef.current.rotation.x += delta * 0.6
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.3

    if (reached.current || phase !== 'playing') return

    const player = playerRef.current
    if (!player) return
    const p = player.translation()
    const dx = p.x - position[0]
    const dy = p.y - position[1]
    const dz = p.z - position[2]

    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.8) {
      reached.current = true
      completeLevel()
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Outer spinning ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.18, 8, 40]} />
        <meshToonMaterial color="#00FF88" />
      </mesh>
      {/* Inner spinning ring tilted */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.12, 8, 40]} />
        <meshToonMaterial color="#00CCFF" />
      </mesh>
      {/* Core star */}
      <mesh ref={starRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshToonMaterial color="#FFD700" />
      </mesh>
      {/* Glow light */}
      <pointLight color="#FFD700" intensity={8} distance={10} decay={2} />
      <pointLight color="#00FF88" intensity={4} distance={6} decay={2} />
    </group>
  )
}
