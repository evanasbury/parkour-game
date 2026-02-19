import { RigidBody } from '@react-three/rapier'

interface RockProps {
  position: [number, number, number]
  scale?: [number, number, number]
  color?: string
}

export function Rock({
  position,
  scale = [1, 1, 1],
  color = '#78909C',
}: RockProps) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh castShadow receiveShadow scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
