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
	name: string
	pos: Pos
	overlay?: Component<LevelOverlayProps>
	goal?: number
}

export const emptyPos: Pos = {
	squares: [
		[
			{ variant: 'wall', id: 0 },
			{ variant: 'normal', id: 1 },
			{ variant: 'normal', id: 2 },
			{ variant: 'normal', id: 3 },
		],
		[
			{ variant: 'normal', id: 4 },
			{ variant: 'normal', id: 5 },
			{ variant: 'wall', id: 6 },
			{ variant: 'empty', id: 7 },
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
		name: '01: Classic',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][2].num = 2
		}),
		goal: 128,
	},
	{
		id: 'classic-256',
		name: '02: Classic',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][2].num = 2
		}),
		goal: 256,
	},
]

export function getNextLevel() {
	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
