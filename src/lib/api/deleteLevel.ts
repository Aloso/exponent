import type { D1Database } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'

export async function deleteLevel(
	levelId: number,
	authorId: number | undefined,
	db: D1Database,
): Promise<boolean> {
	if (authorId !== undefined) {
		const countResult = await db
			.prepare('SELECT COUNT(*) count FROM levels WHERE level_id = ? AND author_id = ?')
			.bind(levelId, authorId)
			.first()
		if (countResult === null) error(500, 'Getting number of levels to delete failed')
		if (countResult.count === 0)
			error(404, 'The level does not exist or you are not allowed to delete it')
	}

	const results = await db.batch([
		db.prepare('DELETE FROM level_votes WHERE level_id = ?').bind(levelId),
		db.prepare('DELETE FROM levels WHERE level_id = ?').bind(levelId),
	])

	if (results.some((r) => !r.success)) error(500, 'Failed to delete level')

	return results[1].meta.changes > 0
}
