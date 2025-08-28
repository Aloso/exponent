import { error } from '@sveltejs/kit'

export function getInteger(
	params: URLSearchParams,
	name: string,
	options?: { min?: number; max?: number },
): number | undefined {
	const value = params.get(name)
	if (value === null) return

	const num = Number(value)
	if (Number.isNaN(num)) return
	const rounded = Math.round(num)

	if (rounded !== num) error(400, `expected integer, got decimal number ${num}`)

	if (options?.min !== undefined && rounded < options.min)
		error(400, `'${name}' is ${rounded}, but must be at least ${options.min}`)
	if (options?.max !== undefined && rounded > options.max)
		error(400, `'${name}' is ${rounded}, but must be at most ${options.max}`)

	return rounded
}
