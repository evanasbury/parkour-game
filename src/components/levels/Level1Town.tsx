import { Platform } from '../../objects/obstacles/Platform'
import { MovingPlatform } from '../../objects/obstacles/MovingPlatform'
import { Building } from '../../objects/environment/Building'
import { RigidBody } from '@react-three/rapier'
import { Checkpoint } from '../Checkpoint'
import { Goal } from '../Goal'

// Decorative laundry line
function LaundryLine({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ]
  return (
    <mesh position={mid}>
      <boxGeometry args={[0.03, 0.03, 8]} />
      <meshToonMaterial color="#D7CCC8" />
    </mesh>
  )
}

export function Level1Town() {
  const groundColor = '#8D6E63'
  const platformColor = '#A1887F'
  const roofColor = '#795548'
  const wallColor = '#BCAAA4'

  return (
    <group>
      {/* ── Ambient atmosphere ──────────────────────────── */}
      <fog attach="fog" args={['#FFCC80', 30, 120]} />
      <color attach="background" args={['#FFCC80']} />
      <ambientLight intensity={0.7} color="#FFE0B2" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.4}
        color="#FFF3E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={120}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* ── Ground ──────────────────────────────────────── */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -0.5, 10]}>
          <boxGeometry args={[60, 1, 100]} />
          <meshToonMaterial color={groundColor} />
        </mesh>
      </RigidBody>

      {/* ── Decorative backdrop buildings ───────────────── */}
      {/* Left row */}
      <Building position={[-14, 0, -10]} width={6} height={5} depth={8} wallColor="#C0785A" roofColor="#6D4C41" />
      <Building position={[-14, 0, 2]}  width={6} height={8} depth={8} wallColor="#BCAAA4" roofColor="#795548" />
      <Building position={[-14, 0, 14]} width={6} height={6} depth={8} wallColor="#C0785A" roofColor="#4E342E" />
      <Building position={[-14, 0, 26]} width={6} height={9} depth={8} wallColor="#A1887F" roofColor="#5D4037" />
      {/* Right row */}
      <Building position={[14, 0, -10]} width={6} height={6} depth={8} wallColor="#A1887F" roofColor="#5D4037" />
      <Building position={[14, 0, 2]}   width={6} height={5} depth={8} wallColor="#C0785A" roofColor="#6D4C41" />
      <Building position={[14, 0, 14]} width={6} height={7} depth={8} wallColor="#BCAAA4" roofColor="#4E342E" />
      <Building position={[14, 0, 26]} width={6} height={10} depth={8} wallColor="#C0785A" roofColor="#6D4C41" />

      {/* Laundry lines between buildings */}
      <LaundryLine from={[-11, 7, 5]} to={[11, 7, 5]} />
      <LaundryLine from={[-11, 5, -3]} to={[11, 5, -3]} />

      {/* ── SECTION 1: Ground run with obstacles ────────── */}
      {/* Crate cluster 1 */}
      <Platform position={[3, 0, -15]}  size={[2, 2.5, 2]} color="#8D6E63" />
      <Platform position={[-1.5, 0, -13]} size={[2, 1.5, 2]} color="#A1887F" />
      {/* Low wall — jump or clamber over */}
      <Platform position={[0, 0, -10]} size={[9, 1.8, 0.5]} color={wallColor} />
      {/* Step up */}
      <Platform position={[4, 0, -8]}  size={[2, 2.5, 2]} color={platformColor} />

      {/* ── SECTION 2: Rising to rooftop level ──────────── */}
      {/* Stair steps up the side of the right building */}
      <Platform position={[7, 2.5, -5]}  size={[3, 0.5, 3]} color={roofColor} />
      <Platform position={[8, 4, -2]}    size={[3, 0.5, 3]} color={roofColor} />
      {/* First rooftop surface (on top of right decorative building-ish) */}
      <Platform position={[8, 5.5, 2]}   size={[5, 0.5, 5]} color="#6D4C41" />
      {/* Bridge across the street */}
      <Platform position={[0, 5.5, 4]}   size={[14, 0.5, 2]} color={roofColor} />
      {/* Left side landing */}
      <Platform position={[-8, 5.5, 5]}  size={[5, 0.5, 5]} color="#6D4C41" />
      {/* Continue forward along left side */}
      <Platform position={[-6, 6, 9]}    size={[4, 0.5, 3]} color={platformColor} />
      <Platform position={[-2, 6.5, 12]} size={[4, 0.5, 3]} color={platformColor} />

      {/* ── CHECKPOINT ──────────────────────────────────── */}
      <Platform position={[2, 7, 15]}    size={[5, 0.5, 5]} color="#FF8F00" />
      <Checkpoint id={0} position={[2, 7.8, 15]} />

      {/* ── SECTION 3: Moving platforms & gaps ──────────── */}
      <MovingPlatform
        startPos={[0, 7.5, 19]}
        endPos={[6, 7.5, 19]}
        speed={1.0}
        size={[3, 0.5, 3]}
        color="#5D4037"
      />
      <Platform position={[6, 8, 23]}    size={[3, 0.5, 3]} color={platformColor} />
      <Platform position={[2, 8.5, 27]}  size={[3, 0.5, 3]} color={roofColor} />
      <Platform position={[-3, 9, 30]}   size={[3, 0.5, 3]} color={roofColor} />

      {/* ── SECTION 4: Final approach ────────────────────── */}
      <MovingPlatform
        startPos={[0, 9.5, 33]}
        endPos={[0, 12, 33]}
        speed={0.8}
        size={[3.5, 0.5, 3.5]}
        color="#4E342E"
      />
      {/* Final ledge */}
      <Platform position={[0, 12, 37]}   size={[7, 0.5, 3]} color="#3E2723" />
      <Platform position={[0, 12, 41]}   size={[7, 0.5, 3]} color="#3E2723" />

      {/* ── GOAL ────────────────────────────────────────── */}
      <Goal position={[0, 12.8, 43]} />
    </group>
  )
}
