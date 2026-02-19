import { RigidBody } from '@react-three/rapier'

interface PlatformProps {
  position: [number, number, number]
  size?: [number, number, number]
  color?: string
  rotation?: [number, number, number]
}

export function Platform({
  position,
  size = [4, 0.5, 4],
  color = '#8B6914',
  rotation,
}: PlatformProps) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
