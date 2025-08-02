<script lang="ts">
	import { goto } from '$app/navigation'
	import { allowUndo } from '$lib/canUndo'
	import { useSpaInstallation } from '$lib/useSpaInstallation.svelte'

	let installation = useSpaInstallation()
</script>

<div class="content">
	<h1>Exponent</h1>
	<p>Ein Spiel von Lu</p>
	<button
		class="start-button"
		onclick={() => {
			allowUndo()
			goto('/level')
		}}>Start</button
	>
	<button
		class="install-button"
		class:hidden={installation.installed}
		onclick={installation.installApp}
	>
		Installieren
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

	.install-button {
		background-color: #fff1;
		padding-block: 0.5rem;
		@include helper.focus-background(#fff2);

		&.hidden {
			visibility: hidden;
		}
	}

	.start-button {
		background-color: #922dff50;
		padding-block: 0.5rem;
		font-size: 1.75rem;
		@include helper.focus-background(#922dff70);
	}
</style>
