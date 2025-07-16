import type { Direction } from './events'
import { printSquare, type Square } from './square'

export interface Pos {
	squares: Square[][]
	state: 'playing' | 'lost' | 'won'
	moveCount: number
}

type IterationCallback = (
	tx: number,
	ty: number,
	hx: number,
	hy: number,
	incHead: () => void,
	incTail: () => void,
) => void

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
		case 'up': {
			const incHead = () => hy++
			const incTail = () => ty++

			for (tx = hx = 0; tx < width; tx++, hx++) {
				ty = hy = 0
				while (hy < height) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case 'down': {
			const incHead = () => hy--
			const incTail = () => ty--

			for (tx = hx = 0; tx < width; tx++, hx++) {
				ty = hy = height - 1
				while (hy >= 0) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case 'left': {
			const incHead = () => hx++
			const incTail = () => tx++

			for (ty = hy = 0; ty < height; ty++, hy++) {
				tx = hx = 0
				while (hx < width) callback(tx, ty, hx, hy, incHead, incTail)
			}
			break
		}
		case 'right': {
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
