import { authorize } from '$lib/api/authorize.js'
import { getLevel, getLevels, type LevelFilters } from '$lib/api/getLevels'
import { getInteger } from '$lib/api/parseParams.js'
import { saveLevel } from '$lib/api/saveLevel.js'
import { levelInputDtoSchema, type LevelDto } from '$lib/api/types.js'
import { error, json } from '@sveltejs/kit'

export interface LevelsResult {
	levels: LevelDto[]
	hasMore: boolean
}

export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const { searchParams } = new URL(request.url)

	const level_id = getInteger(searchParams, 'level_id')
	if (level_id !== undefined) {
		const level = await getLevel(level_id, platform.env.DB)
		return json(level)
	}

	const filters: LevelFilters = {
		limit: (getInteger(searchParams, 'limit', { min: 0, max: 200 }) ?? 50) + 1,
		after_id: getInteger(searchParams, 'after_id'),
		author_id: getInteger(searchParams, 'author_id'),
		min_difficulty: getInteger(searchParams, 'min_difficulty'),
		max_difficulty: getInteger(searchParams, 'max_difficulty'),
		created_before: getInteger(searchParams, 'created_before'),
		created_after: getInteger(searchParams, 'created_after'),
	}

	const levels = await getLevels(filters, platform.env.DB)
	const hasMore = levels.length === filters.limit + 1
	if (hasMore) levels.pop()

	return Response.json({ levels, hasMore } satisfies LevelsResult)
}

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) {
		error(401, 'Not authorized')
	}

	// rate limiting
	const dayBefore = new Date()
	dayBefore.setHours(dayBefore.getHours() - 24)
	const levelsSubmittedRecently = await getLevels(
		{ author_id: user.user_id, created_after: dayBefore.getTime(), limit: 5 },
		platform.env.DB,
	)
	if (levelsSubmittedRecently.length >= 5) {
		error(429, 'You can only submit 5 levels in 24 hours')
	}

	const data = await request.json()
	const levelDto = levelInputDtoSchema().verify(data)

	await saveLevel(levelDto, user.user_id, platform.env.DB)

	return new Response(null, { status: 201 })
}
