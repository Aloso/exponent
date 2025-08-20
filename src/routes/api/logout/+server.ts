import type { D1Database } from '@cloudflare/workers-types'
import { error, redirect } from '@sveltejs/kit'

import { parse as parseCookies, serialize as serializeCookie } from 'cookie'

export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const cookie = request.headers.get('cookie')
	if (!cookie) redirect(302, '/account')

	const { SID } = parseCookies(cookie)
	if (!SID) redirect(302, '/account')

	await deleteSession(platform.env.DB, SID)
	const setCookie = serializeCookie('SID', '', {
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
		expires: new Date(),
	})

	return new Response('Sie werden weitergeleitet...', {
		status: 302,
		headers: {
			Location: '/account',
			'Set-Cookie': setCookie,
		},
	})
}

async function deleteSession(db: D1Database, sessionId: string) {
	try {
		await db.prepare('DELETE FROM active_sessions WHERE session_id = ?;').bind(sessionId).run()
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while creating a session')
	}
}
