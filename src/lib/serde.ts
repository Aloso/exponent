import type { Level, LevelRule } from './levels'
import { defaultMode, fibMode, logarithmicMode } from './modes'
import { parsePosition } from './parse'
import type { Pos } from './position'
import type { Square } from './square'

export interface SerialLevel {
	name: string
	pos: string
	goal: Level['goal']
	mode: string
	hidden?: boolean
}

export function serializeB64(level: Level): string {
	const serial = serializeLevel(level)
	const json = JSON.stringify(serial)
	return btoa(json)
}

export function deserializeB64(level: string): Level {
	const json = atob(level)
	const serial = JSON.parse(json)
	console.log('deserialized:', serial)
	return deserializeLevel(serial, level)
}

function serializeLevel(level: Level): SerialLevel {
	return {
		name: level.name,
		goal: level.goal,
		mode: level.mode.id,
		hidden: level.mode.hidden || undefined,
		pos: serializePos(level.pos),
	}
}

function serializePos(pos: Pos): string {
	return pos.squares.map((row) => row.map(serializeSquare).join(' ')).join('|')
}

function serializeSquare(square: Square): string {
	let output: string
	switch (square.variant) {
		case 'normal':
			if (square.effects?.includes('black-hole')) {
				output = 'b'
			} else if (square.goal) {
				output = 'g' + square.goal
			} else {
				output = 'n'
			}
			break
		case 'empty':
			output = '-'
			break
		case 'wall':
			output = 'X'
			break
		case 'mouth':
			output = 'm' + (square.direction?.[0] ?? '')
			break
	}
	if (square.num) {
		output += '+' + square.num
	}
	return output
}

function deserializeRulesAndTargetFields(level: SerialLevel, pos: Pos): [LevelRule[], number] {
	const rules: LevelRule[] = []
	rules.push(level.mode as 'default' | 'logarithmic' | 'fibonacchi')
	if (level.hidden) rules.push('hidden')

	let hasEmpty = false
	let hasWalls = false
	let hasBlackHoles = false
	let hasMouths = false
	let targetFields = 0

	for (const row of pos.squares) {
		for (const square of row) {
			switch (square.variant) {
				case 'empty':
					hasEmpty = true
					break
				case 'normal':
					if (square.effects?.includes('black-hole')) {
						hasBlackHoles = true
					}
					if (square.goal) {
						targetFields++
					}
					break
				case 'wall':
					hasWalls = true
					break
				case 'mouth':
					hasMouths = true
			}
		}
	}

	if (hasEmpty) rules.push('empty')
	if (hasWalls) rules.push('walls')
	if (hasBlackHoles) rules.push('black-holes')
	if (hasMouths) rules.push('mouths')
	if (targetFields > 0) rules.push('target-fields')

	return [rules, targetFields]
}

function deserializeLevel(level: SerialLevel, encoded: string): Level {
	const mode =
		level.mode === 'default'
			? defaultMode
			: level.mode === 'logarithmic'
				? logarithmicMode
				: fibMode
	const pos = parsePosition(level.pos)
	const [rules, targetFields] = deserializeRulesAndTargetFields(level, pos)

	return {
		id: 'custom',
		encoded,
		name: level.name,
		pos: pos,
		goal: targetFields > 0 ? { fields: targetFields } : level.goal,
		mode: level.hidden ? { ...mode, hidden: true } : mode,
		rules: rules,
	}
}
