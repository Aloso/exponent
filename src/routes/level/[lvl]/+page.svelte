<script lang="ts">
	import { goto } from '$app/navigation'
	import { addCompletedLevel } from '$lib/appState.svelte'
	import { levels, type Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import Field from '../../../components/Field.svelte'
	import GameResultOverlay from '../../../components/GameResultOverlay.svelte'
	import LevelHeader from '../../../components/LevelHeader.svelte'

	interface Props {
		data: Level
	}

	let { data: level }: Props = $props()

	let pos = $state(level.pos)
	let field = $state<Field>()
	let levelResult: 'won' | 'lost' | undefined = $state()

	$effect(() => {
		level
		levelResult = undefined
	})

	let levelIndex = $derived(levels.findIndex((l) => l.id === level.id))
	let nextLevel = $derived(levels[levelIndex + 1])

	function finish() {
		addCompletedLevel(level.id)
		if (nextLevel) goto(`/level/${nextLevel.id}`)
		else goto('/')
	}

	function reset() {
		field?.setPos(level.pos)
		levelResult = undefined
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
			if (!level.overlay) levelResult = 'lost'
			return event
		})

		return () => {
			field!.off('win', winHandler)
			field!.off('lose', loseHandler)
		}
	})
</script>

<LevelHeader {level} {undo} canUndo={field?.canUndo()} />

<Field {level} bind:this={field} />

{#if level.overlay}
	<level.overlay {pos} {field} onFinished={finish} />
{:else if levelResult}
	{#if levelResult === 'won'}
		<GameResultOverlay
			actions={[{ label: nextLevel ? 'Nächster Level' : 'Zum Hauptmenü', action: finish }]}
		>
			<h1>Level {level.number ?? ''} abgeschlossen</h1>
			<p class="emoji">🎉</p>
			{#if !nextLevel}
				<p class="description">Du hast <em>alle Level</em> abgeschlossen!</p>
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
