<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
		isInteractive?: boolean
		step: number
		lastStep: number
		lastLabel?: string
		isForwardDisabled?: boolean
		onFinished: () => void
	}

	let {
		children,
		isInteractive,
		step = $bindable(),
		lastStep,
		lastLabel = 'Verstanden',
		isForwardDisabled,
		onFinished,
	}: Props = $props()
</script>

<div class="backdrop" class:isInteractive></div>

<div class="overlay" class:isInteractive>{@render children()}</div>

<div class="buttons">
	{#if step > 0}
		<button class="button back" onclick={() => (step -= 1)}>Zurück</button>
	{/if}
	<button
		class="button"
		onclick={() => {
			if (step === lastStep) onFinished()
			else step += 1
		}}
		disabled={isForwardDisabled}
	>
		{step < lastStep ? 'Weiter' : lastLabel}
	</button>
</div>

<style lang="scss">
	@use '../helper';

	.backdrop {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: linear-gradient(to bottom, transparent, transparent, #0003);
		z-index: 100;

		&.isInteractive {
			pointer-events: none;
		}
	}

	.overlay {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 4.7rem;
		height: auto;
		padding: 2rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
		z-index: 100;

		:global(:first-child) {
			margin-top: 0;
		}

		:global(:last-child) {
			margin-bottom: 0;
		}

		&.isInteractive {
			user-select: none;
			pointer-events: none;
		}
	}

	.buttons {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 2rem;
		font-size: 1.25rem;
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		z-index: 100;

		.button {
			background-color: #fff2;
			padding-block: 0.5rem;
			font-weight: 500;
			@include helper.focus-background(#fff3);

			&[disabled] {
				opacity: 0.6;
				font-weight: 400;
			}
		}

		.back {
			opacity: 0.6;
			font-weight: 400;
		}
	}
</style>
