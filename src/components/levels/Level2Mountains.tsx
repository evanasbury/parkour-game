import { Platform } from '../../objects/obstacles/Platform'
import { MovingPlatform } from '../../objects/obstacles/MovingPlatform'
import { KillZone } from '../../objects/obstacles/KillZone'
import { Tree } from '../../objects/environment/Tree'
import { Rock } from '../../objects/environment/Rock'
import { Clouds } from '../../objects/environment/Clouds'
import { RigidBody } from '@react-three/rapier'
import { Checkpoint } from '../Checkpoint'
import { Goal } from '../Goal'
import { Mob } from '../../objects/enemies/Mob'
import { SwordPickup } from '../../objects/items/SwordPickup'

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
      <fog attach="fog" args={['#C9E8FF', 50, 180]} />
      <color attach="background" args={['#87CEEB']} />
      <ambientLight intensity={1.1} color="#E1F5FE" />
      <directionalLight
        position={[20, 40, 5]}
        intensity={2.2}
        color="#FFFDE7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={160}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* ── Clouds ─────────────────────────────────────── */}
      <Clouds y={40} />

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

      {/* ── Lava in the volcanic gorge (below bridge) ──── */}
      <KillZone
        position={[0, 0.5, 10]}
        size={[40, 1.5, 12]}
        color="#8B0000"
        emissiveColor="#FF4500"
      />
      {/* Lava below the moving platform section */}
      <KillZone
        position={[4, 0.5, 38]}
        size={[30, 1.5, 18]}
        color="#8B0000"
        emissiveColor="#FF4500"
      />
      {/* Lava below the summit climb */}
      <KillZone
        position={[0, 0.5, 52]}
        size={[20, 1.5, 20]}
        color="#8B0000"
        emissiveColor="#FF4500"
      />

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
        speed={0.5}
        size={[3, 0.6, 3]}
        color={darkRock}
      />
      <MovingPlatform
        startPos={[7, 16.5, 39]}
        endPos={[7, 16.5, 43]}
        speed={0.45}
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

      {/* ── SWORD — on the first cliff ledge (grab it early!) ── */}
      <SwordPickup position={[0, 9.2, 4]} />

      {/* ── MOBS ─────────────────────────────────────────── */}
      {/* Troll 1 — patrols the second cliff section */}
      <Mob
        id="l2-mob-0"
        position={[0, 8.6, 16]}
        patrolA={[-2, 8.6, 16]}
        patrolB={[2, 8.6, 16]}
        speed={0.85}
        color="#3A5A3A"
      />
      {/* Troll 2 — guards the rocky platform before the checkpoint */}
      <Mob
        id="l2-mob-1"
        position={[3, 13.1, 27]}
        patrolA={[2, 13.1, 26]}
        patrolB={[4, 13.1, 28]}
        speed={1.0}
        color="#2E4A2E"
      />
      {/* Troll 3 — defends the mountain peak / goal */}
      <Mob
        id="l2-mob-2"
        position={[0, 24.1, 60]}
        patrolA={[-2, 24.1, 59]}
        patrolB={[2, 24.1, 61]}
        speed={1.2}
        color="#1E3A1E"
      />

      {/* ── GOAL ──────────────────────────────────────── */}
      <Goal position={[0, 24.4, 60]} />
    </group>
  )
}
