import { Platform } from '../../objects/obstacles/Platform'
import { MovingPlatform } from '../../objects/obstacles/MovingPlatform'
import { KillZone } from '../../objects/obstacles/KillZone'
import { Clouds } from '../../objects/environment/Clouds'
import { RigidBody } from '@react-three/rapier'
import { Checkpoint } from '../Checkpoint'
import { Goal } from '../Goal'
import { Mob } from '../../objects/enemies/Mob'
import { SwordPickup } from '../../objects/items/SwordPickup'

const STONE = '#90A4AE'
const DARK_STONE = '#546E7A'
const CREAM_STONE = '#B0BEC5'
const ACCENT_GOLD = '#FFD54F'

function CastleWall({
  position,
  size,
  color = STONE,
}: {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

function Tower({
  position,
  radius = 3,
  height = 12,
  color = STONE,
}: {
  position: [number, number, number]
  radius?: number
  height?: number
  color?: string
}) {
  return (
    <group position={position}>
      <RigidBody type="fixed">
        {/* Main tower body */}
        <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
          <cylinderGeometry args={[radius, radius + 0.3, height, 8]} />
          <meshToonMaterial color={color} />
        </mesh>
        {/* Battlement crown */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              castShadow
              position={[
                Math.cos(angle) * (radius - 0.2),
                height + 0.5,
                Math.sin(angle) * (radius - 0.2),
              ]}
            >
              <boxGeometry args={[0.7, 1, 0.7]} />
              <meshToonMaterial color={DARK_STONE} />
            </mesh>
          )
        })}
        {/* Tower roof platform */}
        <mesh receiveShadow position={[0, height + 0.05, 0]}>
          <cylinderGeometry args={[radius, radius, 0.1, 8]} />
          <meshToonMaterial color={DARK_STONE} />
        </mesh>
      </RigidBody>
    </group>
  )
}

function Flag({
  position,
  color = '#1565C0',
}: {
  position: [number, number, number]
  color?: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 4, 6]} />
        <meshToonMaterial color="#FFD54F" />
      </mesh>
      <mesh position={[0.5, 3.5, 0]}>
        <boxGeometry args={[1, 0.7, 0.05]} />
        <meshToonMaterial color={color} />
      </mesh>
    </group>
  )
}

