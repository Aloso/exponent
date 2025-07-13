<script lang="ts">
	import {
		Direction,
		type MoveEvent,
		type GameMoveHandler,
		type GameResultHandler,
		type GameHistoryHandler,
		type FieldEventHandler,
		type GameEvent,
		type ResultEvent,
		type HistoryEvent,
	} from '$lib/events'
	import type { Level } from '$lib/levels'
	import { iterateField, type Pos, type Square } from '$lib/position'
	import { onMount } from 'svelte'

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

	const handlers = {
		move: [] as GameMoveHandler[],
		win: [] as GameResultHandler[],
		lose: [] as GameResultHandler[],
		undo: [] as GameHistoryHandler[],
	}

	function move(direction: Direction) {
		triggerMove({ direction, oldPos: pos, newPos: calculateNext(pos, direction) })
	}

	function triggerMove(event: MoveEvent) {
		const actualEvent = triggerEvent('move', event)
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
	}

	function triggerEvent(eventName: 'move', event: MoveEvent): MoveEvent
	function triggerEvent(eventName: 'win' | 'lose', event: ResultEvent): ResultEvent
	function triggerEvent(eventName: 'undo', event: HistoryEvent): HistoryEvent
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
		handlers[eventName].push(handler as any)
		return handler
	}

	export function off(eventName: 'move' | 'win' | 'lose' | 'undo', handler: FieldEventHandler) {
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
		const newSquares = getNextSquares(pos.squares, direction)
		if (newSquares === pos.squares) {
			// no move was done
			return pos
		}

		let highestNumber = 0
		for (const row of newSquares) {
			for (const square of row) {
				highestNumber = Math.max(highestNumber, square.num ?? 0)
			}
		}
		if (level.goal && highestNumber >= level.goal) {
			return { squares: newSquares, state: 'won' }
		}

		const emptyFields = newSquares.flatMap((row) => row.filter((s) => s.num === undefined))
		if (emptyFields.length > 0) {
			const idx = (Math.random() * emptyFields.length) | 0
			emptyFields[idx].num = 2

			if (emptyFields.length === 1) {
				// field is full after this move
				let moveIsPossible = false
				for (const direction of [Direction.Up, Direction.Down, Direction.Left, Direction.Right]) {
					if (getNextSquares(newSquares, direction) !== newSquares) {
						// move succeeded
						moveIsPossible = true
						break
					}
				}
				if (!moveIsPossible) {
					return { squares: newSquares, state: 'lost' }
				}
			}
		} else {
			return { squares: newSquares, state: 'lost' }
		}

		return { squares: newSquares, state: pos.state }
	}

	function getNextSquares(squares: Square[][], direction: Direction) {
		const newSquares = squares.map((row) => row.map((s) => ({ ...s })))
		let moves = 0

		iterateField(
			newSquares[0].length,
			newSquares.length,
			direction,
			(tx, ty, hx, hy, incHead, incTail) => {
				const head = newSquares[hy][hx]
				const tail = newSquares[ty][tx]

				if (head !== tail && head.num !== undefined) {
					if (head.num === tail.num) {
						// merge
						tail.num *= 2
						head.num = undefined
						moves++
						incHead()
						incTail()
					} else if (tail.num === undefined) {
						// move
						tail.num = head.num
						head.num = undefined
						moves++
						incHead()
					} else {
						incTail()
					}
				} else {
					incHead()
				}
			},
		)

		if (moves === 0) {
			return squares
		}
		return newSquares
	}

	onMount(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') move(Direction.Left)
			else if (event.key === 'ArrowRight') move(Direction.Right)
			else if (event.key === 'ArrowUp') move(Direction.Up)
			else if (event.key === 'ArrowDown') move(Direction.Down)
		}
		window.addEventListener('keydown', keyDownHandler)

		return () => {
			window.removeEventListener('keydown', keyDownHandler)
		}
	})
</script>

<div style="text-align: center; margin-bottom: 0.5rem">
	<button onclick={() => move(Direction.Up)}>Up</button>
	<button onclick={() => move(Direction.Down)}>Down</button>
	<button onclick={() => move(Direction.Left)}>Left</button>
	<button onclick={() => move(Direction.Right)}>Right</button>
</div>

<div class="field">
	<div class="outer">
		<div class="inner">
			{#each pos.squares as row}
				{#each row as square}
					<div
						class="square d{String(square.num ?? '').length}"
						class:full={square.num !== undefined}
					>
						{square.num ?? ''}
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

{#if goal}
	<div class="goal">Erreiche die Zahl <em>{goal}</em>.</div>
{/if}

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
		background-color: #00000017;
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
		gap: 1rem;
	}

	.goal {
		margin: 2rem 0 1rem 0;
		text-align: center;
	}

	.square {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.3rem;
		background-color: #0001;

		&.full {
			background-color: #fff2;
		}

		&.d1 {
			font-size: 7.5vw;
		}
		&.d2 {
			font-size: 6.5vw;
		}
		&.d3 {
			font-size: 5.5vw;
		}
		&.d4 {
			font-size: 5vw;
		}
		&.d5 {
			font-size: 4.5vw;
		}
		&.d6 {
			font-size: 4vw;
		}
		&.d7 {
			font-size: 3.75vw;
		}
		&.d8 {
			font-size: 3.5vw;
		}
	}
</style>
