<script lang="ts">
	import type { LevelDto, SafeUser } from '$lib/api/types'
	import { onMount } from 'svelte'
	import Header from '../../components/Header.svelte'
	import LevelPreview from '../../components/LevelPreview.svelte'

	let user = $state<SafeUser>()
	let error = $state<string>()
	let levels = $state<LevelDto[]>()
	let loading = $state(true)

	onMount(async () => {
		const stored = localStorage.getItem('userAccount')
		if (stored) {
			user = JSON.parse(stored)
		}

		const response = await fetch('/api/levels')
		if (!response.ok) {
			error = 'Die Level konnten nicht abgerufen werden'
			loading = false
			return
		}
		const data = await response.json()
		levels = data.levels
		loading = false
	})
</script>

<svelte:head>
	<title>Marktplatz - Exponent</title>
</svelte:head>

<Header back>
	Marktplatz
	{#snippet action2()}
		<a class="header-action-button" href="/account" aria-label="Account">
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<path
					style="fill:#ffffff"
					d="M 15.808594,30.740234 C 7.5027651,36.075331 2,45.395076 2,56 c 0.2462239,5.860846 3.4898105,8 8,8 h 44 c 4.606263,0 7.661094,-2.992671 8,-8 C 62,45.395076 56.497235,36.075331 48.191406,30.740234 44.429376,35.928646 38.408783,38.999948 32,39 25.591217,38.999948 19.570624,35.928646 15.808594,30.740234 Z"
				/>
				<circle style="fill:#ffffff" cx="32" cy="19" r="14" />
			</svg>
		</a>
	{/snippet}
</Header>

<div class="content">
	{#if error}
		<p>{error}</p>
	{:else if loading}
		<p class="centered">Lädt...</p>
	{:else if levels}
		<div class="level-grid">
			{#each levels as level (level.level_id)}
				<LevelPreview {level} withAuthor />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.content {
		width: 90%;
		margin: 0 auto;
	}

	.centered {
		text-align: center;
	}

	.level-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>