export function Level3Castle() {
  return (
    <group>
      {/* ── Bright daytime sky ─────────────────────────── */}
      <fog attach="fog" args={['#C9E8FF', 60, 250]} />
      <color attach="background" args={['#87CEEB']} />
      <ambientLight intensity={1.1} color="#FFFDE7" />
      <directionalLight
        position={[30, 50, -10]}
        intensity={2.4}
        color="#FFFDE7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      {/* Warm fill from opposite side */}
      <pointLight position={[0, 30, 0]} color="#FFD700" intensity={1.2} distance={100} decay={1} />

      {/* ── Clouds ─────────────────────────────────────── */}
      <Clouds y={55} />

      {/* ── Ground / Courtyard ────────────────────────── */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -0.5, 15]}>
          <boxGeometry args={[80, 1, 120]} />
          <meshToonMaterial color={DARK_STONE} />
        </mesh>
      </RigidBody>

      {/* Courtyard tiles pattern */}
      {[-6, 0, 6].map((x) =>
        [-10, -2, 6, 14].map((z) => (
          <mesh key={`${x}_${z}`} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.8, 5.8]} />
            <meshToonMaterial color={x % 12 === z % 12 ? CREAM_STONE : STONE} />
          </mesh>
        ))
      )}

      {/* ── Outer castle walls (decorative perimeter) ─── */}
      <CastleWall position={[-20, 5, -5]}  size={[2, 10, 50]} color={DARK_STONE} />
      <CastleWall position={[20, 5, -5]}   size={[2, 10, 50]} color={DARK_STONE} />

      {/* ── Corner towers (decorative) ─────────────────── */}
      <Tower position={[-20, 0, -28]} radius={3.5} height={14} color={STONE} />
      <Tower position={[20, 0, -28]}  radius={3.5} height={14} color={STONE} />
      <Tower position={[-20, 0, 20]}  radius={3.5} height={14} color={STONE} />
      <Tower position={[20, 0, 20]}   radius={3.5} height={14} color={STONE} />

      {/* Flags on corner towers */}
      <Flag position={[-20, 14, -28]} color="#1565C0" />
      <Flag position={[20, 14, -28]}  color="#1565C0" />

      {/* ── Void kill zones below elevated sections ───── */}
      {/* Below the outer battlement walk (narrow wall at X -20) */}
      <KillZone
        position={[-20, 0.5, 2]}
        size={[6, 1.5, 32]}
        color="#1A0033"
        emissiveColor="#6A0DAD"
      />
      {/* Below the tower bridge and tower-hop section */}
      <KillZone
        position={[-11, 0.5, 3]}
        size={[20, 1.5, 10]}
        color="#1A0033"
        emissiveColor="#6A0DAD"
      />
      {/* Below the inner keep approach (sections 3 & 4) */}
      <KillZone
        position={[0, 0.5, 28]}
        size={[16, 1.5, 22]}
        color="#1A0033"
        emissiveColor="#6A0DAD"
      />

      {/* ── GATEHOUSE — first obstacle ─────────────────── */}
      {/* Gate arch left pillar */}
      <CastleWall position={[-4, 4, -22]} size={[3, 8, 3]} color={DARK_STONE} />
      {/* Gate arch right pillar */}
      <CastleWall position={[4, 4, -22]}  size={[3, 8, 3]} color={DARK_STONE} />
      {/* Gate arch top (jump over or go around) */}
      <CastleWall position={[0, 7.5, -22]} size={[5, 3, 3]} color={DARK_STONE} />
      {/* Step to get over the gate */}
      <Platform position={[-8, 2, -22]}  size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[-8, 4.5, -22]} size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[-8, 7, -22]}  size={[3, 0.5, 3]} color={CREAM_STONE} />
      <Platform position={[-4, 8.8, -22]} size={[5, 0.5, 3]} color={CREAM_STONE} />

      {/* ── SECTION 1: Outer battlements ──────────────── */}
      {/* Top of outer left wall - run along it */}
      <Platform position={[-20, 9.5, -10]} size={[2, 0.5, 35]} color={DARK_STONE} />
      {/* Merlon teeth */}
      {[-20, -14, -8, -2, 4, 10, 16].map((z) => (
        <mesh key={z} castShadow position={[-21, 10.8, z]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshToonMaterial color={STONE} />
        </mesh>
      ))}

      {/* Steps up to outer left wall */}
      <Platform position={[-16, 4, -18]}  size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[-18, 7, -14]}  size={[3, 0.5, 3]} color={STONE} />

      {/* ── SECTION 2: Tower hopping ──────────────────── */}
      {/* First mid-height tower */}
      <Tower position={[-20, 0, 0]} radius={3} height={11} color={CREAM_STONE} />
      <Flag position={[-20, 11, 0]} color="#E91E63" />

      {/* Jump from battlements to tower top: [-20, 9.5, 2] → tower top at [-20, 11, 0] */}
      {/* Already connected by wall platform */}

      {/* Bridge from first tower across */}
      <Platform position={[-12, 11, 3]}   size={[16, 0.5, 2.5]} color={DARK_STONE} />

      {/* Second tower (taller) */}
      <Tower position={[-3, 0, 3]} radius={3.5} height={14} color={STONE} />
      <Flag position={[-3, 14, 3]} color="#FFD54F" />

      {/* ── CHECKPOINT ────────────────────────────────── */}
      <Platform position={[-3, 14.2, 3]}  size={[5, 0.2, 5]} color={ACCENT_GOLD} />
      <Checkpoint id={0} position={[-3, 15, 3]} />

      {/* ── SECTION 3: Inner keep approach ────────────── */}
      {/* Elevated walkway from second tower */}
      <Platform position={[4, 14.5, 6]}   size={[3, 0.5, 3]} color={CREAM_STONE} />
      <Platform position={[8, 15.5, 10]}  size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[3, 16.5, 14]}  size={[3, 0.5, 3]} color={CREAM_STONE} />

      {/* Moving platform over the inner courtyard */}
      <MovingPlatform
        startPos={[-2, 17.5, 18]}
        endPos={[6, 17.5, 18]}
        speed={0.45}
        size={[3, 0.5, 3]}
        color={DARK_STONE}
      />

      {/* ── SECTION 4: Main keep tower climb ──────────── */}
      {/* The great keep — central, tall */}
      <Tower position={[0, 0, 28]} radius={5} height={32} color={CREAM_STONE} />
      <Flag position={[0, 32, 28]} color="#1565C0" />
      <Flag position={[5, 32, 28]} color="#FFD54F" />
      <Flag position={[-5, 32, 28]} color="#E91E63" />

      {/* Spiral staircase ledges around the keep */}
      <Platform position={[5.5, 19, 24]}  size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[6, 21, 28]}    size={[3, 0.5, 3]} color={CREAM_STONE} />
      <Platform position={[5.5, 23, 32]}  size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[0, 25, 34]}    size={[3, 0.5, 3]} color={CREAM_STONE} />
      <Platform position={[-5.5, 27, 32]} size={[3, 0.5, 3]} color={STONE} />
      <Platform position={[-6, 29, 28]}   size={[3, 0.5, 3]} color={CREAM_STONE} />

      {/* Moving platform for final gap */}
      <MovingPlatform
        startPos={[-5.5, 31, 24]}
        endPos={[-5.5, 31, 28]}
        speed={0.4}
        size={[3, 0.5, 3]}
        color={ACCENT_GOLD}
      />

      {/* ── KEEP ROOFTOP ──────────────────────────────── */}
      {/* The flat top of the keep tower (part of the Tower component) */}

      {/* ── SWORD — atop the gatehouse staircase ──────── */}
      <SwordPickup position={[-4, 9.9, -22]} />

      {/* ── MOBS ──────────────────────────────────────── */}
      {/* Undead knight 1 — patrols the outer battlement walk */}
      <Mob
        id="l3-mob-0"
        position={[-20, 10.1, 0]}
        patrolA={[-20, 10.1, -6]}
        patrolB={[-20, 10.1, 6]}
        speed={0.8}
        color="#1A2A4A"
      />
      {/* Undead knight 2 — guards the tower bridge */}
      <Mob
        id="l3-mob-1"
        position={[-12, 11.5, 3]}
        patrolA={[-14, 11.5, 3]}
        patrolB={[-10, 11.5, 3]}
        speed={1.0}
        color="#1A2A4A"
      />
      {/* Undead knight 3 — defends the keep rooftop / goal */}
      <Mob
        id="l3-mob-2"
        position={[0, 32.1, 26]}
        patrolA={[-2, 32.1, 25]}
        patrolB={[2, 32.1, 27]}
        speed={1.1}
        color="#0D1A33"
      />

      {/* ── GOAL — top of the keep! ───────────────────── */}
      <Goal position={[0, 33, 28]} />

      {/* Goal glow — warm golden light at the top */}
      <pointLight position={[0, 33, 28]} color="#FFD700" intensity={8} distance={20} decay={2} />
      <pointLight position={[0, 15, 0]}  color="#FFF9C4" intensity={2} distance={40} decay={1} />
    </group>
  )
}
