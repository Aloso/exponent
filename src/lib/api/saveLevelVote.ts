import type { D1Database } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'

export async function saveLevelVote(
	level_id: number,
	user_id: number,
	vote: number,
	db: D1Database,
) {
	const results = await db.batch([
		db
			.prepare(
				'INSERT OR REPLACE INTO level_votes (level_id, user_id, vote, created) VALUES (?, ?, ?, ?)',
			)
			.bind(level_id, user_id, vote, Date.now()),
		db
			.prepare(
				'UPDATE levels SET votes = (SELECT SUM(vote) FROM level_votes WHERE level_id = ?) WHERE level_id = ? RETURNING votes',
			)
			.bind(level_id, level_id),
	])
	if (results.some((r) => !r.success)) {
		error(500, 'Failed to update votes')
	}
	return (results[1].results[0] as { votes: number | null }).votes ?? 0
}
