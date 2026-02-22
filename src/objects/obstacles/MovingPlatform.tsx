import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { movingPlatformVelocities } from '../../systems/platformRegistry'

interface MovingPlatformProps {
  startPos: [number, number, number]
  endPos: [number, number, number]
  speed?: number
  size?: [number, number, number]
  color?: string
  friction?: number
}

export function MovingPlatform({
  startPos,
  endPos,
  speed = 0.5,
  size = [3, 0.5, 3],
  color = '#6D4C41',
  friction = 1.5,
}: MovingPlatformProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const t = useRef(0)
  const dir = useRef(1)

  // Clean up velocity entry when platform unmounts
  useEffect(() => {
    return () => {
      if (bodyRef.current) {
        movingPlatformVelocities.delete(bodyRef.current.handle)
      }
    }
  }, [])

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

    // Compute and register velocity so PlayerController can carry the player
    const velX = (endPos[0] - startPos[0]) * speed * dir.current
    const velY = (endPos[1] - startPos[1]) * speed * dir.current
    const velZ = (endPos[2] - startPos[2]) * speed * dir.current
    movingPlatformVelocities.set(bodyRef.current.handle, [velX, velY, velZ])
  })

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" position={startPos} friction={friction}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
