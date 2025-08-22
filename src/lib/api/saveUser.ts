import type { D1Database } from '@cloudflare/workers-types'
import type { SafeUser } from './types'
import { error } from '@sveltejs/kit'

export async function saveUser(user: SafeUser, db: D1Database): Promise<void> {
	try {
		await db
			.prepare('UPDATE users SET display_name = ?, email = ?, notice = ? WHERE user_id = ?;')
			.bind(user.display_name, user.email, user.notice ?? null, user.user_id)
			.run()
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while saving the user')
	}
}
