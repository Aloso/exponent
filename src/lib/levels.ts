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
}

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
			n n +2 n
			n n n n`,
		),
		overlay: Tutorial1,
		mode: defaultMode,
	},
	{
		id: 'classic-128',
		number: 1,
		name: 'Classic',
		pos: parsePosition(
			`n n n n
			n n n n
			n n +2 n
			n n n n`,
		),
		goal: 128,
		mode: defaultMode,
	},
	{
		id: 'classic-256',
		number: 2,
		name: 'Classic',
		pos: parsePosition(
			`n n n n
			n n n n
			n n +2 n
			n n n n`,
		),
		goal: 256,
		mode: defaultMode,
	},
	{
		id: 'walls-128',
		number: 3,
		name: 'Blockaden',
		pos: parsePosition(
			`X n n n
			n n X n
			n n +2 n
			n n n n`,
		),
		goal: 128,
		mode: defaultMode,
	},
	{
		id: 'empty-256',
		number: 4,
		name: 'Die Leere',
		pos: parsePosition(
			`n - n n
			n n n n
			n n +2 n
			- n n -`,
		),
		goal: 256,
		mode: defaultMode,
	},
	{
		id: 'black-hole',
		number: 5,
		name: 'Schwarzes Loch',
		pos: parsePosition(
			`n n n n
			n n n n
			n b +2 n
			n n n n`,
		),
		goal: 256,
		mode: defaultMode,
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
			+2 n - n`,
		),
		goal: 256,
		mode: defaultMode,
	},
	{
		id: 'target-areas',
		number: 7,
		name: 'Zielfelder',
		pos: parsePosition(
			`- - g64 n
			n n n n
			n n n n
			n n +2 n
			n g64 - -`,
		),
		goal: { fields: 2 },
		mode: defaultMode,
	},
	{
		id: 'remote-target',
		number: 8,
		name: 'Entlegener Ort',
		pos: parsePosition(
			`n n n n
			- X n n
			n n +2 n
			n n X -
			n n n g256`,
		),
		goal: { fields: 1 },
		mode: defaultMode,
	},
	{
		id: 'hungry-mouths',
		number: 9,
		name: 'Hungrige Münder',
		pos: parsePosition(
			`mu n n mr
			n n n n
			n n +2 n
			ml n n md`,
		),
		goal: 64,
		mode: defaultMode,
	},
	{
		id: 'logarithmic',
		number: 10,
		name: 'Logarithmus',
		pos: parsePosition(
			`n n n n
			n n n n
			n +1 n n
			n n n n`,
		),
		goal: 9,
		mode: logarithmicMode,
	},
	{
		id: 'fibonacchi',
		number: 11,
		name: 'Fibonacchi-Folge',
		pos: parsePosition(
			`n n n n
			n n n n
			n +1 n n
			n n n n`,
		),
		goal: 233,
		mode: fibMode,
	},
	{
		id: 'diagonal',
		number: 12,
		name: 'Diagonale',
		pos: parsePosition(
			`b n n n n n
			n b n n n n
			n +1 b n n n
			n n n b n n
			n n n n b n
			n n n n n b`,
		),
		goal: 8,
		mode: logarithmicMode,
	},
	{
		id: 'classic-2048',
		number: 13,
		name: 'Classic 2048',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n +2
			n n n n`,
		),
		goal: 2048,
		mode: defaultMode,
	},
	{
		id: 'memory',
		number: 14,
		name: 'Memory',
		pos: parsePosition(
			`n n n n
			n n n n
			n n n +2
			n n n n`,
		),
		goal: 128,
		mode: { ...defaultMode, hidden: true },
	},
]

export function getNextLevel() {
	if (!appState.initialized) return

	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
