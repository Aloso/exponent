export interface Config {
	completedLevels: CompletedLevel[]
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
	}
	appState.initialized = true
}

export function saveConfig() {
	localStorage.setItem('appState', JSON.stringify(appState))
}

export function addCompletedLevel(id: string) {
	if (!appState.completedLevels.some((lvl) => lvl.id === id)) {
		appState.completedLevels.push({ id, timestamp: Date.now() })
	}
}
