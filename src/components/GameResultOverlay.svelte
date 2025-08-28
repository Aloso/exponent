<script lang="ts">
	import type { Snippet } from 'svelte'
	import Gestures from './Gestures.svelte'

	interface Props {
		children: Snippet
		actions: { label: string; action: () => void; disabled?: boolean }[]
	}

	let { children, actions }: Props = $props()
</script>

<div class="backdrop"></div>

<div class="overlay">{@render children()}</div>

<Gestures zIndex={101} onMove={() => {}} />

<div class="buttons">
	{#each actions as { action, label, disabled } (label)}
		<button class="button" onclick={action} {disabled}>{label}</button>
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
		z-index: 100;
		animation: appear-slowly 1s ease forwards;
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
		line-height: 1.8em;
		text-align: center;
		z-index: 100;
		animation: appear-slowly 1s ease forwards;
	}

	.buttons {
		position: fixed;
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		flex-wrap: wrap;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 2rem;
		font-size: 1.25rem;
		z-index: 102;
		animation: appear-slowly 1s ease forwards;

		.button {
			background-color: #fff1;
			padding-block: 0.5rem;
			@include helper.focus-background(#fff2);
		}
	}

	@keyframes appear-slowly {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
