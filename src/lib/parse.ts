import type { Direction } from './events'
import type { Pos } from './position'
import type { Square } from './square'

export function parsePosition(positionString: string, update?: (pos: Pos) => void): Pos {
	let id = 0
	const squares = positionString.split('\n').map((row) =>
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
	switch (squareString[0]) {
		case '-':
			return { variant: 'empty', id }
		case '+':
			return { variant: 'normal', num: Number.parseInt(squareString.slice(1)), id }
		case 'n':
			return { variant: 'normal', id }
		case 'X':
			return { variant: 'wall', id }
		case 'b':
			return { variant: 'normal', id, effects: ['black-hole'] }
		case 'm':
			return { variant: 'mouth', id, direction: parseDirection(squareString[1]) }
		case 'g':
			return { variant: 'normal', goal: Number.parseInt(squareString.slice(1)), id }
		default:
			throw new Error('invalid square')
	}
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
