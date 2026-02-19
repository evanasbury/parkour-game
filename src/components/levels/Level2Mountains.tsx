import { Platform } from '../../objects/obstacles/Platform'
import { MovingPlatform } from '../../objects/obstacles/MovingPlatform'
import { Tree } from '../../objects/environment/Tree'
import { Rock } from '../../objects/environment/Rock'
import { RigidBody } from '@react-three/rapier'
import { Checkpoint } from '../Checkpoint'
import { Goal } from '../Goal'

function Bridge({
  position,
  length = 10,
  color = '#795548',
}: {
  position: [number, number, number]
  length?: number
  color?: string
}) {
  return (
    <group position={position}>
      {/* Planks */}
      <Platform
        position={[0, 0, 0]}
        size={[2.5, 0.4, length]}
        color={color}
      />
      {/* Rope rails */}
      <mesh position={[1.1, 0.5, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
      <mesh position={[-1.1, 0.5, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
    </group>
  )
}

export function Level2Mountains() {
  const rockGray = '#78909C'
  const darkRock = '#546E7A'
  const lightRock = '#90A4AE'

  return (
    <group>
      {/* ── Sky & atmosphere ───────────────────────────── */}
      <fog attach="fog" args={['#B3D9F7', 40, 160]} />
      <color attach="background" args={['#B3D9F7']} />
      <ambientLight intensity={0.65} color="#E1F5FE" />
      <directionalLight
        position={[20, 40, 5]}
        intensity={1.6}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={160}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* ── Ground / Base terrain ──────────────────────── */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -1, 10]}>
          <boxGeometry args={[80, 2, 120]} />
          <meshToonMaterial color={rockGray} />
        </mesh>
      </RigidBody>

      {/* ── Decorative trees ───────────────────────────── */}
      <Tree position={[-18, 0, -15]} scale={1.1} />
      <Tree position={[-20, 0, 0]}  scale={0.9} />
      <Tree position={[-22, 0, 15]} scale={1.2} />
      <Tree position={[-18, 0, 30]} scale={1.0} />
      <Tree position={[18, 0, -15]} scale={1.0} />
      <Tree position={[20, 0, 5]}   scale={1.3} />
      <Tree position={[22, 0, 20]}  scale={0.8} />
      <Tree position={[18, 0, 35]}  scale={1.1} />
      <Tree position={[-15, 8, 50]} scale={0.9} />
      <Tree position={[15, 8, 55]}  scale={1.0} />

      {/* ── Decorative rocks ───────────────────────────── */}
      <Rock position={[-8, 0, -18]} scale={[2, 1.5, 2]} />
      <Rock position={[6, 0, -16]}  scale={[1.5, 1, 1.8]} />
      <Rock position={[-5, 0, 5]}   scale={[1, 1.2, 1]} />
      <Rock position={[10, 0, 8]}   scale={[2, 1.8, 1.5]} />
      <Rock position={[-12, 6, 30]} scale={[1.5, 1, 1.5]} />

      {/* ── SECTION 1: Low mountain approach ───────────── */}
      {/* Initial rocky steps up */}
      <Platform position={[4, 1, -16]}   size={[4, 0.6, 4]} color={darkRock} />
      <Platform position={[-3, 2, -13]}  size={[4, 0.6, 4]} color={rockGray} />
      <Platform position={[4, 3.5, -9]}  size={[4, 0.6, 4]} color={darkRock} />
      <Platform position={[-2, 5, -5]}   size={[4, 0.6, 4]} color={lightRock} />
      <Platform position={[4, 6.5, -1]}  size={[4, 0.6, 4]} color={rockGray} />

      {/* ── First cliff ledge ──────────────────────────── */}
      <Platform position={[0, 8, 4]}     size={[8, 0.6, 5]} color={darkRock} />
      {/* Rocky wall for visual */}
      <RigidBody type="fixed">
        <mesh castShadow receiveShadow position={[0, 4, 1.5]}>
          <boxGeometry args={[8, 8, 1]} />
          <meshToonMaterial color={darkRock} />
        </mesh>
      </RigidBody>

      {/* ── Bridge over gorge ──────────────────────────── */}
      <Bridge position={[0, 8, 10]} length={10} color="#6D4C41" />

      {/* ── Second cliff section ───────────────────────── */}
      <Platform position={[0, 8, 16]}    size={[6, 0.6, 4]} color={darkRock} />
      <Platform position={[5, 9.5, 20]}  size={[3.5, 0.6, 3.5]} color={rockGray} />
      <Platform position={[-4, 11, 23]}  size={[3.5, 0.6, 3.5]} color={lightRock} />
      <Platform position={[3, 12.5, 27]} size={[3.5, 0.6, 3.5]} color={rockGray} />

      {/* ── CHECKPOINT ────────────────────────────────── */}
      <Platform position={[0, 14, 31]}   size={[6, 0.6, 5]} color="#37474F" />
      <Checkpoint id={0} position={[0, 14.6, 31]} />

      {/* ── Moving rocks / platforms ─────────────────── */}
      <MovingPlatform
        startPos={[0, 15, 35]}
        endPos={[7, 15, 35]}
        speed={1.3}
        size={[3, 0.6, 3]}
        color={darkRock}
      />
      <MovingPlatform
        startPos={[7, 16.5, 39]}
        endPos={[7, 16.5, 43]}
        speed={1.1}
        size={[3, 0.6, 3]}
        color={rockGray}
      />

      {/* ── Summit climb ─────────────────────────────── */}
      <Platform position={[2, 17.5, 44]}  size={[4, 0.6, 4]} color={lightRock} />
      <Platform position={[-3, 19, 48]}   size={[3.5, 0.6, 3.5]} color={rockGray} />
      <Platform position={[2, 20.5, 52]}  size={[3.5, 0.6, 3.5]} color={darkRock} />
      <Platform position={[-1, 22, 56]}   size={[3.5, 0.6, 3.5]} color={lightRock} />

      {/* ── Mountain peak platform ───────────────────── */}
      <Platform position={[0, 23.5, 60]}  size={[8, 0.6, 6]} color="#263238" />
      {/* Snow cap decoration */}
      <mesh position={[0, 24.15, 60]}>
        <boxGeometry args={[6, 0.3, 4]} />
        <meshToonMaterial color="#E3F2FD" />
      </mesh>

      {/* ── GOAL ──────────────────────────────────────── */}
      <Goal position={[0, 24.4, 60]} />
    </group>
  )
}
