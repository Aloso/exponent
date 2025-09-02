<script lang="ts">
	import { goto } from '$app/navigation'
	import { addCompletedLevel, appState, resetLevelState, setLevelState } from '$lib/appState.svelte'
	import { levels, type Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import Field from '../components/Field.svelte'
	import GameResultOverlay from '../components/GameResultOverlay.svelte'
	import LevelHeader from '../components/LevelHeader.svelte'
	import GameOptions, { type LevelData } from '../components/GameOptions.svelte'
	import Goal from '../components/Goal.svelte'
	import type { SafeUser } from '$lib/api/types'
	import LevelRating from '../components/LevelRating.svelte'

	interface Props {
		level: Level
		levelData?: LevelData
		navigate: (levelId: string) => void
		continueBack?: boolean
	}

	let { level, levelData, navigate, continueBack }: Props = $props()

	let me = $state<SafeUser>()

	let currentName = $state(level.name)
	let currentData = $state(levelData)

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

	let levelIndex = $derived(levels.findIndex((l) => l.id === level.id))
	let nextLevel = $derived(levelIndex === -1 ? undefined : levels[levelIndex + 1])

	function finish() {
		if (nextLevel) navigate(nextLevel.id)
		else if (continueBack) history.back()
		else goto('/')
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
		const storedUser = localStorage.getItem('userAccount')
		if (storedUser) {
			me = JSON.parse(storedUser)
		}

		const winHandler = field!.on('win', (event) => {
			if (level.id !== 'custom') addCompletedLevel(level.id)
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

<LevelHeader name={currentName} {level} {undo} canUndo={field?.canUndo()} />

<Field {level} bind:this={field} />
<GameOptions
	{me}
	rules={level.rules}
	onMove={field?.move}
	levelData={currentData}
	onChange={(data) => {
		currentName = data.name
		currentData = data
	}}
/>
{#if !level.overlay}
	<Goal goal={level.goal} />
{/if}

{#if level.overlay}
	<level.overlay {pos} {field} onFinished={finish} />
{:else if levelResult}
	{#if levelResult === 'won'}
		<GameResultOverlay
			actions={[
				{ label: 'Wiederholen', action: reset },
				{
					label: nextLevel ? 'Nächster Level' : continueBack ? 'Fertig' : 'Zum Hauptmenü',
					action: finish,
				},
			]}
		>
			<h1>Level {level.number ?? ''} abgeschlossen</h1>
			<p class="emoji">🎉</p>
			{#if !nextLevel && level.id !== 'custom'}
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

{#if levelResult === 'won' && me && currentData && currentData.author.user_id !== me.user_id}
	<div class="rating">
		<LevelRating
			small
			levelId={currentData.levelId}
			canVote
			votes={currentData.votes}
			myVote={currentData.myVote ?? 0}
		/>
	</div>
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

	.rating {
		display: flex;
		background-color: #fff2;
		z-index: 102;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 9rem;
		width: fit-content;
		margin: 0 auto;
		padding: 0 0.8rem;
		border-radius: 2rem;
	}
</style>
