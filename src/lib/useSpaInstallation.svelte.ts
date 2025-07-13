interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useSpaInstallation() {
	let installPrompt = $state<BeforeInstallPromptEvent>()
	let installed = $state(true)

	$effect(() => {
		window.addEventListener('beforeinstallprompt', (event) => {
			console.log('triggered!')
			event.preventDefault()
			installPrompt = event as BeforeInstallPromptEvent
			installed = false
		})
	})

	async function installApp() {
		if (!installPrompt) return
		const result = await installPrompt.prompt()
		if (result.outcome === 'accepted') {
			installPrompt = undefined
			installed = true
		}
	}

	return {
		get installed() {
			return installed
		},
		installApp,
	}
}
