import type { Pos } from './position'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface MoveEvent {
	oldPos: Pos
	newPos: Pos
	direction: Direction
}

export interface ResultEvent {
	pos: Pos
	timestamp: number
}

export interface HistoryEvent {
	action: 'undo'
	oldPos: Pos
	newPos: Pos
}

export interface ClickEvent {
	action: 'click'
	x: number
	y: number
}

export type GameEvent = MoveEvent | ResultEvent | HistoryEvent | ClickEvent

export type GameMoveHandler = (event: MoveEvent) => MoveEvent | undefined

export type GameResultHandler = (event: ResultEvent) => ResultEvent | undefined

export type GameHistoryHandler = (event: HistoryEvent) => HistoryEvent | undefined

export type GameClickHandler = (event: ClickEvent) => ClickEvent | undefined

export type FieldEventHandler =
	| GameMoveHandler
	| GameResultHandler
	| GameHistoryHandler
	| GameClickHandler
