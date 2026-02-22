import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { MeshStandardMaterial } from 'three'
import { playerRef, respawnPoint } from '../../systems/playerShared'

interface KillZoneProps {
  position: [number, number, number]
  /** Full extents [width, height, depth] */
  size: [number, number, number]
  color?: string
  emissiveColor?: string
}

export function KillZone({
  position,
  size,
  color = '#8B0000',
  emissiveColor = '#FF4500',
}: KillZoneProps) {
  const matRef = useRef<MeshStandardMaterial>(null)
  const triggered = useRef(false)

  useFrame(() => {
    // Animate emissive pulsing
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.45 + Math.sin(Date.now() * 0.003) * 0.2
    }

    if (!playerRef.current) return
    const pos = playerRef.current.translation()

    // AABB check
    const inside =
      Math.abs(pos.x - position[0]) < size[0] / 2 &&
      Math.abs(pos.y - position[1]) < size[1] / 2 &&
      Math.abs(pos.z - position[2]) < size[2] / 2

    if (inside && !triggered.current) {
      triggered.current = true
      const sp = respawnPoint.current
      playerRef.current.setTranslation({ x: sp[0], y: sp[1] + 1, z: sp[2] }, true)
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    } else if (!inside) {
      triggered.current = false
    }
  })

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={0.45}
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  )
}
