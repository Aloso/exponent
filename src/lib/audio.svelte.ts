let music: HTMLAudioElement | undefined = undefined

interface MusicState {
	playing: boolean
}

export const musicState = $state({
	initialized: false,
	paused: true,
	canPlay: false,
	error: false,
})

export function initMusic() {
	if (!music) {
		music = new Audio('/audio/game_music.mp3')
		music.loop = true

		musicState.initialized = true
		music.addEventListener('play', () => {
			musicState.paused = false
			console.log('music playing')
		})
		music.addEventListener('pause', () => {
			musicState.paused = true
			console.log('music paused')
		})
		music.addEventListener('abort', () => {
			musicState.paused = true
		})
		music.addEventListener('canplay', () => {
			musicState.canPlay = true
		})
		music.addEventListener('waiting', () => {
			musicState.canPlay = false
		})
		music.addEventListener('playing', () => {
			musicState.canPlay = true
		})
		music.addEventListener('error', () => {
			musicState.error = true
		})
	}

	const savedState: MusicState = JSON.parse(
		localStorage.getItem('musicState') ?? '{"playing": true}',
	)
	if (savedState.playing) {
		music.play()
	}
}

export function finalizeMusic() {
	music?.pause()
}

export function togglePaused() {
	if (!music || musicState.error) {
		return
	}
	const state: MusicState = { playing: false }

	if (!musicState.paused) {
		music.pause()
		state.playing = false
	} else {
		music.play()
		state.playing = true
	}

	localStorage.setItem('musicState', JSON.stringify(state))
}
