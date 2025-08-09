<script lang="ts">
	import { goto } from '$app/navigation'
	import { addCompletedLevel, appState, resetLevelState, setLevelState } from '$lib/appState.svelte'
	import type { Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import Field from '../components/Field.svelte'
	import GameResultOverlay from '../components/GameResultOverlay.svelte'
	import LevelHeader from '../components/LevelHeader.svelte'
	import GameRules from '../components/GameRules.svelte'

	interface Props {
		level: Level
	}

	let { level }: Props = $props()

	let pos = $state(level.pos)
	let field = $state<Field>()
	let levelResult: 'won' | 'lost' | undefined = $state()
	let saved = $derived(appState.currentLevel)

	$effect(() => {
		level
		queueMicrotask(() => {
			levelResult = field?.checkGame()
		})
	})

	function finish() {
		goto('/')
	}

	function reset() {
		pos = level.pos
		levelResult = undefined
		queueMicrotask(() => {
			field?.setPos(level.pos)
		})
	}

	function undo() {
		field?.undo()
		levelResult = undefined
	}

	onMount(() => {
		const winHandler = field!.on('win', (event) => {
			addCompletedLevel(level.id)
			if (!level.overlay) levelResult = 'won'
			return event
		})
		const loseHandler = field!.on('lose', (event) => {
			resetLevelState()
			if (!level.overlay) levelResult = 'lost'
			return event
		})
		const moveHandler = field!.on('move', (event) => {
			setLevelState(level.id, event.newPos)
			pos = event.newPos
			return event
		})
		const undoHandler = field!.on('undo', (event) => {
			setLevelState(level.id, event.newPos)
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

<LevelHeader {level} {undo} canUndo={field?.canUndo()} />

<Field {level} bind:this={field} />

<GameRules rules={level.rules} onMove={field?.move} />

{#if level.overlay}
	<level.overlay {pos} {field} onFinished={finish} />
{:else if levelResult}
	{#if levelResult === 'won'}
		<GameResultOverlay
			actions={[
				{ label: 'Wiederholen', action: reset },
				{ label: 'Zum Hauptmenü', action: finish },
			]}
		>
			<h1>Level abgeschlossen</h1>
			<p class="emoji">🎉</p>
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
