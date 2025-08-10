<script lang="ts">
	import { goto } from '$app/navigation'
	import { allowUndo } from '$lib/canUndo'
	import { useSpaInstallation } from '$lib/useSpaInstallation.svelte'
	import { onMount } from 'svelte'
	import Header from '../components/Header.svelte'
	import MusicButton from '../components/MusicButton.svelte'
	import { shouldUpdate } from '$lib/startTime'
	import { areAllLevelsCompleted, isTutorialCompleted } from '$lib/appState.svelte'

	let installation = useSpaInstallation()
	let shouldReload = $state(false)
	let showLevelBuilder = $derived(areAllLevelsCompleted())
	let showExtras = $derived(isTutorialCompleted())

	onMount(async () => {
		if (!shouldReload) {
			shouldReload = await shouldUpdate()
		}
	})
</script>

<Header>
	{#snippet action()}
		<MusicButton />
	{/snippet}
</Header>

<div class="content">
	<h1>Exponent</h1>
	<p>Ein Spiel von Lu</p>
	<button
		class="start-button"
		onclick={() => {
			allowUndo()
			goto('/campaign')
		}}>Start</button
	>
	<a href="/extras" class="button extras-button" class:hidden={!showExtras}>Tägliche Challenge</a>

	<a href="/level-builder" class="button level-builder-button" class:hidden={!showLevelBuilder}>
		Level Builder
	</a>

	<button
		class="install-button"
		class:hidden={installation.installed}
		onclick={installation.installApp}
	>
		Installieren
	</button>

	<p class:hidden={!shouldReload}>Eine neue Version ist verfügbar.</p>
	<button class="reload-button" class:hidden={!shouldReload} onclick={() => location.reload()}>
		Neu laden
	</button>
</div>

<style lang="scss">
	@use '../helper';

	.content {
		margin: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	h1,
	p {
		text-align: center;
		margin: 0;
	}

	h1 {
		font-weight: 900;
		font-size: 2.5rem;
		animation: title-shadow-animation 0.66s linear 0.5s forwards;

		@include helper.fade-shadows-up(
			title-shadow-animation,
			#0005,
			#a504a5,
			#de957a,
			#b2ccbb,
			#556159,
			#55615977
		);
	}

	.install-button,
	.reload-button,
	.level-builder-button {
		background-color: #fff1;
		padding-block: 0.5rem;
		@include helper.focus-background(#fff2);
	}

	.start-button,
	.extras-button {
		background-color: #922dff50;
		padding-block: 0.5rem;
		font-size: 1.75rem;
		@include helper.focus-background(#922dff70);
	}

	.extras-button {
		font-size: 1.4rem;
	}

	.hidden {
		visibility: hidden;
	}
</style>
