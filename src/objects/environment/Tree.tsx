import { RigidBody } from '@react-three/rapier'

interface TreeProps {
  position: [number, number, number]
  scale?: number
  trunkColor?: string
  foliageColor?: string
}

export function Tree({
  position,
  scale = 1,
  trunkColor = '#5D4037',
  foliageColor = '#2E7D32',
}: TreeProps) {
  return (
    <group position={position} scale={scale}>
      <RigidBody type="fixed">
        {/* Trunk */}
        <mesh castShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.22, 0.3, 3, 6]} />
          <meshToonMaterial color={trunkColor} />
        </mesh>
        {/* Foliage layers - bottom to top, lighter green */}
        <mesh castShadow position={[0, 3.8, 0]}>
          <coneGeometry args={[2.0, 3.2, 6]} />
          <meshToonMaterial color={foliageColor} />
        </mesh>
        <mesh castShadow position={[0, 5.5, 0]}>
          <coneGeometry args={[1.5, 2.8, 6]} />
          <meshToonMaterial color="#388E3C" />
        </mesh>
        <mesh castShadow position={[0, 7.0, 0]}>
          <coneGeometry args={[0.9, 2.2, 6]} />
          <meshToonMaterial color="#43A047" />
        </mesh>
      </RigidBody>
    </group>
  )
}
