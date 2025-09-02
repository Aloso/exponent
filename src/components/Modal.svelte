<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		title: string
		children: Snippet
		actions: { name: string; action: () => void; primary?: boolean; disabled?: boolean }[]
	}

	let { title, children, actions }: Props = $props()
</script>

<div class="bg">
	<div class="modal">
		<h1>{title}</h1>
		{@render children()}
		<div class="actions">
			{#each actions as { name, action, disabled, primary }, i (i)}
				<button class="action" class:primary {disabled} onclick={action}>{name}</button>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.bg {
		z-index: 101;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #0005;
		backdrop-filter: blur(0.2rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: auto;
		animation: fade-in-modal 0.4s;
	}

	@keyframes fade-in-modal {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.modal {
		background-color: #31179a;
		width: 80%;
		max-width: 53.333333dvh;
		box-sizing: border-box;
		padding: 2rem;
		border-radius: 1rem;

		h1 {
			font-size: 1.25rem;
			margin: 0 0 2rem 0;
		}

		.actions {
			display: flex;
			gap: 1rem;
			margin: 2rem 0 0 0;
		}

		.action {
			background-color: #fff2;
			padding: 0.5rem 1rem;

			&[disabled] {
				opacity: 0.5;
			}

			&.primary {
				background-color: white;
				color: #160268;
			}
		}
	}
</style>
