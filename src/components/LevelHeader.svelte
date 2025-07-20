<script lang="ts">
	import type { Level } from '$lib/levels'

	interface Props {
		level: Level
		undo: () => void
		canUndo?: boolean
	}

	let { level, undo, canUndo }: Props = $props()
</script>

<div class="header">
	<a class="button back-button" href="/" aria-label="Zurück">
		<svg
			class="back-icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			stroke="white"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M15,8 L1,8 L6,2 L1,8 L6,14 L1,8" />
		</svg>
	</a>

	<h1>
		{#if level.number !== undefined}
			<span class="lvl-number">{level.number}</span>
		{/if}
		{level.name}
	</h1>

	<button class="undo-button" aria-label="Rückgängig" onclick={undo} disabled={!canUndo}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			stroke="white"
			fill="none"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M7,15 L9,15 A5,5,180,1,0,9,5 L1,5 L5,1 L1,5 L5,9" />
		</svg>
	</button>
</div>

<style lang="scss">
	.header {
		display: flex;
		align-items: center;
		width: calc(90% + 1rem);
		margin: 0 auto;
		z-index: 60;
	}

	.back-button,
	.undo-button {
		display: flex;
		padding: 1rem;
		border-radius: 2rem;
		cursor: pointer;

		&[disabled] {
			opacity: 0.5;
		}

		svg {
			width: 1.25rem;
			height: 1.25rem;
			display: block;
		}
	}

	h1 {
		text-align: center;
		font-size: 1.45rem;
		line-height: 2.5rem;
		user-select: none;
		flex-grow: 1;
		text-align: center;
	}

	.lvl-number {
		display: inline-block;
		vertical-align: 0.15em;
		padding: 0 0.8rem;
		margin: 0 0.3rem 0 0;
		background-color: white;
		color: #540354;
		border-radius: 2rem;
		font-size: 70%;
		line-height: 1.4em;
	}
</style>
