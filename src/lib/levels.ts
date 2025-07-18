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
	{
		id: 'black-hole',
		number: 5,
		name: 'Schwarzes Loch',
		pos: update(emptyPos, (pos) => {
			pos.squares[2][1].effects = ['black-hole']
			pos.squares[2][2].num = 2
		}),
		goal: 256,
	},
	{
		id: 'colorful-mix',
		number: 6,
		name: 'Bunte Mischung',
		pos: update(emptyPos4x5, (pos) => {
			pos.squares[1][1].effects = ['black-hole']
			pos.squares[2][2].variant = 'wall'
			pos.squares[3][3].variant = 'wall'
			pos.squares[4][2].variant = 'empty'
			pos.squares[4][0].num = 2
		}),
		goal: 256,
	},
	{
		id: 'target-areas',
		number: 7,
		name: 'Zielfelder',
		pos: update(emptyPos4x5, (pos) => {
			pos.squares[0][0].variant = 'empty'
			pos.squares[0][1].variant = 'empty'
			pos.squares[4][2].variant = 'empty'
			pos.squares[4][3].variant = 'empty'

			pos.squares[0][2].goal = 64
			pos.squares[4][1].goal = 64
			pos.squares[3][2].num = 2
		}),
		goal: { fields: 2 },
	},
	{
		id: 'remote-target',
		number: 8,
		name: 'Entlegener Ort',
		pos: update(emptyPos4x5, (pos) => {
			pos.squares[1][0].variant = 'empty'
			pos.squares[1][1].variant = 'wall'
			pos.squares[3][2].variant = 'wall'
			pos.squares[3][3].variant = 'empty'
			pos.squares[4][3].goal = 256

			pos.squares[2][2].num = 2
		}),
		goal: { fields: 1 },
	},
	{
		id: 'hungry-mouths',
		number: 9,
		name: 'Hungrige Münder',
		pos: update(emptyPos, (pos) => {
			pos.squares[0][0].variant = 'mouth'
			pos.squares[3][0].variant = 'mouth'
			pos.squares[3][3].variant = 'mouth'
			pos.squares[0][3].variant = 'mouth'
			pos.squares[0][0].direction = 'up'
			pos.squares[3][0].direction = 'left'
			pos.squares[3][3].direction = 'down'
			pos.squares[0][3].direction = 'right'

			pos.squares[2][2].num = 2
		}),
		goal: 64,
	},
]

export function getNextLevel() {
	if (!appState.initialized) return

	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
