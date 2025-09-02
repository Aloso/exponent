<script lang="ts">
	import type { Level } from '$lib/levels'
	import Header from './Header.svelte'

	interface Props {
		name: string
		level: Level
		undo: () => void
		canUndo?: boolean
	}

	let { name, level, undo, canUndo }: Props = $props()
</script>

<Header back={true}>
	{#if level.number !== undefined}
		<span class="lvl-number">{level.number}</span>
	{/if}
	{name}

	{#snippet action2()}
		<button class="header-action-button" aria-label="Rückgängig" onclick={undo} disabled={!canUndo}>
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
	{/snippet}
</Header>

<style lang="scss">
	.header-action-button[disabled] {
		opacity: 0.5;
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
