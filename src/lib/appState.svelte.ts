import { levels } from './levels'
import { cleanSquares, type Pos } from './position'

export interface Config {
	completedLevels: CompletedLevel[]
	currentLevel?: { id: string; pos: Pos; encoded?: string }
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

export function setLevelState(id: string, encoded: string | undefined, pos: Pos) {
	appState.currentLevel = { id, encoded, pos: { ...pos, squares: cleanSquares(pos.squares) } }
}

export function resetLevelState() {
	appState.currentLevel = undefined
}

export function areAllLevelsCompleted() {
	return (
		appState.initialized &&
		levels.every((lvl) => appState.completedLevels.some((completed) => completed.id === lvl.id))
	)
}

export function isTutorialCompleted() {
	return (
		appState.initialized &&
		appState.completedLevels.some((completed) => completed.id === 'tutorial-01')
	)
}
