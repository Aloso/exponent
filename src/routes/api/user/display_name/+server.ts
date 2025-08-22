import { authorize } from '$lib/api/authorize'
import { saveUser } from '$lib/api/saveUser.js'
import { error } from '@sveltejs/kit'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const user = await authorize(request, platform.env.DB)
	if (!user) error(400, 'Not logged in or authorized')

	const { searchParams } = new URL(request.url)
	user.display_name = searchParams.get('name') ?? user.display_name

	saveUser(user, platform.env.DB)

	return new Response()
}
