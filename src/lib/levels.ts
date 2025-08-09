import type { Component } from 'svelte'
import Tutorial1 from '../levels/Tutorial1.svelte'
import { appState } from './appState.svelte'
import type { Pos } from './position'
import type Field from '../components/Field.svelte'
import { parsePosition } from './parse'
import { defaultMode, fibMode, logarithmicMode, type LevelMode } from './modes'

export interface LevelOverlayProps {
	pos: Pos
	field: Field
	onFinished: () => void
}

export interface Level {
	id: string
	number?: number
	name: string
	pos: Pos
	overlay?: Component<LevelOverlayProps>
	goal?: number | { fields: number }
	mode: LevelMode
	rules: LevelRule[]
}

export type LevelRule =
	| 'default'
	| 'logarithmic'
	| 'fibonacchi'
	| 'tutorial'
	| 'hidden'
	| 'empty'
	| 'walls'
	| 'black-holes'
	| 'target-fields'
	| 'mouths'

export const emptyPos = parsePosition(
	`n n n n
	n n n n
	n n n n
	n n n n`,
)

export function update(pos: Pos, callback: (newPos: Pos) => void): Pos {
	const updated: Pos = {
		squares: pos.squares.map((row) => row.map((sq) => ({ ...sq }))),
		state: pos.state,
		moveCount: pos.moveCount,
	}
	callback(updated)
	return updated
}

export const levels: Level[] = [
	{
		id: 'tutorial-01',
		name: 'Tutorial',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n+2 n
			n n n n`,
		),
		overlay: Tutorial1,
		mode: defaultMode,
		rules: ['default', 'tutorial'],
		goal: 16,
	},
	{
		id: 'classic-128',
		number: 1,
		name: 'Classic',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n+2 n
			n n n n`,
		),
		goal: 128,
		mode: defaultMode,
		rules: ['default'],
	},
	{
		id: 'classic-256',
		number: 2,
		name: 'Classic',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n+2 n
			n n n n`,
		),
		goal: 256,
		mode: defaultMode,
		rules: ['default'],
	},
	{
		id: 'walls-128',
		number: 3,
		name: 'Blockaden',
		pos: parsePosition(
			`X n n n
			n n X n
			n n n+2 n
			n n n n`,
		),
		goal: 128,
		mode: defaultMode,
		rules: ['default', 'walls'],
	},
	{
		id: 'empty-256',
		number: 4,
		name: 'Die Leere',
		pos: parsePosition(
			`n - n n
			n n n n
			n n n+2 n
			- n n -`,
		),
		goal: 256,
		mode: defaultMode,
		rules: ['default', 'empty'],
	},
	{
		id: 'black-hole',
		number: 5,
		name: 'Schwarzes Loch',
		pos: parsePosition(
			`n n n n
			n n n n
			n b n+2 n
			n n n n`,
		),
		goal: 256,
		mode: defaultMode,
		rules: ['default', 'black-holes'],
	},
	{
		id: 'colorful-mix',
		number: 6,
		name: 'Bunte Mischung',
		pos: parsePosition(
			`n n n n
			n b n n
			n n X n
			n n n X
			n+2 n - n`,
		),
		goal: 256,
		mode: defaultMode,
		rules: ['default', 'empty', 'walls', 'black-holes'],
	},
	{
		id: 'target-areas',
		number: 7,
		name: 'Zielfelder',
		pos: parsePosition(
			`- - g64 n
			n n n n
			n n n n
			n n n+2 n
			n g64 - -`,
		),
		goal: { fields: 2 },
		mode: defaultMode,
		rules: ['default', 'empty', 'target-fields'],
	},
	{
		id: 'remote-target',
		number: 8,
		name: 'Entlegener Ort',
		pos: parsePosition(
			`n n n n
			- X n n
			n n n+2 n
			n n X -
			n n n g256`,
		),
		goal: { fields: 1 },
		mode: defaultMode,
		rules: ['default', 'empty', 'walls', 'target-fields'],
	},
	{
		id: 'hungry-mouths',
		number: 9,
		name: 'Hungrige Münder',
		pos: parsePosition(
			`mu n n mr
			n n n n
			n n n+2 n
			ml n n md`,
		),
		goal: 64,
		mode: defaultMode,
		rules: ['default', 'mouths'],
	},
	{
		id: 'logarithmic',
		number: 10,
		name: 'Logarithmus',
		pos: parsePosition(
			`n n n n
			n n n n
			n n+1 n n
			n n n n`,
		),
		goal: 9,
		mode: logarithmicMode,
		rules: ['logarithmic'],
	},
	{
		id: 'fibonacchi',
		number: 11,
		name: 'Fibonacchi-Folge',
		pos: parsePosition(
			`n n n n
			n n n n
			n n+1 n n
			n n n n`,
		),
		goal: 233,
		mode: fibMode,
		rules: ['fibonacchi'],
	},
	{
		id: 'diagonal',
		number: 12,
		name: 'Diagonale',
		pos: parsePosition(
			`b n n n n n
			n b n n n n
			n n+1 b n n n
			n n n b n n
			n n n n b n
			n n n n n b`,
		),
		goal: 8,
		mode: logarithmicMode,
		rules: ['logarithmic', 'black-holes'],
	},
	{
		id: 'classic-2048',
		number: 13,
		name: 'Classic 2048',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n n+2
			n n n n`,
		),
		goal: 2048,
		mode: defaultMode,
		rules: ['default'],
	},
	{
		id: 'memory',
		number: 14,
		name: 'Memory',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n n+2
			n n n n`,
		),
		goal: 128,
		mode: { ...defaultMode, hidden: true },
		rules: ['default', 'hidden'],
	},
]

export function getNextLevel() {
	if (!appState.initialized) return

	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
