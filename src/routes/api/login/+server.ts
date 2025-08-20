import type { D1Database } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'

import { parse as parseCookies, serialize as serializeCookie } from 'cookie'
import { jwtVerify, type JWK, type JWTPayload } from 'jose'
import type { ActiveSession, User } from '../types.js'

interface GoogleJwks {
	keys: JWK[]
}

interface Payload extends JWTPayload {
	name: string
	given_name: string
	family_name: string
	picture: string
	email: string
	email_verified: boolean
}

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const body = await request.formData()
	await verifyCsrf(request, body)

	const jwt = body.get('credential')
	if (!jwt || typeof jwt === 'object') error(400, 'No credential in post body.')

	const payload = await verifyJwt(jwt)

	const user = await insertUser(platform.env.DB, payload)
	const sessionId = crypto.randomUUID()
	await createSession(platform.env.DB, sessionId, user.user_id)
	const setCookie = serializeCookie('SID', sessionId, {
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
	})

	return new Response('Sie werden weitergeleitet...', {
		status: 302,
		headers: {
			Location: '/account',
			'Set-Cookie': setCookie,
		},
	})
}

async function verifyCsrf(request: Request, body: FormData) {
	const cookies = request.headers.get('cookie')
	if (!cookies) error(400, 'missing cookie header')

	const csrfTokenCookie = parseCookies(cookies).g_csrf_token
	if (!csrfTokenCookie) error(400, 'No CSRF token in Cookie.')

	const csrfTokenBody = body.get('g_csrf_token')
	if (!csrfTokenBody) error(400, 'No CSRF token in post body.')

	if (csrfTokenCookie !== csrfTokenBody) error(400, 'Failed to verify double submit cookie.')
}

async function verifyJwt(jwt: string) {
	const jwk: GoogleJwks = await (await fetch('https://www.googleapis.com/oauth2/v3/certs')).json()

	try {
		const result = await jwtVerify<Payload>(jwt, jwk.keys[0], {
			issuer: 'https://accounts.google.com',
			audience: '13487924400-e61ocnpl0l07bb8udao0p2a0n2tg7bdk.apps.googleusercontent.com',
		})
		return result.payload
	} catch (err) {
		console.log(err)
		error(401, JSON.stringify(err))
	}
}

async function insertUser(
	db: D1Database,
	{ name, given_name, family_name, picture, email, sub }: Payload,
) {
	try {
		const user = await db
			.prepare(
				'INSERT OR REPLACE INTO users (name, given_name, family_name, picture, email, google_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *;',
			)
			.bind(name, given_name, family_name, picture, email, sub)
			.first()
		return user as unknown as User
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while updating the database')
	}
}

async function createSession(db: D1Database, sessionId: string, userId: number) {
	try {
		const session = await db
			.prepare('INSERT INTO active_sessions (session_id, user_id) VALUES (?, ?) RETURNING *;')
			.bind(sessionId, userId)
			.first()
		return (session as unknown as ActiveSession).session_id
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while creating a session')
	}
}
