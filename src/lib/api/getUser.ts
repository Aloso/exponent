import type { D1Database } from '@cloudflare/workers-types'
import type { Author, User } from './types'
import { error } from '@sveltejs/kit'

export async function getUser(userId: number, db: D1Database): Promise<Author> {
	const user = (await db
		.prepare('SELECT * FROM users WHERE user_id = ?')
		.bind(userId)
		.first()) as User | null
	if (user === null) error(404, 'Person nicht gefunden')

	return {
		user_id: user.user_id,
		display_name: user.display_name,
		picture: user.picture ?? undefined,
		trust_level: user.trust_level,
	}
}
