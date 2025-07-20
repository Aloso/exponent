export interface LevelMode {
	id: string
	getColor: (n: number) => string
	combine: (a: number, b: number) => number | undefined
	create: () => number
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
]

const powersOfTwo: Map<number, number> = new Map()
for (let i = 0; i < 11; i++) {
	powersOfTwo.set(2 ** i, i)
}

export const defaultMode: LevelMode = {
	id: 'default',
	combine(a, b) {
		return a === b ? a + b : undefined
	},
	getColor(n) {
		return colors[powersOfTwo.get(n) ?? 0]
	},
	create() {
		return 2
	},
}

export const logarithmicMode: LevelMode = {
	id: 'logarithmic',
	combine(a, b) {
		return a === b ? a + 1 : undefined
	},
	getColor(n) {
		return colors[n]
	},
	create() {
		return 1
	},
}

const fibSequence = createFibSequence(30)

export const fibMode: LevelMode = {
	id: 'fibonacchi',
	combine(a, b) {
		return (a === 1 && b === 1) || Math.abs(reverseFib(a) - reverseFib(b)) === 1 ? a + b : undefined
	},
	getColor(n) {
		return colors[fibSequence.get(n) ?? 0]
	},
	create() {
		return 1
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
