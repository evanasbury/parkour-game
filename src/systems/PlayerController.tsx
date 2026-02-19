import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Euler, MathUtils } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { useGameStore } from '../stores/gameStore'
import { playerRef, respawnPoint } from './playerShared'

const WALK_SPEED = 6
const SPRINT_SPEED = 10.5
const JUMP_VELOCITY = 9.5
const COYOTE_TIME = 0.13
const JUMP_BUFFER = 0.2
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
  const coyoteTimer = useRef(0)
  const jumpBuffer = useRef(0)
  const canJump = useRef(true)
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
    const wasGrounded = isGrounded.current
    isGrounded.current = hit !== null && hit.timeOfImpact < 1.08

    // Coyote time: short grace window after leaving a ledge
    if (wasGrounded && !isGrounded.current) {
      coyoteTimer.current = COYOTE_TIME
    } else if (!isGrounded.current) {
      coyoteTimer.current = Math.max(0, coyoteTimer.current - delta)
    }

    // Jump buffer: jump input registered slightly before landing
    if (keys.current.jump) {
      jumpBuffer.current = JUMP_BUFFER
    } else {
      jumpBuffer.current = Math.max(0, jumpBuffer.current - delta)
    }

    if (isGrounded.current && !keys.current.jump) {
      canJump.current = true
    }

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

    // ── Vertical velocity ────────────────────────────────────────────
    const linvel = body.linvel()
    let vy = linvel.y

    const canJumpNow =
      canJump.current && (isGrounded.current || coyoteTimer.current > 0)
    if (jumpBuffer.current > 0 && canJumpNow) {
      vy = JUMP_VELOCITY
      jumpBuffer.current = 0
      coyoteTimer.current = 0
      canJump.current = false
    }

    // Terminal velocity
    vy = Math.max(vy, -28)

    body.setLinvel({ x: vx, y: vy, z: vz }, true)

    // ── Camera ───────────────────────────────────────────────────────
    const t = body.translation()
    camera.position.set(t.x, t.y + EYE_HEIGHT, t.z)
    camera.rotation.copy(euler.current)

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
