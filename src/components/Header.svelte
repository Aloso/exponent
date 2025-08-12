<script lang="ts">
	import type { Snippet } from 'svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { canUndo } from '$lib/canUndo'

	interface Props {
		back?: boolean
		children?: Snippet
		action1?: Snippet
		action2?: Snippet
	}

	let { back, children, action1, action2 }: Props = $props()
</script>

<div class="header">
	<div class="left">
		{#if back}
			<button
				class="back-button"
				onclick={() => {
					if (browser && canUndo()) {
						history.back()
					} else {
						goto('/', { replaceState: true })
					}
				}}
				aria-label="Zurück"
			>
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
			</button>
		{/if}
		{#if action1}
			{@render action1()}
		{/if}
	</div>

	<h1>
		{#if children}
			{@render children()}
		{/if}
	</h1>

	<div class="right">
		{#if action2}
			{@render action2()}
		{/if}
	</div>
</div>

<style lang="scss">
	.header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		width: calc(90% + 1rem);
		min-height: 4.5rem;
		margin: 0 auto;
		z-index: 60;
	}

	.back-button {
		display: flex;
		padding: 1rem;
		border-radius: 2rem;
		cursor: pointer;

		svg {
			width: 1.25rem;
			height: 1.25rem;
			display: block;
		}
	}

	.left {
		display: flex;
		justify-content: start;
	}

	.right {
		display: flex;
		justify-content: end;
	}

	:global(.header-action-button) {
		display: flex;
		padding: 1rem;
		border-radius: 2rem;
		cursor: pointer;

		:global(svg) {
			width: 1.25rem;
			height: 1.25rem;
			display: block;
		}
	}

	h1 {
		text-align: center;
		font-size: 1.45rem;
		line-height: 1.75rem;
		user-select: none;
		flex-grow: 1;
		text-align: center;
	}
</style>
