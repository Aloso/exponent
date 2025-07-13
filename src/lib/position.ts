import { Direction } from './events'

export interface Pos {
	squares: Square[][]
	state: 'playing' | 'lost' | 'won'
}

export interface Square {
	num?: number
}

type IterationCallback = (
	tx: number,
	ty: number,
	hx: number,
	hy: number,
	incHead: () => void,
	incTail: () => void,
) => void

function printSquare(square: Square): string {
	if (square.num === undefined) return '  -'
	else if (square.num < 1000) return `${square.num}`.padStart(3)
	else return (Math.round(square.num / 1000) + 'K').padStart(3)
}

export function printPos(pos: Pos): string {
	return pos.squares.map((row) => row.map(printSquare).join(' ')).join('\n')
}

export function iterateField(
	width: number,
	height: number,
	direction: Direction,
	callback: IterationCallback,
) {
	let tx = 0,
		ty = 0,
		hx = 0,
		hy = 0

	switch (direction) {
		case Direction.Up: {
			const incHead = () => hy++
			const incTail = () => ty++

			for (tx = hx = 0; tx < width; tx++, hx++) {
				ty = hy = 0
				while (hy < height) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case Direction.Down: {
			const incHead = () => hy--
			const incTail = () => ty--

			for (tx = hx = 0; tx < width; tx++, hx++) {
				ty = hy = height - 1
				while (hy >= 0) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case Direction.Left: {
			const incHead = () => hx++
			const incTail = () => tx++

			for (ty = hy = 0; ty < height; ty++, hy++) {
				tx = hx = 0
				while (hx < width) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case Direction.Right: {
			const incHead = () => hx--
			const incTail = () => tx--

			for (ty = hy = 0; ty < height; ty++, hy++) {
				tx = hx = width - 1
				while (hx >= 0) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
	}
}
