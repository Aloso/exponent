<script module>
	declare const google: {
		accounts: {
			id: {
				initialize: (config: { client_id: string; callback?: (creds: Credentials) => void }) => void
				renderButton: (elem: HTMLElement, options: GsiButtonConfiguration) => void
			}
		}
	}

	interface Credentials {
		credential: string
		client_id: string
	}

	interface CredentialsContent {
		aud: string
		azp: string
		email: string
		exp: number
		family_name: string
		given_name: string
		iat: number
		iss: string
		jti: string
		name: string
		nbf: string
		picture: string
		sub: string
	}

	interface GsiButtonConfiguration {
		type: string
		theme?: string
		size?: string
		text?: string
		shape?: string
		logo_alignment?: string
		width?: number
		locale?: string
		click_listener?: () => void
	}

	interface AccountInfo {
		status: 'loggedIn' | 'remembered'
		exp?: number
		provider: 'google'
		name: string
		givenName: string
		email: string
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '../../components/Header.svelte'
	import { goto } from '$app/navigation'

	let accountInfo = $state<AccountInfo>()
	let error = $state<string>()

	onMount(async () => {
		const storedInfo = localStorage.getItem('account')
		if (storedInfo) {
			accountInfo = JSON.parse(storedInfo) as AccountInfo
			if (accountInfo.exp) {
				const exp = new Date(accountInfo.exp * 1000)
				if (+exp > Date.now()) {
					return
				} else {
					accountInfo = undefined
					localStorage.removeItem('account')
				}
			}
		}

		google.accounts.id.initialize({
			client_id: '13487924400-e61ocnpl0l07bb8udao0p2a0n2tg7bdk.apps.googleusercontent.com',
			callback({ credential }) {
				try {
					const info: CredentialsContent = JSON.parse(atob(credential.split('.')[1]))
					accountInfo = {
						status: 'remembered',
						exp: info.exp,
						provider: 'google',
						name: info.name,
						givenName: info.given_name,
						email: info.email,
					}
					localStorage.setItem('account', JSON.stringify(accountInfo))
					accountInfo.status = 'loggedIn'
				} catch {
					error = 'Bei der Anmeldung ist ein Fehler aufgetreten.'
				}

				// TODO: Authentication request to set cookie
			},
		})

		google.accounts.id.renderButton(document.getElementById('login-button')!, {
			type: 'standard',
			theme: 'outline',
			size: 'large',
			text: 'Mit Google anmelden',
			shape: 'pill',
		})
	})
</script>

{#if true}
	<script src="https://accounts.google.com/gsi/client" async defer></script>
{/if}

<Header back>
	Account
	{#snippet action2()}
		{#if accountInfo}
			<button
				class="logout-button"
				onclick={() => {
					localStorage.removeItem('account')
					accountInfo = undefined
					// TODO: Backend request to remove cookie
					goto('/')
				}}
			>
				Ausloggen
			</button>
		{/if}
	{/snippet}
</Header>

{#if error}
	<p>{error}</p>
{:else if accountInfo}
	<div class="content">
		<h2>Willkommen, {accountInfo.givenName}.</h2>
		<p>Mit deinem Account kannst du bald eigene Level erstellen und veröffentlichen.</p>
		<p>
			<a class="button level-builder-button" href="/level-builder">Zum Level-Builder</a>
		</p>
		<h3>Von dir veröffentlichte Level</h3>
		<p>Diese Funktion ist noch in Konstruktion 🚧</p>
	</div>
{:else}
	<div class="login-wrapper">
		<div id="login-button"></div>
	</div>
{/if}

<style lang="scss">
	.login-wrapper {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.content {
		width: 90%;
		margin: 0 auto;

		h2 {
			font-size: 1.25rem;
		}
		h3 {
			font-size: 1.15rem;
		}
	}

	.logout-button,
	.level-builder-button {
		background-color: #fff2;
		padding-block: 0.4rem;
		font-size: 0.9rem;
	}
</style>
