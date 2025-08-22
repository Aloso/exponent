import type { D1Database } from '@cloudflare/workers-types'
import type { SafeUser, User } from './types'
import { parse as parseCookies } from 'cookie'
import { error, redirect } from '@sveltejs/kit'
import { checkReports, updateReports } from './checkReports'

interface AuthOptions {
	ignoreReports?: boolean
	complete?: boolean
}

export async function authorize(
	request: Request,
	db: D1Database,
	options?: AuthOptions,
): Promise<SafeUser | undefined> {
	const cookie = request.headers.get('cookie')
	if (!cookie) return

	const { SID } = parseCookies(cookie)
	if (!SID) return

	const sessionUser = await getSession(db, SID)

	if (sessionUser) {
		if (!options?.ignoreReports) {
			if (sessionUser.reported >= 3) {
				if (sessionUser.reported >= 100) {
					// permanent ban
					redirect(302, '/account/reported')
				}

				const actualReports = await checkReports(sessionUser.user_id, db)
				if (actualReports >= 3) {
					redirect(302, '/account/reported')
				} else {
					await updateReports(sessionUser.user_id, actualReports, db)
					sessionUser.reported = actualReports
				}
			}
		}
		if (!options?.complete) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { google_id, reported, ...user } = sessionUser
			return user
		}
	}

	return sessionUser
}

async function getSession(db: D1Database, sessionId: string) {
	try {
		const user = await db
			.prepare(
				'SELECT u.* FROM active_sessions s JOIN users u ON u.user_id = s.user_id WHERE s.session_id = ?;',
			)
			.bind(sessionId)
			.first()
		return (user as unknown as User | null) ?? undefined
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while deleting a session')
	}
}
