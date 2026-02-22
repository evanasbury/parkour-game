// Maps a moving platform's RigidBody handle → its current world velocity [vx, vy, vz].
// MovingPlatform writes here each frame; PlayerController reads it to carry the player.
export const movingPlatformVelocities = new Map<number, [number, number, number]>()
