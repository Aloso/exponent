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
		[{}, {}, {}, {}],
		[{}, {}, {}, {}],
		[{}, {}, {}, {}],
		[{}, {}, {}, {}],
	],
	state: 'playing',
}

export function update(pos: Pos, callback: (newPos: Pos) => void): Pos {
	const updated: Pos = {
		squares: pos.squares.map((row) => row.map((s) => ({ ...s }))),
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
			pos.squares[1][2].num = 2
		}),
		goal: 128,
	},
	{
		id: 'classic-256',
		name: '02: Classic',
		pos: update(emptyPos, (pos) => {
			pos.squares[1][2].num = 2
		}),
		goal: 256,
	},
]

export function getNextLevel() {
	const completed = new Set(appState.completedLevels.map((l) => l.id))
	return levels.find((l) => !completed.has(l.id))
}
