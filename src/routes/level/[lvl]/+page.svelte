<script lang="ts">
	import { goto } from '$app/navigation'
	import { addCompletedLevel } from '$lib/appState.svelte'
	import { levels, type Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import Field from '../../../components/Field.svelte'
	import GameResultOverlay from '../../../components/GameResultOverlay.svelte'

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
		if (level.goal && !level.overlay) {
			const winHandler = field!.on('win', (event) => {
				levelResult = 'won'
				return event
			})
			const loseHandler = field!.on('lose', (event) => {
				levelResult = 'lost'
				return event
			})

			return () => {
				field!.off('win', winHandler)
				field!.off('lose', loseHandler)
			}
		}
	})
</script>

<h1>{level.name}</h1>

<Field {level} bind:this={field} />

{#if level.overlay}
	<level.overlay {pos} {field} onFinished={finish} />
{:else if levelResult}
	{#if levelResult === 'won'}
		<GameResultOverlay
			actions={[{ label: nextLevel ? 'Nächster Level' : 'Weiter', action: finish }]}
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
	h1 {
		text-align: center;
		line-height: 2.5rem;
		user-select: none;
	}

	.emoji {
		text-align: center;
		font-size: 3rem;
		user-select: none;
	}

	.description {
		text-align: center;
		user-select: none;
	}
</style>
