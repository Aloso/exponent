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
	{#snippet action1()}
		<a class="header-action-button" aria-label="Account" href="/account">
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<path
					style="fill:#ffffff"
					d="M 15.808594,30.740234 C 7.5027651,36.075331 2,45.395076 2,56 c 0.2462239,5.860846 3.4898105,8 8,8 h 44 c 4.606263,0 7.661094,-2.992671 8,-8 C 62,45.395076 56.497235,36.075331 48.191406,30.740234 44.429376,35.928646 38.408783,38.999948 32,39 25.591217,38.999948 19.570624,35.928646 15.808594,30.740234 Z"
				/>
				<circle style="fill:#ffffff" cx="32" cy="19" r="14" />
			</svg>
		</a>
	{/snippet}
	{#snippet action2()}
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
	.reload-button {
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
