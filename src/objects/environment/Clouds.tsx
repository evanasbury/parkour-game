import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

interface CloudProps {
  position: [number, number, number]
  speed?: number
  scale?: number
  /** X range to loop within: [min, max] */
  range?: [number, number]
}

function Cloud({ position, speed = 1, scale = 1, range = [-80, 80] }: CloudProps) {
  const groupRef = useRef<Group>(null)
  const xRef = useRef(position[0])

  // Random but deterministic puff layout seeded by initial position
  const puffs = useMemo(() => {
    const seed = position[0] * 13.7 + position[2] * 7.3
    const rand = (n: number) => {
      const s = Math.sin(seed + n) * 43758.5453
      return s - Math.floor(s)
    }
    const count = 5 + Math.floor(rand(0) * 4) // 5–8 spheres per cloud
    return Array.from({ length: count }, (_, i) => ({
      x: (rand(i * 3) - 0.5) * 6 * scale,
      y: (rand(i * 3 + 1) - 0.5) * 2 * scale,
      z: (rand(i * 3 + 2) - 0.5) * 3 * scale,
      r: (0.6 + rand(i * 7) * 0.8) * scale,
    }))
  }, [position, scale])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    xRef.current += speed * delta
    if (xRef.current > range[1]) xRef.current = range[0]
    groupRef.current.position.x = xRef.current
  })

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.r, 7, 5]} />
          <meshToonMaterial color="#FFFFFF" />
        </mesh>
      ))}
    </group>
  )
}

/** Drop this anywhere inside a level's <group> to get drifting clouds. */
export function Clouds({ y = 35, color: _color }: { y?: number; color?: string }) {
  const defs: Array<{
    pos: [number, number, number]
    speed: number
    scale: number
  }> = [
    { pos: [-60, y, -10], speed: 2.5, scale: 1.4 },
    { pos: [-30, y + 6, 20], speed: 1.8, scale: 1.0 },
    { pos: [10, y + 2, -20], speed: 3.0, scale: 1.2 },
    { pos: [40, y + 8, 10], speed: 2.0, scale: 0.9 },
    { pos: [-50, y + 4, 40], speed: 2.2, scale: 1.5 },
    { pos: [20, y, 50], speed: 1.5, scale: 1.1 },
    { pos: [-10, y + 10, 60], speed: 2.8, scale: 0.8 },
    { pos: [55, y + 3, 30], speed: 1.9, scale: 1.3 },
  ]

  return (
    <>
      {defs.map((d, i) => (
        <Cloud key={i} position={d.pos} speed={d.speed} scale={d.scale} />
      ))}
    </>
  )
}
