import { create } from 'zustand'
import type { GamePhase } from '../types/game.types'

interface GameState {
  phase: GamePhase
  currentLevel: number
  checkpointsReached: number[]
  startTime: number
  elapsedTime: number

  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  completeLevel: () => void
  nextLevel: () => void
  reachCheckpoint: (id: number) => void
  resetToMenu: () => void
  tick: (now: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  currentLevel: 1,
  checkpointsReached: [],
  startTime: 0,
  elapsedTime: 0,

  startGame: () =>
    set({
      phase: 'playing',
      currentLevel: 1,
      checkpointsReached: [],
      startTime: Date.now(),
      elapsedTime: 0,
    }),

  pauseGame: () => set({ phase: 'paused' }),
  resumeGame: () => set({ phase: 'playing' }),

  completeLevel: () => {
    const { currentLevel } = get()
    if (currentLevel >= 3) {
      set({ phase: 'win' })
    } else {
      set({ phase: 'levelComplete' })
    }
  },

  nextLevel: () =>
    set((state) => ({
      phase: 'playing',
      currentLevel: state.currentLevel + 1,
      checkpointsReached: [],
      startTime: Date.now(),
      elapsedTime: 0,
    })),

  reachCheckpoint: (id) =>
    set((state) => {
      if (state.checkpointsReached.includes(id)) return state
      return { checkpointsReached: [...state.checkpointsReached, id] }
    }),

  resetToMenu: () =>
    set({
      phase: 'menu',
      currentLevel: 1,
      checkpointsReached: [],
      elapsedTime: 0,
    }),

  tick: (now) => {
    const { phase, startTime } = get()
    if (phase === 'playing') {
      set({ elapsedTime: (now - startTime) / 1000 })
    }
  },
}))
