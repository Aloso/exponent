import type { Block } from './square'

export interface LevelMode {
	id: string
	getColor: (n: number) => string
	combine: (a: Block, b: Block) => Block | undefined | 'destroy'
	create: () => Block
	hidden?: boolean
}

const colors = [
	'#777777',
	'#9c5408',
	'#9c2108',
	'#b50887',
	'#6408b5',
	'#0a19c5',
	'#0a64c5',
	'#039965',
	'#128415',
	'#6bae0c',
	'#d1d511',
	'#f4a810',
	'#db7100',
	'#ef2504',
	'#ef0c6c',
]

const altColors = [
	'#888888',
	'#63abf7',
	'#63def7',
	'#4af778',
	'#9bf74a',
	'#f5e63a',
	'#f59b3a',
	'#fc669a',
	'#ed7bea',
	'#9451f3',
	'#2e2aee',
	'#0b57ef',
	'#248eff',
	'#10dafb',
	'#10f393',
]

const powersOfTwo: Map<number, number> = new Map()
for (let i = 0; i < 15; i++) {
	powersOfTwo.set(2 ** i, i)
}

const powersOfThree: Map<number, number> = new Map()
for (let i = 0; i < 15; i++) {
	powersOfThree.set(1.5 * 2 ** i, i)
}

export const defaultMode: LevelMode = {
	id: 'default',
	combine(a, b) {
		if (a.antimatter !== b.antimatter) return 'destroy'
		return a.num === b.num ? { num: a.num + b.num, antimatter: a.antimatter } : undefined
	},
	getColor(n) {
		return colors[powersOfTwo.get(n) as number] ?? altColors[powersOfThree.get(n) as number] ?? 0
	},
	create() {
		return { num: 2 }
	},
}

export const logarithmicMode: LevelMode = {
	id: 'logarithmic',
	combine(a, b) {
		if (a.antimatter !== b.antimatter) return 'destroy'
		return a.num === b.num ? { num: a.num + 1, antimatter: a.antimatter } : undefined
	},
	getColor(n) {
		return colors[n]
	},
	create() {
		return { num: 1 }
	},
}

const fibSequence = createFibSequence(30)

export const fibMode: LevelMode = {
	id: 'fibonacchi',
	combine(a, b) {
		if (a.antimatter !== b.antimatter) return 'destroy'
		return (a.num === 1 && b.num === 1) || Math.abs(reverseFib(a.num) - reverseFib(b.num)) === 1
			? { num: a.num + b.num, antimatter: a.antimatter }
			: undefined
	},
	getColor(n) {
		return colors[fibSequence.get(n) ?? 0]
	},
	create() {
		return { num: 1 }
	},
}

function createFibSequence(n: number): Map<number, number> {
	let a = 1
	let b = 1
	const result = new Map<number, number>()
	result.set(1, 1)
	for (let i = 1; i <= n; i++) {
		const old = a
		a = b
		b = old + b
		result.set(b, i + 1)
	}
	return result
}

function reverseFib(n: number) {
	return fibSequence.get(n) ?? 0
}
