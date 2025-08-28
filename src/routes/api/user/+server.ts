import { authorize } from '$lib/api/authorize'
import { error, json } from '@sveltejs/kit'

export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) {
		error(401, 'Not authorized')
	}

	return json(user)
}
