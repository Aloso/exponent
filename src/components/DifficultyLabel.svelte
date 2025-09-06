<script lang="ts">
	interface Props {
		difficulty?: number
		right?: boolean
	}

	let { difficulty, right }: Props = $props()
</script>

{#if difficulty != null}
	<div
		class="difficulty"
		class:right
		class:easy={difficulty < 4}
		class:medium={difficulty >= 4 && difficulty < 7}
		class:hard={difficulty >= 7}
	>
		{difficulty}
	</div>
{/if}

<style lang="scss">
	.difficulty {
		display: inline-block;
		border-radius: 1rem;
		padding: 0 0.35rem;
		font-size: 0.95rem;
		font-weight: 500;
		color: #000;
		letter-spacing: 0.03rem;

		&.right {
			float: right;
		}

		&.easy {
			background-color: #bf5;
		}
		&.medium {
			background-color: #ff5;
		}
		&.hard {
			background-color: #f55;
		}
	}
</style>
