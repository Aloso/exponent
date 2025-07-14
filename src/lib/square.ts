export interface Square {
	variant: SquareVariant
	id: number
	num?: number
	animation?: SquareAnimation
}

export type SquareAnimation =
	| { kind: 'appear' }
	| { kind: 'move'; x: number; y: number }
	| { kind: 'merge'; x1: number; y1: number; x2: number; y2: number; oldNum: number }

export type SquareVariant = 'normal' | 'empty' | 'wall'

export function printSquare(square: Square): string {
	if (square.num === undefined) {
		return square.variant === 'empty' ? '   ' : square.variant === 'wall' ? 'XXX' : '  -'
	} else if (square.num < 1000) {
		return `${square.num}`.padStart(3)
	} else {
		return (Math.round(square.num / 1000) + 'K').padStart(3)
	}
}
