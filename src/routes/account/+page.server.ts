import { error } from '@sveltejs/kit'
import type { LevelDto, SafeUser } from '../../lib/api/types.js'
import { authorize } from '$lib/api/authorize.js'
import { getLevels } from '$lib/api/getLevels.js'

export const prerender = false

export interface Data {
	user?: SafeUser
	levels?: LevelDto[]
}

export async function load({ request, platform }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	const levels =
		user !== undefined
			? await getLevels({ author_id: user.user_id, limit: 100 }, platform.env.DB)
			: undefined
	return { user, levels }
}
