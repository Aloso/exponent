import { cleanSquares, type Pos } from './position'

export interface Config {
	completedLevels: CompletedLevel[]
	currentLevel?: { id: string; pos: Pos }
	initialized: boolean
}

export interface CompletedLevel {
	id: string
	timestamp: number
}

const initialConfig: Config = {
	completedLevels: [],
	initialized: false,
}

export const appState = $state(initialConfig)

export function loadConfig() {
	const stored = localStorage.getItem('appState')
	if (stored) {
		const newState = JSON.parse(stored) as Config
		appState.completedLevels = newState.completedLevels
		appState.currentLevel = newState.currentLevel
	}
	appState.initialized = true
}

export function saveConfig() {
	localStorage.setItem('appState', JSON.stringify(appState))
}

export function addCompletedLevel(id: string) {
	if (!appState.completedLevels.some((lvl) => lvl.id === id)) {
		appState.completedLevels.push({ id, timestamp: Date.now() })
		appState.currentLevel = undefined
	}
}

export function setLevelState(id: string, pos: Pos) {
	appState.currentLevel = { id, pos: { ...pos, squares: cleanSquares(pos.squares) } }
}

export function resetLevelState() {
	appState.currentLevel = undefined
}
