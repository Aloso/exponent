import { authorize } from '$lib/api/authorize'
import { reportDtoSchema } from '$lib/api/types'
import { error, json } from '@sveltejs/kit'
import { saveReport } from '$lib/api/saveReport'
import { getInteger } from '$lib/api/parseParams'
import { getReport } from '$lib/api/getReport.js'

export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) error(401, 'Not authorized')

	const { searchParams } = new URL(request.url)

	const user_id = getInteger(searchParams, 'user_id')
	const level_id = getInteger(searchParams, 'level_id')
	if (user_id === undefined) error(500, 'Missing user_id param')

	const report = await getReport(user_id, level_id, user.user_id, platform.env.DB)

	return json(report)
}

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) error(401, 'Not authorized')

	const data = await request.json()
	const reportDto = reportDtoSchema().verify(data)

	const success = await saveReport(reportDto, user.user_id, platform.env.DB)

	return json({ success }, { status: 201 })
}
