<script lang="ts">
	interface Props {
		mode?: string
		right?: boolean
	}

	let { mode, right }: Props = $props()
	let modeText = $derived.by(() => {
		switch (mode) {
			case 'custom':
				return 'individuell'
			case 'fibonacchi':
				return 'fib'
			case 'logarithmic':
				return 'loga'
		}
	})
</script>

{#if modeText}
	<div class="mode" class:right>{modeText}</div>
{/if}

<style lang="scss">
	.mode {
		display: inline-block;
		box-shadow: inset 0 0 0 0.07rem #ff0a;
		border-radius: 1rem;
		padding: 0 0.35rem;
		font-size: 0.95rem;
		font-weight: normal;
		color: #fffc;
		letter-spacing: 0.03rem;
		margin-left: 0.25rem;

		&.right {
			float: right;
		}
	}
</style>
