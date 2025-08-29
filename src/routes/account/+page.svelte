<script lang="ts">
	import Header from '../../components/Header.svelte'
	import { goto } from '$app/navigation'
	import type { Data } from './+page.server'
	import { dev } from '$app/environment'
	import EditProfile from '../../components/EditProfile.svelte'
	import LevelPreview from '../../components/LevelPreview.svelte'
	import { onMount } from 'svelte'
	import AccountMenu from '../../components/AccountMenu.svelte'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()

	let user = $state(data.user)

	onMount(() => {
		if (user) {
			localStorage.setItem('userAccount', JSON.stringify(user))
		} else {
			localStorage.removeItem('userAccount')
		}
	})

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
			<AccountMenu
				onNameChange={() => (editingProfile = true)}
				onLogout={() => {
					localStorage.removeItem('userAccount')
					goto('/api/logout')
				}}
			/>
		{/if}
	{/snippet}
</Header>

<div class="content">
	{#if user}
		{#if editingProfile}
			<EditProfile bind:user onclose={() => (editingProfile = false)} />
		{:else}
			<p>Willkommen, <em>{user.display_name}</em>.</p>
		{/if}

		{#if user.notice}
			<div class="notice">
				{user.notice}
				<br />
				<br />
				<button class="button action-button" onclick={closeNotice}>Verstanden</button>
			</div>
		{/if}

		{#if !data.levels || data.levels.length === 0}
			<h2>Deine Level</h2>
			<p>Du hast noch keine Level veröffentlicht</p>
			<p>
				<a class="button action-button" href="/level-builder">Level erstellen</a>
			</p>
		{:else}
			<h2>
				Deine Level
				<a class="button action-button right" href="/level-builder">Level erstellen</a>
			</h2>
			<div class="level-grid">
				{#each data.levels as level}
					<LevelPreview {level} />
				{/each}
			</div>
		{/if}
	{:else}
		<h2 class="centered"><em>Möglichkeiten mit einem Account:</em></h2>
		<p class="centered">★ eigene Level erstellen ★</p>
		<p class="centered">★ Level bewerten und kommentieren ★</p>
		<p class="centered">★ anderen Spieler*innen folgen ★</p>
		<p class="centered">★ Fortschritt geräte-übergreifend speichern ★</p>

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
</div>

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

		&.right {
			float: right;
			margin-top: -0.25rem;
		}
	}

	.level-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.centered {
		text-align: center;
	}
</style>
