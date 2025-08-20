export interface User {
	user_id: number
	name: string
	given_name?: string
	family_name?: string
	picture?: string
	email: string
	google_id: string
}

export interface ActiveSession {
	session_id: string
	user_id: number
}
