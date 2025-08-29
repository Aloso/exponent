import { error } from '@sveltejs/kit'
import type { LevelDto, Author } from '../../lib/api/types.js'
import { getLevels } from '$lib/api/getLevels.js'
import { getInteger } from '$lib/api/parseParams.js'
import { getUser } from '$lib/api/getUser.js'

export const prerender = false

export interface Data {
	user: Author
	levels?: LevelDto[]
}

export async function load({ request, platform }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	const { searchParams } = new URL(request.url)

	const user_id = getInteger(searchParams, 'id')
	if (user_id === undefined) error(400, 'user_id fehlt')

	const user = await getUser(user_id, platform.env.DB)
	const levels =
		user !== undefined
			? await getLevels({ author_id: user.user_id, limit: 100 }, platform.env.DB)
			: undefined
	return { user, levels }
}
