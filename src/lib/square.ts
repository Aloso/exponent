export interface Square {
	variant: SquareVariant
	effects?: SquareEffect[]
	id: number
	num?: number
	animation?: SquareAnimation
	goal?: number
}

export type SquareAnimation =
	| { kind: 'appear' }
	| { kind: 'move'; x: number; y: number }
	| { kind: 'vanish'; x: number; y: number; oldNum: number }
	| { kind: 'merge'; x1: number; y1: number; x2: number; y2: number; oldNum: number }

export type SquareEffect = 'black-hole'

export type SquareVariant = 'normal' | 'empty' | 'wall'

export function printSquare(square: Square): string {
	if (square.num === undefined) {
		return square.variant === 'empty' ? '   ' : square.variant === 'wall' ? 'XXX' : '  -'
	} else if (square.effects?.includes('black-hole')) {
		return `(-)`
	} else if (square.num < 1000) {
		return `${square.num}`.padStart(3)
	} else {
		return (Math.round(square.num / 1000) + 'K').padStart(3)
	}
}
