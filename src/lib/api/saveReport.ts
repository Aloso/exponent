import type { D1Database } from '@cloudflare/workers-types'
import type { ReportDto } from './types'
import { error } from '@sveltejs/kit'

export async function saveReport(
	report: ReportDto,
	reporter_id: number,
	db: D1Database,
): Promise<boolean> {
	const lastMonth = new Date()
	lastMonth.setDate(lastMonth.getDate() - 30)

	const result = await db.batch([
		db
			.prepare(
				`INSERT OR REPLACE INTO user_reports (user_id, reporter_id, created, level_id, reason)
                VALUES (?, ?, ?, ?, ?)`,
			)
			.bind(report.user_id, reporter_id, Date.now(), report.level_id ?? null, report.reason),
		db
			.prepare(
				`UPDATE users SET reported = r.count
                FROM (SELECT COUNT(*) count FROM user_reports WHERE user_id = ? AND created > ?) AS r
                WHERE user_id = ? AND reported < 100`,
			)
			.bind(report.user_id, lastMonth.getTime(), report.user_id),
	])
	if (result.some((r) => !r.success)) error(500, 'Failed to save user report')

	return result[0].meta.changes > 0
}
