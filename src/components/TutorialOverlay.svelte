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

<div class="overlay">{@render children()}</div>

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
		background: linear-gradient(to bottom, transparent, #0003);

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
	}

	.buttons {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 2rem;
		font-size: 1.25rem;
		text-align: right;

		.button {
			background-color: #fff1;
			padding-block: 0.5rem;
			@include helper.focus-background(#fff2);

			&[disabled] {
				opacity: 0.6;
			}
		}

		.back {
			opacity: 0.6;
		}
	}
</style>
