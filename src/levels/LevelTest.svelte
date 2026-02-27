<script lang="ts">
	import { goto } from '$app/navigation'
	import { appState, resetLevelState, setLevelState } from '$lib/appState.svelte'
	import type { Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import Field from '../components/Field.svelte'
	import GameResultOverlay from '../components/GameResultOverlay.svelte'
	import LevelHeader from '../components/LevelHeader.svelte'
	import GameOptions from '../components/GameOptions.svelte'
	import type { LevelInputDto } from '$lib/api/types'
	import Goal from '../components/Goal.svelte'

	interface Props {
		level: Level
		loggedIn?: boolean
		cheat?: boolean
	}

	let { level, loggedIn, cheat }: Props = $props()

	let pos = $derived(level.pos)
	let field = $state<Field>()
	let levelResult: 'won' | 'lost' | undefined = $state()
	let saved = $derived(appState.currentLevel)
	let copied = $state(false)

	let publishing = $state(false)
	let publishMessage = $state<string>()

	$effect(() => {
		level
		queueMicrotask(() => {
			levelResult = field?.checkGame()
		})
	})

	$effect(() => {
		if (
			saved &&
			pos.moveCount === 0 &&
			saved.pos.moveCount > 2 &&
			saved.id === level.id &&
			saved.encoded === level.encoded
		) {
			console.log(`level restored (move ${saved.pos.moveCount})`)
			field?.setPos(saved.pos, false)
			pos = saved.pos
		}
	})

	function finish() {
		close()
	}

	function reset() {
		pos = level.pos
		levelResult = undefined
		queueMicrotask(() => {
			field?.setPos(level.pos)
		})
	}

	async function share() {
		const url = new URL('/level', location.href)
		url.searchParams.append('code', level.encoded!)
		const text = url.toString()

		if ('canShare' in navigator && navigator.canShare({ text })) {
			await navigator.share({ text })
		} else {
			await navigator.clipboard.writeText(text)
			copied = true
		}
	}

	async function publish() {
		publishing = true

		const mode = level.mode.id === 'default' ? undefined : level.mode.id

		const levelDto: LevelInputDto = {
			name: level.name,
			data: level.encoded!!,
			mode,
		}

		const response = await fetch('/api/levels', {
			method: 'post',
			body: JSON.stringify(levelDto),
			redirect: 'follow',
		})
		if (!response.ok) {
			switch (response.status) {
				case 429:
					publishMessage =
						'Fehler: Du hast in den letzten 24 Stunden bereits 5 Level veröffentlicht, mehr ist nicht erlaubt.'
					break
				case 401:
					publishMessage = 'Fehler: Du bist nicht angemeldet'
					break
				case 403:
					publishMessage = 'Fehler: Keine Berechtigung'
					break
				default:
					publishMessage = 'Beim Veröffentlichen ist ein Fehler aufgetreten'
			}
		} else {
			publishMessage = 'Erfolgreich veröffentlicht!'
			setTimeout(() => {
				goto('/account')
			}, 1000)
		}
	}

	function undo() {
		field?.undo()
		levelResult = undefined
	}

	onMount(() => {
		const winHandler = field!.on('win', (event) => {
			if (!level.overlay) levelResult = 'won'
			return event
		})
		const loseHandler = field!.on('lose', (event) => {
			resetLevelState()
			if (!level.overlay) levelResult = 'lost'
			return event
		})
		const moveHandler = field!.on('move', (event) => {
			setLevelState(level.id, level.encoded, event.newPos)
			pos = event.newPos
			return event
		})
		const undoHandler = field!.on('undo', (event) => {
			setLevelState(level.id, level.encoded, event.newPos)
			pos = event.newPos
			return event
		})

		return () => {
			field!.off('win', winHandler)
			field!.off('lose', loseHandler)
			field!.off('move', moveHandler)
			field!.off('undo', undoHandler)
		}
	})
</script>

<svelte:head>
	<title>{level.name} - Exponent</title>
</svelte:head>

<LevelHeader name={level.name} {level} {undo} canUndo={field?.canUndo()} />

<Field {level} bind:this={field} />
<GameOptions rules={level.rules} onMove={field?.move} />
{#if !level.overlay}
	<Goal goal={level.goal} />
{/if}

{#if level.overlay}
	<level.overlay {pos} {field} onFinished={finish} />
{:else if cheat || levelResult}
	{#if cheat || levelResult === 'won'}
		<GameResultOverlay
			actions={loggedIn
				? [
						{ label: 'Veröffentlichen', action: publish, disabled: publishing },
						{ label: 'Fertig', action: finish },
					]
				: [
						{ label: 'Teilen', action: share },
						{ label: 'Fertig', action: finish },
					]}
		>
			<h1>Level abgeschlossen</h1>
			<p class="emoji">🎉</p>
			<p>Du kannst den Level nun {loggedIn ? 'veröffentlichen' : 'mit anderen teilen'}!</p>
			{#if copied}
				<p>Link wurde kopiert.</p>
			{/if}
			{#if publishMessage}
				<p>{publishMessage}</p>
			{/if}
		</GameResultOverlay>
	{:else}
		<GameResultOverlay
			actions={[
				{ label: 'Rückgängig', action: undo },
				{ label: 'Wiederholen', action: reset },
			]}
		>
			<h1>Oh nein :(</h1>
			<p class="description">Auf dem Spielfeld ist kein Platz mehr.</p>
		</GameResultOverlay>
	{/if}
{/if}

<style lang="scss">
	.emoji {
		text-align: center;
		font-size: 4rem;
		user-select: none;
		animation: 1.4s ease-in-out emoji-warp forwards;
	}

	@keyframes emoji-warp {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		80% {
			opacity: 1;
			transform: scale(1.5);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.description {
		text-align: center;
		user-select: none;
	}
</style>
