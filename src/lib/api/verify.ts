import { error } from '@sveltejs/kit'

export class Schema<T> {
	public constructor(public isValid: (value: unknown) => value is T) {}

	public also(constraint: (value: T) => boolean): Schema<T> {
		return new Schema((value): value is T => this.isValid(value) && constraint(value))
	}

	public optional(): Schema<T | undefined> {
		return new Schema((value) => value === undefined || this.isValid(value))
	}

	public nullable(): Schema<T | null> {
		return new Schema((value) => value === null || this.isValid(value))
	}

	public array(): Schema<T[]> {
		return new Schema((value) => Array.isArray(value) && value.every((it) => this.isValid(it)))
	}

	public verify(value: unknown): T {
		if (this.isValid(value)) return value as T
		else error(400, 'Invalid value')
	}
}

export const v = {
	number(): Schema<number> {
		return new Schema((value) => typeof value === 'number')
	},
	integer(): Schema<number> {
		return new Schema((v): v is number => typeof v === 'number' && v - (v % 1) === v)
	},
	string(): Schema<string> {
		return new Schema((value) => typeof value === 'string')
	},
	boolean(): Schema<boolean> {
		return new Schema((value) => typeof value === 'boolean')
	},
	object<O>(record: { [key in keyof O]: Schema<O[key]> }): Schema<O> {
		return new Schema((value): value is O => {
			if (value == null || !(typeof value === 'object')) return false
			for (const key in value) {
				if (!(key in record)) return false
				if (!record[key as keyof O].isValid((value as Record<string, unknown>)[key])) return false
			}
			return true
		})
	},
	union<A, B>(a: Schema<A>, b: Schema<B>): Schema<A | B> {
		return new Schema((value) => a.isValid(value) || b.isValid(value))
	},
	undefined(): Schema<undefined> {
		return new Schema((value) => value === undefined)
	},
	null(): Schema<null> {
		return new Schema((value) => value === null)
	},
}
