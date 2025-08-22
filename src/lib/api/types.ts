export interface User {
	user_id: number
	display_name: string
	name: string
	family_name?: string
	picture?: string
	email: string
	google_id: string
	reported: number
	notice?: string
}

export type SafeUser = Omit<User, 'google_id' | 'reported'>

export interface ActiveSession {
	session_id: string
	user_id: number
}
