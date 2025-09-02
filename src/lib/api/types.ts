import { v, type Schema } from './verify'

export interface User {
	user_id: number
	display_name: string
	name: string
	family_name?: string
	picture?: string
	email: string
	google_id: string
	reported: number
	notice?: string
	trust_level: number
}

export type SafeUser = Omit<User, 'google_id' | 'reported'>

export interface ActiveSession {
	session_id: string
	user_id: number
}

export interface LevelDto {
	level_id: number
	name: string
	desc?: string
	author: Author
	created: number
	votes: number
	my_vote?: number
	difficulty?: number
	data: string
}

export interface LevelInputDto {
	name: string
	desc?: string
	difficulty?: number
	data: string
}

export interface LevelUpdateDto {
	level_id: number
	name?: string
	desc?: string
	difficulty?: number
}

export interface ReportDto {
	user_id: number
	level_id?: number
	reason: string
}

export interface Author {
	user_id: number
	display_name: string
	picture?: string
	trust_level: number
}

export function levelInputDtoSchema(): Schema<LevelInputDto> {
	return v.object({
		name: v.string(),
		desc: v.string().optional(),
		difficulty: v.integer().optional(),
		data: v.string(),
	})
}

export function levelUpdateDtoSchema(): Schema<LevelUpdateDto> {
	return v.object({
		level_id: v.integer(),
		name: v.string().optional(),
		desc: v.string().optional(),
		difficulty: v.integer().optional(),
	})
}

export function reportDtoSchema(): Schema<ReportDto> {
	return v.object({
		user_id: v.integer(),
		level_id: v.integer().optional(),
		reason: v.string(),
	})
}
