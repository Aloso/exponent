let startTime = 0
let doc: string

export async function setStartTime() {
	doc = await getDocument()
	startTime = Date.now()
}

function shouldCheckForUpdate() {
	return startTime !== 0 && startTime < Date.now() - 120_000
}

export async function shouldUpdate() {
	if (shouldCheckForUpdate()) {
		const document = await getDocument()
		return document !== doc
	} else {
		return false
	}
}

export async function getDocument(): Promise<string> {
	try {
		const response = await fetch('/')
		const body = await response.text()
		return body
	} catch {
		// do nothing
		return ''
	}
}
