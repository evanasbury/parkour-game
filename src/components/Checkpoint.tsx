import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { playerRef, respawnPoint } from '../systems/playerShared'
import { useGameStore } from '../stores/gameStore'

interface CheckpointProps {
  id: number
  position: [number, number, number]
}

export function Checkpoint({ id, position }: CheckpointProps) {
  const meshRef = useRef<Mesh>(null)
  const activated = useRef(false)
  const reachCheckpoint = useGameStore((s) => s.reachCheckpoint)
  const checkpointsReached = useGameStore((s) => s.checkpointsReached)

  const isActive = checkpointsReached.includes(id)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 1.2

    if (activated.current) return
    const player = playerRef.current
    if (!player) return
    const p = player.translation()
    const dx = p.x - position[0]
    const dy = p.y - position[1]
    const dz = p.z - position[2]

    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 3) {
      activated.current = true
      reachCheckpoint(id)
      respawnPoint.current = [position[0], position[1] + 1, position[2]]
    }

    // Pulse animation
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08
    meshRef.current.scale.setScalar(pulse)
  })

  return (
    <group position={position}>
      {/* Flag pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
        <meshToonMaterial color="#795548" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.4, 2.8, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshToonMaterial color={isActive ? '#4CAF50' : '#F44336'} />
      </mesh>
      {/* Spinning gem */}
      <mesh ref={meshRef} position={[0, 0.6, 0]}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshToonMaterial color={isActive ? '#4CAF50' : '#FF9800'} />
      </mesh>
      {/* Ground disk */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshToonMaterial color={isActive ? '#4CAF50' : '#FF9800'} />
      </mesh>
      <pointLight
        color={isActive ? '#4CAF50' : '#FF9800'}
        intensity={5}
        distance={6}
        decay={2}
      />
    </group>
  )
}
