import type { D1Database } from '@cloudflare/workers-types'
import type { LevelInputDto } from './types'
import { error } from '@sveltejs/kit'

export async function saveLevel(
	level: LevelInputDto,
	author_id: number,
	db: D1Database,
): Promise<void> {
	const { success } = await db
		.prepare(
			`INSERT INTO levels (name, desc, author_id, created, difficulty, data) VALUES (?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			level.name,
			level.desc ?? null,
			author_id,
			Date.now(),
			level.difficulty ?? null,
			level.data,
		)
		.run()

	if (!success) {
		error(500, 'Failed to insert level')
	}
}
