<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
		actions: { label: string; action: () => void }[]
	}

	let { children, actions }: Props = $props()
</script>

<div class="backdrop"></div>

<div class="overlay">{@render children()}</div>

<div class="buttons">
	{#each actions as action}
		<button class="button" onclick={action.action}>{action.label}</button>
	{/each}
</div>

<style lang="scss">
	@use '../helper';

	.backdrop {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: linear-gradient(to bottom, #0003, #0006);
		backdrop-filter: blur(8px);
	}

	.overlay {
		position: fixed;
		left: 0;
		right: 0;
		top: 3rem;
		bottom: 4.7rem;
		height: auto;
		padding: 2rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
	}

	.buttons {
		position: fixed;
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 2rem;
		font-size: 1.25rem;

		.button {
			background-color: #fff1;
			padding-block: 0.5rem;
			@include helper.focus-background(#fff2);
		}
	}
</style>
