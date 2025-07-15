import type { Component } from 'svelte'
import Tutorial1 from '../levels/Tutorial1.svelte'
import { appState } from './appState.svelte'
import type { Pos } from './position'
import type Field from '../components/Field.svelte'

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
	goal?: number
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
}

export function update(pos: Pos, callback: (newPos: Pos) => void): Pos {
	const updated: Pos = {
		squares: pos.squares.map((row) => row.map((sq) => ({ ...sq }))),
		state: pos.state,
	}
	callback(updated)
	return updated
}

export const levels: Level[] = [
	{
		id: 'tutorial-01',
		name: 'Tutorial',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][2].num = 2
		}),
		overlay: Tutorial1,
	},
	{
		id: 'classic-128',
		number: 1,
		name: 'Classic',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][2].num = 2
		}),
		goal: 128,
	},
	{
		id: 'classic-256',
		number: 2,
		name: 'Classic',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][2].num = 2
		}),
		goal: 256,
	},
	{
		id: 'walls-128',
		number: 3,
		name: 'Blockaden',
		pos: update(emptyPos, (pos) => {
			pos.squares[0][0].variant = 'wall'
			pos.squares[1][2].variant = 'wall'
			pos.squares[2][2].num = 2
		}),
		goal: 128,
	},
	{
		id: 'empty-256',
		number: 4,
		name: 'Die Leere',
		pos: update(emptyPos, (pos) => {
			pos.squares[3][0].variant = 'empty'
			pos.squares[3][3].variant = 'empty'
			pos.squares[0][1].variant = 'empty'
			pos.squares[2][2].num = 2
		}),
		goal: 256,
	},
]

export function getNextLevel() {
	if (!appState.initialized) return

	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
