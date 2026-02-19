export type GamePhase = 'menu' | 'playing' | 'paused' | 'levelComplete' | 'win'

export interface LevelConfig {
  id: number
  name: string
  subtitle: string
  spawnPoint: [number, number, number]
  theme: 'town' | 'mountains' | 'castle'
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'The Poor Town',
    subtitle: 'Escape the slums',
    spawnPoint: [0, 3, -22],
    theme: 'town',
  },
  {
    id: 2,
    name: 'The Mountains',
    subtitle: 'Climb to the peaks',
    spawnPoint: [0, 3, -22],
    theme: 'mountains',
  },
  {
    id: 3,
    name: 'Le Château Mystique',
    subtitle: 'Conquer the mythic castle',
    spawnPoint: [0, 3, -22],
    theme: 'castle',
  },
]
