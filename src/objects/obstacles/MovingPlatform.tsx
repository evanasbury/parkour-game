import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

interface MovingPlatformProps {
  startPos: [number, number, number]
  endPos: [number, number, number]
  speed?: number
  size?: [number, number, number]
  color?: string
}

export function MovingPlatform({
  startPos,
  endPos,
  speed = 1.2,
  size = [3, 0.5, 3],
  color = '#6D4C41',
}: MovingPlatformProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const t = useRef(0)
  const dir = useRef(1)

  useFrame((_, delta) => {
    if (!bodyRef.current) return
    t.current += delta * speed * dir.current
    if (t.current >= 1) {
      t.current = 1
      dir.current = -1
    }
    if (t.current <= 0) {
      t.current = 0
      dir.current = 1
    }
    const x = startPos[0] + (endPos[0] - startPos[0]) * t.current
    const y = startPos[1] + (endPos[1] - startPos[1]) * t.current
    const z = startPos[2] + (endPos[2] - startPos[2]) * t.current
    bodyRef.current.setNextKinematicTranslation({ x, y, z })
  })

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" position={startPos}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
