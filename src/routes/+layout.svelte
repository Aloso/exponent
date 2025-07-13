<script lang="ts">
	import { onMount, type Snippet } from 'svelte'
	import { loadConfig, saveConfig } from '$lib/appState.svelte'
	import './styles.scss'

	interface Props {
		children: Snippet
	}

	let { children }: Props = $props()

	onMount(() => {
		loadConfig()
	})
	$effect(() => {
		saveConfig()
	})
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=block"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		max-width: 66.66667dvh;
		margin: 0 auto;
		box-shadow:
			0 0 10px #0002,
			0 0 400px 200px #0001;
	}
</style>
