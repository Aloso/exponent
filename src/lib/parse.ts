import type { Direction } from './events'
import type { Pos } from './position'
import type { Square } from './square'

/**
 * Parses a string to a position, where each row is delimited by a line break, and fields are separated by spaces.
 *
 * The following notations are available:
 *
 * - `-` empty
 * - `n` normal
 * - `X` wall
 * - `b` black hole
 * - `mD` mouth, where `D` is the direction (`l`: left, `r`: right, `u`: up, `d`: down)
 * - `gN` goal field, where N is the goal value
 *
 * Can be appended to normal fields:
 *
 * - `+N` means that it initially contains the number N
 */
export function parsePosition(positionString: string, update?: (pos: Pos) => void): Pos {
	let id = 0
	const squares = positionString.split(/[\n|]/g).map((row) =>
		row
			.trim()
			.split(' ')
			.map((sq) => parseSquare(sq, id++)),
	)
	const pos: Pos = { squares, moveCount: 0, state: 'playing' }
	if (update) update(pos)
	return pos
}

function parseSquare(squareString: string, id: number): Square {
	const [before, after] = squareString.split('+')
	let output: Square

	switch (before[0]) {
		case '-':
			output = { variant: 'empty', id }
			break
		case 'n':
			output = { variant: 'normal', id }
			break
		case 'X':
			output = { variant: 'wall', id }
			break
		case 'b':
			output = { variant: 'black-hole', id }
			break
		case 'm':
			output = { variant: 'mouth', id, direction: parseDirection(before[1]) }
			break
		case 'g':
			output = { variant: 'normal', goal: Number.parseInt(before.slice(1)), id }
			break
		default:
			throw new Error(`invalid square: '${before}'`)
	}

	if (after) {
		const antimatter = after.startsWith('!')
		const rest = antimatter ? after.slice(1) : after

		const num = Number.parseInt(rest)
		if (Number.isNaN(num)) {
			throw new Error('Invalid number')
		}
		if (output.variant !== 'normal') {
			throw new Error(`Can't add number to ${output.variant} square`)
		}
		output.block = antimatter ? { num, antimatter } : { num }
	}
	return output
}

function parseDirection(directionString: string): Direction {
	switch (directionString) {
		case 'u':
			return 'up'
		case 'd':
			return 'down'
		case 'l':
			return 'left'
		case 'r':
			return 'right'
		default:
			throw new Error('invalid direction')
	}
}
