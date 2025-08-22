<script lang="ts">
	import Header from '../../components/Header.svelte'
	import { goto } from '$app/navigation'
	import type { Data } from './+page.server'
	import { dev } from '$app/environment'
	import EditProfile from '../../components/EditProfile.svelte'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()

	let user = $state(data.user)

	async function closeNotice() {
		await fetch('/api/user/notice', { method: 'POST' })
		if (user) user.notice = undefined
	}

	let editingProfile = $state(false)
</script>

{#if true}
	<script src="https://accounts.google.com/gsi/client"></script>
{/if}

<Header back>
	Account
	{#snippet action2()}
		{#if data.user}
			<button
				class="button action-button"
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

{#if user}
	<div class="content">
		<h2>Willkommen, {user.display_name}.</h2>
		<p>Mit deinem Account kannst du bald eigene Level erstellen und veröffentlichen.</p>
		{#if user.notice}
			<div class="notice">
				{user.notice}
				<br />
				<br />
				<button class="button action-button" onclick={closeNotice}>Verstanden</button>
			</div>
		{/if}
		<p>
			<button class="button action-button" onclick={() => (editingProfile = true)}>
				Profil bearbeiten
			</button>
			{#if !editingProfile}
				<a class="button action-button" href="/account/code-of-conduct">Verhaltens-Richtlinien</a>
			{/if}
		</p>

		{#if editingProfile}
			<EditProfile bind:user onclose={() => (editingProfile = false)} />
		{/if}

		<h3>Von dir veröffentlichte Level</h3>
		<p>Diese Funktion ist noch in Konstruktion 🚧</p>
		<p>
			<a class="button action-button" href="/level-builder">Level erstellen</a>
		</p>
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

	.notice {
		background-color: #ffcb2d70;
		border-radius: 0.5rem;
		padding: 1rem;
		font-size: 0.95em;
	}

	.action-button {
		background-color: #fff2;
		padding-block: 0.4rem;
		font-size: 0.9rem;
	}
</style>
