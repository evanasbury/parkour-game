import type { RapierRigidBody } from '@react-three/rapier'

// Shared mutable references for cross-component player access
// (avoids React state overhead for per-frame data)
export const playerRef: { current: RapierRigidBody | null } = { current: null }
export const respawnPoint: { current: [number, number, number] } = {
  current: [0, 3, -22],
}
