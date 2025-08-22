import type { D1Database } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'

export async function checkReports(userId: number, db: D1Database) {
	try {
		const lastMonth = new Date()
		lastMonth.setDate(lastMonth.getDate() - 30)

		const result = await db
			.prepare('SELECT COUNT(*) count FROM user_reports WHERE user_id = ? AND created > ?;')
			.bind(userId, lastMonth.getTime())
			.first()
		return result!.reports as number
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while performing DB query')
	}
}

export async function updateReports(userId: number, reports: number, db: D1Database) {
	try {
		await db.prepare('UPDATE users SET reports = ? WHERE user_id = ?;').bind(reports, userId).run()
	} catch (err) {
		console.error(err)
		error(500, 'An error occurred while updating DB')
	}
}
