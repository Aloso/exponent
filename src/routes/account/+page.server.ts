import { error } from '@sveltejs/kit'
import type { User } from '../api/types.js'
import { parse as parseCookies } from 'cookie'

export const prerender = false

export interface Data {
	user?: Omit<User, 'google_id'>
}

export async function load({ request, platform }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	const cookie = request.headers.get('cookie')
	if (!cookie) return {}

	const { SID } = parseCookies(cookie)
	if (!SID) return {}

	try {
		const user = await platform.env.DB.prepare(
			'SELECT u.* FROM active_sessions s JOIN users u ON s.user_id = u.user_id WHERE s.session_id = ?;',
		)
			.bind(SID)
			.first()
		if (!user) return {}

		return { user: user as unknown as User }
	} catch (err) {
		console.error(err)
		error(500, 'Failed to get user session')
	}
}
