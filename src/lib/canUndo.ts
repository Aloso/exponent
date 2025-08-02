let navigated = false

export function canUndo() {
	return navigated
}

export function allowUndo() {
	navigated = true
}
