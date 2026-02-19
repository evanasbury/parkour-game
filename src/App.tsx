import { useGameStore } from './stores/gameStore'
import { MainMenu } from './components/UI/MainMenu'
import { Game } from './components/Game'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  return phase === 'menu' ? <MainMenu /> : <Game />
}
