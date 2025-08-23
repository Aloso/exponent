import type { Direction } from './events'

export interface Square {
	variant: SquareVariant
	effects?: SquareEffect[]
	id: number
	num?: number
	animation?: SquareAnimation
	goal?: number
	direction?: Direction
}

export type SquareAnimation =
	| { kind: 'appear' }
	| { kind: 'move'; x: number; y: number }
	| { kind: 'vanish' | 'merge'; old: SquareAnimationOld[] }

export interface SquareAnimationOld {
	x: number
	y: number
	num: number
}

export type SquareEffect = 'black-hole'

export type SquareVariant = 'normal' | 'empty' | 'wall' | 'mouth'

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

export function squareLabel(num?: number): string {
	if (num === undefined) return ''
	if (num > 16_000) {
		const kilos = (num / 1000) | 0
		return kilos + 'K'
	} else {
		return `${num}`
	}
}
