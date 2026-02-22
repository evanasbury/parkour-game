import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Euler, MathUtils } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { useGameStore } from '../stores/gameStore'
import { playerRef, respawnPoint, playerForward } from './playerShared'
import { movingPlatformVelocities } from './platformRegistry'

const WALK_SPEED = 4.5
const SPRINT_SPEED = 8.5
const JUMP_VELOCITY = 7
const JUMP_BUFFER = 0.21
const EYE_HEIGHT = 0.75

interface PlayerControllerProps {
  spawnPoint?: [number, number, number]
}

export function PlayerController({
  spawnPoint = [0, 3, -22],
}: PlayerControllerProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()
  const { rapier, world } = useRapier()
  const keys = useKeyboard()
  const pauseGame = useGameStore((s) => s.pauseGame)
  const phase = useGameStore((s) => s.phase)

  // Camera euler stored as ref to avoid React re-renders every frame
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'))
  const isGrounded = useRef(false)
  const jumpBuffer = useRef(0)
  const canJump = useRef(true)
  // Set to true the moment a jump fires; cleared only once the raycast
  // confirms the player has actually left the ground (isGrounded → false).
  // This means canJump cannot reset until physical ground contact is broken
  // and then re-established — no timer, no arbitrary window.
  const jumpPending = useRef(false)
  const isLocked = useRef(false)

  // Share body ref globally for goal/checkpoint detection
  useEffect(() => {
    playerRef.current = bodyRef.current
  })

  useEffect(() => {
    respawnPoint.current = spawnPoint
  }, [spawnPoint])

  // Pointer-lock mouse look
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return
      const s = 0.0022
      euler.current.y -= e.movementX * s
      euler.current.x = MathUtils.clamp(
        euler.current.x - e.movementY * s,
        -Math.PI / 2.1,
        Math.PI / 2.1
      )
    }

    const onLockChange = () => {
      const canvas = document.querySelector('canvas')
      const locked = document.pointerLockElement === canvas
      isLocked.current = locked
      // Releasing pointer lock while playing triggers pause
      if (!locked && useGameStore.getState().phase === 'playing') {
        pauseGame()
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onLockChange)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onLockChange)
    }
  }, [pauseGame])

  // Allow other components to request pointer lock via custom event
  useEffect(() => {
    const lock = () => {
      if (useGameStore.getState().phase === 'playing') {
        document.querySelector('canvas')?.requestPointerLock()
      }
    }
    window.addEventListener('game:lock', lock)
    return () => window.removeEventListener('game:lock', lock)
  }, [])

  useFrame((_, delta) => {
    if (!bodyRef.current || phase !== 'playing') return

    const body = bodyRef.current
    playerRef.current = body
    const pos = body.translation()

    // ── Ground detection (downward raycast) ──────────────────────────
    const ray = new rapier.Ray(
      { x: pos.x, y: pos.y, z: pos.z },
      { x: 0, y: -1, z: 0 }
    )
    const hit = world.castRay(ray, 1.15, false)
    isGrounded.current = hit !== null && hit.timeOfImpact < 1.08

    // Once the player has physically left the ground after a jump, the
    // pending flag is cleared — no timer, purely contact-driven.
    if (jumpPending.current && !isGrounded.current) {
      jumpPending.current = false
    }

    // Allow another jump only when the hitbox is in contact with the ground
    // AND the previous jump has fully resolved (player was airborne).
    if (isGrounded.current && !jumpPending.current) {
      canJump.current = true
    }

    // Jump buffer: jump input registered slightly before landing
    if (keys.current.jump) {
      jumpBuffer.current = JUMP_BUFFER
    } else {
      jumpBuffer.current = Math.max(0, jumpBuffer.current - delta)
    }

    // Read current velocity before any overrides (used for vy continuity)
    const linvel = body.linvel()

    // ── Horizontal movement ──────────────────────────────────────────
    const yaw = euler.current.y
    const fwd = Number(keys.current.forward) - Number(keys.current.backward)
    const str = Number(keys.current.right) - Number(keys.current.left)
    const speed = keys.current.sprint ? SPRINT_SPEED : WALK_SPEED

    let vx = -Math.sin(yaw) * fwd + Math.cos(yaw) * str
    let vz = -Math.cos(yaw) * fwd - Math.sin(yaw) * str
    const len = Math.sqrt(vx * vx + vz * vz)
    if (len > 0) {
      vx = (vx / len) * speed
      vz = (vz / len) * speed
    }

    // ── Moving platform carriage (friction) ─────────────────────────
    // When grounded on a moving platform, add the platform's velocity so
    // the player travels with it instead of sliding off.
    if (isGrounded.current && hit) {
      const parentHandle = hit.collider.parent()
      if (parentHandle !== undefined) {
        const platVel = movingPlatformVelocities.get(
          typeof parentHandle === 'number' ? parentHandle : (parentHandle as { handle: number }).handle
        )
        if (platVel) {
          vx += platVel[0]
          vz += platVel[2]
        }
      }
    }

    // ── Vertical velocity ────────────────────────────────────────────
    let vy = linvel.y

    const canJumpNow = canJump.current && isGrounded.current
    if (jumpBuffer.current > 0 && canJumpNow) {
      vy = JUMP_VELOCITY
      jumpBuffer.current = 0
      canJump.current = false
      jumpPending.current = true  // wait for ground contact to break before re-arming
    }

    // Terminal velocity
    vy = Math.max(vy, -28)

    body.setLinvel({ x: vx, y: vy, z: vz }, true)

    // ── Camera ───────────────────────────────────────────────────────
    const t = body.translation()
    camera.position.set(t.x, t.y + EYE_HEIGHT, t.z)
    camera.rotation.copy(euler.current)

    // Publish facing direction so mobs/sword can read it
    playerForward.x = -Math.sin(euler.current.y)
    playerForward.z = -Math.cos(euler.current.y)

    // ── Respawn on fall ──────────────────────────────────────────────
    if (t.y < -20) {
      const sp = respawnPoint.current
      body.setTranslation({ x: sp[0], y: sp[1] + 1, z: sp[2] }, true)
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      position={spawnPoint}
      lockRotations
      mass={70}
      friction={0}
      restitution={0}
      linearDamping={0}
      angularDamping={0}
    >
      <CapsuleCollider args={[0.4, 0.35]} />
    </RigidBody>
  )
}
