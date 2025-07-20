import type { Component } from 'svelte'
import Tutorial1 from '../levels/Tutorial1.svelte'
import { appState } from './appState.svelte'
import type { Pos } from './position'
import type Field from '../components/Field.svelte'
import { parsePosition } from './parse'

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
}

export const emptyPos: Pos = {
	squares: [
		[
			{ variant: 'normal', id: 0 },
			{ variant: 'normal', id: 1 },
			{ variant: 'normal', id: 2 },
			{ variant: 'normal', id: 3 },
		],
		[
			{ variant: 'normal', id: 4 },
			{ variant: 'normal', id: 5 },
			{ variant: 'normal', id: 6 },
			{ variant: 'normal', id: 7 },
		],
		[
			{ variant: 'normal', id: 8 },
			{ variant: 'normal', id: 9 },
			{ variant: 'normal', id: 10 },
			{ variant: 'normal', id: 11 },
		],
		[
			{ variant: 'normal', id: 12 },
			{ variant: 'normal', id: 13 },
			{ variant: 'normal', id: 14 },
			{ variant: 'normal', id: 15 },
		],
	],
	state: 'playing',
	moveCount: 0,
}

export const emptyPos4x5: Pos = {
	squares: [
		[
			{ variant: 'normal', id: 0 },
			{ variant: 'normal', id: 1 },
			{ variant: 'normal', id: 2 },
			{ variant: 'normal', id: 3 },
		],
		[
			{ variant: 'normal', id: 4 },
			{ variant: 'normal', id: 5 },
			{ variant: 'normal', id: 6 },
			{ variant: 'normal', id: 7 },
		],
		[
			{ variant: 'normal', id: 8 },
			{ variant: 'normal', id: 9 },
			{ variant: 'normal', id: 10 },
			{ variant: 'normal', id: 11 },
		],
		[
			{ variant: 'normal', id: 12 },
			{ variant: 'normal', id: 13 },
			{ variant: 'normal', id: 14 },
			{ variant: 'normal', id: 15 },
		],
		[
			{ variant: 'normal', id: 16 },
			{ variant: 'normal', id: 17 },
			{ variant: 'normal', id: 18 },
			{ variant: 'normal', id: 19 },
		],
	],
	state: 'playing',
	moveCount: 0,
}

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
	},
]

export function getNextLevel() {
	if (!appState.initialized) return

	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
