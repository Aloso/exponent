<script lang="ts">
	import Header from '../../components/Header.svelte'
	import { goto } from '$app/navigation'
	import type { Data } from './+page.server'
	import { dev } from '$app/environment'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
</script>

{#if true}
	<script src="https://accounts.google.com/gsi/client"></script>
{/if}

<Header back>
	Account
	{#snippet action2()}
		{#if data.user}
			<button
				class="logout-button"
				onclick={() => {
					localStorage.removeItem('account')
					goto('/api/logout')
				}}
			>
				Ausloggen
			</button>
		{/if}
	{/snippet}
</Header>

{#if data.user}
	<div class="content">
		<h2>Willkommen, {data.user.given_name}.</h2>
		<p>Mit deinem Account kannst du bald eigene Level erstellen und veröffentlichen.</p>
		<p>
			<a class="button level-builder-button" href="/level-builder">Zum Level-Builder</a>
		</p>
		<h3>Von dir veröffentlichte Level</h3>
		<p>Diese Funktion ist noch in Konstruktion 🚧</p>
	</div>
{:else}
	<div class="login-wrapper">
		<div
			id="g_id_onload"
			data-client_id="13487924400-e61ocnpl0l07bb8udao0p2a0n2tg7bdk.apps.googleusercontent.com"
			data-login_uri={dev
				? 'http://localhost:5173/api/login'
				: 'https://exponent.aloso.foo/api/login'}
			data-auto_prompt="false"
		></div>
		<div
			class="g_id_signin"
			data-type="standard"
			data-size="large"
			data-theme="outline"
			data-text="sign_in_with"
			data-shape="pill"
		></div>
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
