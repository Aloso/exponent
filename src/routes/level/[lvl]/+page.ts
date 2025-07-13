import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { levels } from '$lib/levels'

export const load: PageLoad = ({ params }) => {
	const { lvl } = params
	const level = levels.find((l) => l.id === lvl)
	if (!level) {
		error(404, 'Not found')
	}
	return level
}
