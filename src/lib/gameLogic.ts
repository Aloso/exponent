import type { Direction } from './events'
import type { LevelMode } from './modes'
import { cleanSquares, iterateField } from './position'
import type { Square, SquareAnimationOld } from './square'

export function gameLogic(mode: LevelMode, squares: Square[][], direction: Direction) {
	const newSquares = cleanSquares(squares)
	let moves = 0

	iterateField(
		newSquares[0].length,
		newSquares.length,
		direction,
		(tx, ty, hx, hy, incHead, incTail) => {
			const head = newSquares[hy][hx]
			const tail = newSquares[ty][tx]

			if (head === tail) {
				incHead()
				if (head.variant === 'empty' || head.variant === 'wall') {
					incTail()
				}
			} else if (tail.variant === 'mouth') {
				if (tail.direction !== direction || head.variant === 'wall' || head.variant === 'mouth') {
					incTail()
				} else if (head.block !== undefined) {
					const old: SquareAnimationOld = { ...moveAnimation(hx - tx, hy - ty), ...head.block }
					head.block = undefined
					if (tail.animation && tail.animation.kind === 'vanish') {
						tail.animation.old.push(old)
					} else {
						tail.animation = { kind: 'vanish', old: [old] }
					}
					moves++
					incHead()
				} else {
					incHead()
				}
			} else if (head.variant === 'mouth') {
				incTail()
			} else if (head.block !== undefined) {
				if (tail.block === undefined) {
					if (tail.variant === 'normal') {
						tail.block = head.block
						tail.animation = { kind: 'move', ...moveAnimation(hx - tx, hy - ty) }
						head.block = undefined
						moves++
						incHead()
					} else if (tail.variant === 'black-hole') {
						const oldBlock = head.block
						tail.animation = {
							kind: 'vanish',
							old: [{ ...moveAnimation(hx - tx, hy - ty), ...oldBlock }],
						}
						head.block = undefined
						moves++
						incTail()
						incHead()
					} else {
						incTail()
					}
				} else {
					const combined = mode.combine(head.block, tail.block)
					if (combined !== undefined && tail.variant !== 'black-hole') {
						// merge
						const headNum = head.block
						const tailNum = tail.block
						tail.block = combined === 'destroy' ? undefined : combined

						let x2 = 0,
							y2 = 0
						if (tail.animation?.kind === 'move') {
							x2 = tail.animation.x
							y2 = tail.animation.y
						}
						tail.animation = {
							kind: 'merge',
							old: [
								{ ...moveAnimation(hx - tx, hy - ty), ...headNum },
								{ x: x2, y: y2, ...tailNum },
							],
						}

						head.block = undefined
						moves++
						incHead()
						incTail()
					} else {
						incTail()
					}
				}
			} else {
				if (head.variant === 'wall') {
					incTail()
				} else {
					incHead()
				}
			}
		},
	)

	if (moves === 0) {
		return squares
	}
	return newSquares
}

export function finishMoveAndAddNumber(
	mode: LevelMode,
	squares: Square[][],
	goal?: number | { fields: number },
): 'playing' | 'won' | 'lost' {
	const state = checkGameState(squares, goal)
	if (state === 'lost' || state === 'won') {
		return state
	}

	const created = mode.create(squares)
	if (created) {
		const idx = (Math.random() * state.available.length) | 0
		state.available[idx].block = created
		state.available[idx].animation = { kind: 'appear' }
	}

	if (state.available.length === 1) {
		// field is full after this move
		let moveIsPossible = false
		for (const direction of ['up', 'down', 'left', 'right'] as const) {
			if (gameLogic(mode, squares, direction) !== squares) {
				// move succeeded
				moveIsPossible = true
				break
			}
		}
		if (!moveIsPossible) {
			return 'lost'
		}
	}

	return 'playing'
}

export function checkGameState(
	squares: Square[][],
	goal?: number | { fields: number },
): { available: Square[]; highest: number } | 'won' | 'lost' {
	let highestNumber = 0
	for (const row of squares) {
		for (const square of row) {
			highestNumber = Math.max(highestNumber, square.block?.num ?? 0)
		}
	}
	if (typeof goal === 'number' && highestNumber >= goal) {
		return 'won'
	} else if (typeof goal === 'object' && squares.every((row) => row.every(squareIsWon))) {
		return 'won'
	}

	const availableFields = squares.flatMap((row) =>
		row.filter((s) => s.block === undefined && s.variant === 'normal'),
	)

	if (availableFields.length > 0) {
		return { available: availableFields, highest: highestNumber }
	} else {
		return 'lost'
	}
}

function moveAnimation(x: number, y: number) {
	return {
		x: x === 0 ? 0 : x + (Math.abs(x) - 1) * 0.2 * Math.sign(x),
		y: y === 0 ? 0 : y + (Math.abs(y) - 1) * 0.2 * Math.sign(y),
	}
}

function squareIsWon(square: Square) {
	return !square.goal || (square.block && square.block.num >= square.goal)
}

interface SelectedCell {
	x: number
	y: number
	number: undefined
	variant: 'normal'
}

export function randomAvailableCell(squares: Square[][]): SelectedCell {
	const available = squares.flatMap((row, y) =>
		row
			.map((s, x) => ({ x, y, number: s.block?.num, variant: s.variant }))
			.filter((s): s is SelectedCell => s.number === undefined && s.variant === 'normal'),
	)
	const idx = (Math.random() * available.length) | 0
	return available[idx]
}
