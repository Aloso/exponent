<script lang="ts">
	import type {
		MoveEvent,
		GameMoveHandler,
		GameResultHandler,
		GameHistoryHandler,
		FieldEventHandler,
		GameEvent,
		ResultEvent,
		HistoryEvent,
		Direction,
	} from '$lib/events'
	import type { Level } from '$lib/levels'
	import { printPos, type Pos } from '$lib/position'
	import { onMount } from 'svelte'
	import SquareComponent from './Square.svelte'
	import { finishMoveAndAddNumber, gameLogic } from '$lib/gameLogic'
	import Gestures from './Gestures.svelte'

	interface Props {
		level: Level
	}

	let { level }: Props = $props()

	let pos = $state(level.pos)
	let lastPos = $state(level.pos)
	let goal = $state(level.goal)

	$effect(() => {
		pos = level.pos
		lastPos = level.pos
		goal = level.goal
	})

	$effect(() => {
		console.log(printPos(pos))
	})

	const handlers = {
		move: [] as GameMoveHandler[],
		win: [] as GameResultHandler[],
		lose: [] as GameResultHandler[],
		undo: [] as GameHistoryHandler[],
	}

	export function move(direction: Direction) {
		triggerMove({ direction, oldPos: pos, newPos: calculateNext(pos, direction) })
	}

	function triggerMove(event: MoveEvent) {
		for (const row of pos.squares) {
			for (const square of row) {
				square.animation = undefined
			}
		}

		const actualEvent = triggerEvent('move', event)
		if (!actualEvent) return
		lastPos = pos

		// this makes sure that animations run, even if there
		// was the same animation on the same square before
		setTimeout(() => {
			pos = actualEvent.newPos

			if (pos.state !== 'playing' && lastPos.state === 'playing') {
				const timestamp = Date.now()
				const resultEvent =
					pos.state === 'won'
						? triggerEvent('win', { pos, timestamp })
						: triggerEvent('lose', { pos, timestamp })
				if (resultEvent) {
					pos = resultEvent.pos
				}
			}
		})
	}

	function triggerEvent(eventName: 'move', event: MoveEvent): MoveEvent | undefined
	function triggerEvent(eventName: 'win' | 'lose', event: ResultEvent): ResultEvent | undefined
	function triggerEvent(eventName: 'undo', event: HistoryEvent): HistoryEvent | undefined
	function triggerEvent(eventName: 'move' | 'win' | 'lose' | 'undo', event: GameEvent) {
		let actualEvent = event
		for (const handler of handlers[eventName]) {
			const next = handler(actualEvent as any)
			if (!next) return
			actualEvent = next
		}
		return actualEvent
	}

	export function on(eventName: 'move', handler: GameMoveHandler): GameMoveHandler
	export function on(eventName: 'win' | 'lose', handler: GameResultHandler): GameResultHandler
	export function on(eventName: 'undo', handler: GameHistoryHandler): GameHistoryHandler
	export function on(eventName: 'move' | 'win' | 'lose' | 'undo', handler: FieldEventHandler) {
		console.log('registered event handler:', eventName)
		handlers[eventName].push(handler as any)
		return handler
	}

	export function off(eventName: 'move' | 'win' | 'lose' | 'undo', handler: FieldEventHandler) {
		console.log('removed event handler:', eventName)
		handlers[eventName] = handlers[eventName].filter((h) => h !== handler) as any
	}

	export function setPos(newPos: Pos) {
		pos = newPos
	}

	export function setGoal(newGoal: number | undefined) {
		goal = newGoal
	}

	export function undo() {
		if (pos === lastPos) {
			return
		}
		const actualEvent = triggerEvent('undo', {
			action: 'undo',
			oldPos: pos,
			newPos: lastPos,
		})
		if (actualEvent) {
			pos = lastPos = actualEvent.newPos
		}
	}

	function calculateNext(pos: Pos, direction: Direction): Pos {
		const newSquares = gameLogic(pos.squares, direction)
		if (newSquares === pos.squares) {
			// no move was done
			return pos
		}

		const state = finishMoveAndAddNumber(newSquares, goal)
		console.log(state)
		return { squares: newSquares, state }
	}
</script>

<div class="field">
	<div class="outer">
		<div class="inner">
			{#each pos.squares as row}
				{#each row as square}
					<SquareComponent {square} />
				{/each}
			{/each}
		</div>
	</div>
</div>

{#if goal}
	<div class="goal">Erreiche die Zahl <em>{goal}</em>.</div>
{/if}

<Gestures onMove={move} />

<style lang="scss">
	.field {
		position: relative;
		width: auto;
		width: 90%;
		height: 0;
		margin: 0 auto;
		padding-bottom: 90%;
	}

	.outer {
		position: absolute;
		box-sizing: border-box;
		background-color: #6c016c;
		border-radius: 1rem;
		width: 100%;
		height: 100%;
		padding: 1rem;
	}

	.inner {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		gap: 4%;
	}

	.goal {
		margin: 2rem 0 1rem 0;
		text-align: center;
	}
</style>
