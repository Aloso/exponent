import type { D1Database } from '@cloudflare/workers-types'
import type { LevelDto } from './types'
import { error } from '@sveltejs/kit'

export interface LevelFilters {
	author_id?: number
	max_difficulty?: number
	min_difficulty?: number
	created_before?: number
	created_after?: number
	limit: number
	after_id?: number
	asc?: boolean
}

export async function getLevel(id: number, db: D1Database): Promise<LevelDto> {
	const query = `SELECT l.*, u.display_name user_name, u.user_id, u.picture user_picturer, u.trust_level user_trust_level, lv.vote my_vote
		FROM levels l JOIN users u ON l.author_id = u.user_id LEFT JOIN level_votes lv ON lv.level_id = l.level_id WHERE l.level_id = ?`

	const level = await db.prepare(query).bind(id).first()
	if (!level) {
		error(404, 'Level nicht gefunden')
	}

	console.log(level)

	return dbResultToDto(level)
}

export async function getLevels(filters: LevelFilters, db: D1Database): Promise<LevelDto[]> {
	const bindings: any[] = []
	const whereClauses: string[] = []
	if (filters.author_id !== undefined) {
		whereClauses.push(`l.author_id = ?`)
		bindings.push(filters.author_id)
	}
	if (filters.min_difficulty !== undefined) {
		whereClauses.push(`l.difficulty >= ?`)
		bindings.push(filters.min_difficulty)
	}
	if (filters.max_difficulty !== undefined) {
		whereClauses.push(`l.difficulty <= ?`)
		bindings.push(filters.max_difficulty)
	}
	if (filters.after_id !== undefined) {
		whereClauses.push(`l.level_id > ?`)
		bindings.push(filters.after_id)
	}
	if (filters.created_before !== undefined) {
		whereClauses.push(`l.created <= ?`)
		bindings.push(filters.created_before)
	}
	if (filters.created_after !== undefined) {
		whereClauses.push(`l.created >= ?`)
		bindings.push(filters.created_after)
	}
	const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

	const query = `SELECT l.*, u.display_name user_name, u.user_id, u.picture user_picturer, u.trust_level user_trust_level, lv.vote my_vote
		FROM levels l JOIN users u ON l.author_id = u.user_id LEFT JOIN level_votes lv ON lv.level_id = l.level_id ${where}
		ORDER BY l.created ${filters.asc ? 'ASC' : 'DESC'}
		LIMIT ${filters.limit}`

	const levels = await db
		.prepare(query)
		.bind(...bindings)
		.all()

	return levels.results.map(dbResultToDto)
}

function dbResultToDto(l: Record<string, unknown>): LevelDto {
	return {
		level_id: l.level_id as number,
		name: l.name as string,
		desc: l.desc as string | undefined,
		author: {
			user_id: l.user_id as number,
			display_name: l.user_name as string,
			picture: l.user_picture as string | undefined,
			trust_level: l.user_trust_level as number,
		},
		created: l.created as number,
		votes: l.votes as number,
		my_vote: l.my_vote as number,
		difficulty: l.difficulty as number,
		data: l.data as string,
	}
}
