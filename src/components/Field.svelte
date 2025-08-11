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
		ClickEvent,
		GameClickHandler,
	} from '$lib/events'
	import type { Level } from '$lib/levels'
	import { printPos, type Pos } from '$lib/position'
	import SquareComponent from './Square.svelte'
	import { checkGameState, finishMoveAndAddNumber, gameLogic } from '$lib/gameLogic'
	import Gestures from './Gestures.svelte'

	interface Props {
		level: Level
		noGestures?: boolean
		highlights?: string[][]
	}

	let { level, noGestures, highlights }: Props = $props()

	let pos = $state(level.pos)
	let lastPos = $state(level.pos)
	let lastMoveTime = 0
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
		click: [] as GameClickHandler[],
	}

	export function move(direction: Direction) {
		const newPos = calculateNext(pos, direction)
		if (!newPos) return
		triggerMove({ direction, oldPos: pos, newPos })
	}

	function triggerMove(event: MoveEvent) {
		let moveTime = Date.now()
		if (moveTime - lastMoveTime < 200) {
			return
		}
		lastMoveTime = moveTime

		for (const row of pos.squares) {
			for (const square of row) {
				square.animation = undefined
			}
		}

		const actualEvent = triggerEvent('move', event)
		if (!actualEvent) return

		// this makes sure that animations run, even if there
		// was the same animation on the same square before
		setTimeout(() => {
			requestAnimationFrame(() => {
				lastPos = pos
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
		})
	}

	function triggerEvent(eventName: 'move', event: MoveEvent): MoveEvent | undefined
	function triggerEvent(eventName: 'win' | 'lose', event: ResultEvent): ResultEvent | undefined
	function triggerEvent(eventName: 'undo', event: HistoryEvent): HistoryEvent | undefined
	function triggerEvent(eventName: 'click', event: ClickEvent): ClickEvent | undefined
	function triggerEvent(eventName: 'move' | 'win' | 'lose' | 'undo' | 'click', event: GameEvent) {
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
	export function on(eventName: 'click', handler: GameClickHandler): GameClickHandler
	export function on(
		eventName: 'move' | 'win' | 'lose' | 'undo' | 'click',
		handler: FieldEventHandler,
	) {
		console.log('registered event handler:', eventName)
		handlers[eventName].push(handler as any)
		return handler
	}

	export function off(
		eventName: 'move' | 'win' | 'lose' | 'undo' | 'click',
		handler: FieldEventHandler,
	) {
		console.log('removed event handler:', eventName)
		handlers[eventName] = handlers[eventName].filter((h) => h !== handler) as any
	}

	export function setPos(newPos: Pos, allowUndo = false) {
		pos = newPos
		if (!allowUndo) {
			lastPos = pos
		}
	}

	export function setGoal(newGoal?: number | { fields: number }) {
		goal = newGoal
	}

	export function canUndo() {
		return pos.moveCount > lastPos.moveCount
	}

	export function undo() {
		if (!canUndo()) {
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

	export function checkGame() {
		const state = checkGameState(pos.squares, level.goal)
		if (state === 'won' || state === 'lost') {
			return state
		}
	}

	function calculateNext(pos: Pos, direction: Direction): Pos | undefined {
		const newSquares = gameLogic(level.mode, pos.squares, direction)
		if (newSquares === pos.squares) {
			// no move was done
			return
		}

		const state = finishMoveAndAddNumber(level.mode, newSquares, goal)
		return { squares: newSquares, state, moveCount: pos.moveCount + 1 }
	}
</script>

<div
	class="field"
	class:hidden-fields={level.mode.hidden}
	style="--aspect-ratio: {pos.squares.length / pos.squares[0].length}; --columns: {pos.squares[0]
		.length}"
>
	<div class="outer">
		<div class="inner">
			{#each pos.squares as row, y}
				{#each row as square, x}
					<SquareComponent
						{square}
						mode={level.mode}
						highlights={highlights?.[y][x]}
						onclick={() => triggerEvent('click', { action: 'click', x, y })}
					/>
				{/each}
			{/each}
		</div>
	</div>
</div>

{#if typeof goal === 'number'}
	<div class="goal">Erreiche die Zahl <em>{goal}</em>.</div>
{:else if goal}
	{#if goal.fields > 1}
		<div class="goal">Fülle die <em>Zielfelder</em> mit der erwarteten Zahl.</div>
	{:else}
		<div class="goal">Fülle das <em>Zielfeld</em> mit der erwarteten Zahl.</div>
	{/if}
{/if}

{#if !noGestures}
	<Gestures withKeyboard onMove={move} />
{/if}

<style lang="scss">
	.field {
		width: 90%;
		margin: 0 auto;
		animation: appear-from-center 0.3s ease forwards;
		font-size: calc(0.3 * var(--app-width) / var(--columns, 4));

		&.hidden-fields {
			color: transparent !important;
		}
	}

	@keyframes appear-from-center {
		0% {
			opacity: 0;
			transform: scale(0.7);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.outer {
		box-sizing: border-box;
		background-color: #6c016c;
		border-radius: 1rem;
		width: 100%;
		padding: 0.5rem;
	}

	.inner {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(var(--columns), 1fr);
	}

	.goal {
		margin: 2rem 0 1rem 0;
		text-align: center;
	}
</style>
