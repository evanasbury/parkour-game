import { RigidBody } from '@react-three/rapier'

interface BuildingProps {
  position: [number, number, number]
  width?: number
  height?: number
  depth?: number
  wallColor?: string
  roofColor?: string
  windowColor?: string
}

export function Building({
  position,
  width = 5,
  height = 6,
  depth = 5,
  wallColor = '#C0785A',
  roofColor = '#8B2500',
  windowColor = '#4A90D9',
}: BuildingProps) {
  return (
    <group position={position}>
      <RigidBody type="fixed">
        {/* Main body */}
        <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <meshToonMaterial color={wallColor} />
        </mesh>
        {/* Roof lip */}
        <mesh castShadow receiveShadow position={[0, height + 0.3, 0]}>
          <boxGeometry args={[width + 0.5, 0.6, depth + 0.5]} />
          <meshToonMaterial color={roofColor} />
        </mesh>
        {/* Windows front */}
        <mesh position={[width * 0.2, height * 0.55, depth / 2 + 0.06]}>
          <boxGeometry args={[0.8, 1.0, 0.05]} />
          <meshToonMaterial color={windowColor} />
        </mesh>
        <mesh position={[-width * 0.2, height * 0.55, depth / 2 + 0.06]}>
          <boxGeometry args={[0.8, 1.0, 0.05]} />
          <meshToonMaterial color={windowColor} />
        </mesh>
        {/* Door */}
        <mesh position={[0, height * 0.2, depth / 2 + 0.06]}>
          <boxGeometry args={[0.9, height * 0.35, 0.05]} />
          <meshToonMaterial color="#3E2723" />
        </mesh>
      </RigidBody>
    </group>
  )
}
