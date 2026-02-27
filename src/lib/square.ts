import type { Direction } from './events'

export interface Square {
	variant: SquareVariant
	id: number
	block?: Block
	animation?: SquareAnimation
	goal?: number
	direction?: Direction
}

export interface Block {
	num: number
	antimatter?: true
}

export type SquareAnimation =
	| { kind: 'appear' }
	| { kind: 'move'; x: number; y: number; antimatter?: boolean }
	| { kind: 'vanish' | 'merge'; old: SquareAnimationOld[] }

export interface SquareAnimationOld {
	x: number
	y: number
	num: number
	antimatter?: boolean
}

export type SquareEffect = 'black-hole'

export type SquareVariant = 'normal' | 'empty' | 'wall' | 'mouth' | 'black-hole'

const printLut = {
	normal: '  -',
	empty: '   ',
	wall: 'XXX',
	'black-hole': '(-)',
	mouth: '(<)',
}

export function printSquare(square: Square): string {
	if (square.block === undefined) {
		return printLut[square.variant]
	} else if (square.block.num < 1000) {
		return `${square.block.num}`.padStart(3)
	} else {
		return (Math.round(square.block.num / 1000) + 'K').padStart(3)
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
