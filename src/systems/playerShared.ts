import type { RapierRigidBody } from '@react-three/rapier'

// Shared mutable references for cross-component player access
// (avoids React state overhead for per-frame data)
export const playerRef: { current: RapierRigidBody | null } = { current: null }
export const respawnPoint: { current: [number, number, number] } = {
  current: [0, 3, -22],
}

// World-space forward direction of the player camera (XZ plane, updated each frame)
export const playerForward = { x: 0, z: -1 }

// Timestamp (performance.now()) of the last sword swing; mobs check this
export const lastAttackTime = { current: 0 }
