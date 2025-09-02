import type { D1Database } from '@cloudflare/workers-types'
import type { LevelUpdateDto } from './types'
import { error } from '@sveltejs/kit'

export async function updateLevel(
	level: LevelUpdateDto,
	authorId: number | undefined,
	db: D1Database,
): Promise<void> {
	if (authorId !== undefined) {
		const countResult = await db
			.prepare('SELECT COUNT(*) count FROM levels WHERE level_id = ? AND author_id = ?')
			.bind(level.level_id, authorId)
			.first()
		if (countResult === null) error(500, 'Getting number of levels to edit failed')
		if (countResult.count === 0)
			error(404, 'The level does not exist or you are not allowed to edit it')
	}

	const updates: string[] = []
	const bindings: unknown[] = []

	if (level.name !== undefined) {
		updates.push(`name = ?`)
		bindings.push(level.name)
	}
	if (level.desc !== undefined) {
		updates.push(`desc = ?`)
		bindings.push(level.desc)
	}
	if (level.difficulty !== undefined) {
		updates.push(`difficulty = ?`)
		bindings.push(level.difficulty)
	}

	const { success } = await db
		.prepare(`UPDATE levels SET ${updates.join(', ')} WHERE level_id = ?`)
		.bind(...bindings, level.level_id)
		.run()

	if (!success) {
		error(500, 'Failed to update level')
	}
}
