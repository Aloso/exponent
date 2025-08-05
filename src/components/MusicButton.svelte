<script lang="ts">
	import { musicState, togglePaused } from '$lib/audio.svelte'
</script>

<button
	class="header-action-button"
	aria-label="Musik"
	onclick={togglePaused}
	disabled={musicState.error}
>
	{#if musicState.paused}
		<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
			<path
				style="fill:white"
				d="M 54.95 1.502 C 54.64 1.502 54.34 1.552 54.04 1.635 L 20.1 11.33 L 35.57 17.21 L 51.55 12.64 L 51.55 23.28 L 58.54 25.93 L 58.54 8 L 58.54 5 C 58.54 3.048 56.94 1.474 54.99 1.502 L 54.95 1.502 z M 16.5 22.8 L 16.5 44.7 C 14.16 44.38 11.6 44.8 9.26 45.89 C 3.756 48.46 0.9007 53.99 2.883 58.24 C 4.87 62.49 10.94 63.85 16.44 61.29 C 20.57 59.37 23.31 55.7 23.45 52.1 C 23.45 51.39 23.55 50.85 23.55 50 L 23.55 25.48 L 16.5 22.8 z M 51.55 36.12 L 51.55 37.14 C 49.24 36.84 46.72 37.26 44.41 38.34 C 38.9 40.91 36.04 46.44 38.03 50.7 C 40.02 54.96 46.09 56.32 51.6 53.75 C 56.21 51.6 59.08 47.29 58.54 43.32 L 58.54 43 L 58.54 38.66 A 6 6 0 0 1 57.48 38.37 L 51.55 36.12 z "
			/>
			<path
				style="stroke:white;stroke-width:7;stroke-linecap:round"
				d="M 13.45,15.22 59.61,32.76"
			/>
		</svg>
	{:else}
		<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
			<path
				style="stroke:white;fill:none;stroke-width:7;stroke-linejoin:round;stroke-linecap:round"
				d="M 20,50 V 15 L 55,5 55,43 55,8 20,18"
			/>
			<ellipse style="fill:white" cx="-11" cy="54" rx="11" ry="8.5" transform="rotate(-25)" />
			<ellipse style="fill:white" cx="24" cy="62" rx="11" ry="8.5" transform="rotate(-25)" />
		</svg>
	{/if}
</button>

<style lang="scss">
	.header-action-button[disabled] {
		opacity: 0.5;
	}
</style>
