import { authorize } from '$lib/api/authorize'
import { error, json } from '@sveltejs/kit'
import { getInteger } from '$lib/api/parseParams.js'
import { saveLevelVote } from '$lib/api/saveLevelVote.js'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) {
		error(401, 'Not authorized')
	}

	const { searchParams } = new URL(request.url)

	const level_id = getInteger(searchParams, 'level_id')
	const vote = getInteger(searchParams, 'vote', { min: -1, max: 1 })

	if (level_id === undefined) error(400, 'Missing level_id')
	if (vote === undefined) error(400, 'Missing vote')

	const votes = await saveLevelVote(level_id, user.user_id, vote, platform.env.DB)

	return json({ votes })
}
