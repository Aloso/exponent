import type { D1Database } from '@cloudflare/workers-types'
import { error } from '@sveltejs/kit'
import type { ReportDto } from './types'

export async function getReport(
	user_id: number,
	level_id: number | undefined,
	reporter_id: number,
	db: D1Database,
): Promise<ReportDto> {
	const result = await db
		.prepare(`SELECT * FROM user_reports WHERE user_id = ? AND reporter_id = ? AND level_id = ?`)
		.bind(user_id, reporter_id, level_id ?? null)
		.first()

	if (result === null) error(404, 'Report not found')

	return dbResultToDto(result)
}

function dbResultToDto(l: Record<string, unknown>): ReportDto {
	return {
		user_id: l.user_id as number,
		level_id: (l.level_id as number | null) ?? undefined,
		reason: l.reason as string,
	}
}
