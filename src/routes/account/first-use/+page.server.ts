import { error } from '@sveltejs/kit'
import type { SafeUser } from '../../../lib/api/types.js'
import { authorize } from '$lib/api/authorize.js'

export const prerender = false

export interface Data {
	user?: SafeUser
}

export async function load({ request, platform }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	return { user }
}
