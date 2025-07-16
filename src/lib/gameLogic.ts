import type { Direction } from './events'
import { iterateField } from './position'
import type { Square } from './square'

export function gameLogic(squares: Square[][], direction: Direction) {
	const newSquares = squares.map((row) =>
		row.map(({ id, variant, effects, num }): Square => ({ id, variant, effects, num })),
	)
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
			} else if (head.num !== undefined) {
				if (head.num === tail.num && !tail.effects?.includes('black-hole')) {
					// merge
					const oldNum = tail.num
					tail.num *= 2

					let x2 = 0,
						y2 = 0
					if (tail.animation?.kind === 'move') {
						x2 = tail.animation.x
						y2 = tail.animation.y
					}
					const move = moveAnimation(hx - tx, hy - ty)
					tail.animation = { kind: 'merge', x1: move.x, y1: move.y, x2, y2, oldNum }

					head.num = undefined
					moves++
					incHead()
					incTail()
				} else if (tail.num === undefined && tail.variant === 'normal') {
					// move or vanish
					if (tail.effects?.includes('black-hole')) {
						const oldNum = head.num
						tail.animation = { kind: 'vanish', ...moveAnimation(hx - tx, hy - ty), oldNum }
						incTail()
					} else {
						tail.num = head.num
						tail.animation = { kind: 'move', ...moveAnimation(hx - tx, hy - ty) }
					}
					head.num = undefined
					moves++
					incHead()
				} else {
					incTail()
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
	squares: Square[][],
	goal?: number,
): 'playing' | 'won' | 'lost' {
	let highestNumber = 0
	for (const row of squares) {
		for (const square of row) {
			highestNumber = Math.max(highestNumber, square.num ?? 0)
		}
	}
	if (goal && highestNumber >= goal) {
		return 'won'
	}

	const availableFields = squares.flatMap((row) =>
		row.filter(
			(s) => s.num === undefined && s.variant === 'normal' && !s.effects?.includes('black-hole'),
		),
	)

	if (availableFields.length > 0) {
		const idx = (Math.random() * availableFields.length) | 0
		availableFields[idx].num = 2
		availableFields[idx].animation = { kind: 'appear' }

		if (availableFields.length === 1) {
			// field is full after this move
			let moveIsPossible = false
			for (const direction of ['up', 'down', 'left', 'right'] as const) {
				if (gameLogic(squares, direction) !== squares) {
					// move succeeded
					moveIsPossible = true
					break
				}
			}
			if (!moveIsPossible) {
				return 'lost'
			}
		}
	} else {
		return 'lost'
	}

	return 'playing'
}

function moveAnimation(x: number, y: number) {
	return {
		x: x === 0 ? 0 : x + (Math.abs(x) - 1) * 0.2 * Math.sign(x),
		y: y === 0 ? 0 : y + (Math.abs(y) - 1) * 0.2 * Math.sign(y),
	}
}
