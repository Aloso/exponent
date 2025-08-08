<script lang="ts">
	import type { Direction } from '$lib/events'
	import type { LevelRule } from '$lib/levels'
	import GameRule from './GameRule.svelte'
	import Gestures from './Gestures.svelte'

	interface Props {
		rules: LevelRule[]
		onMove: (direction: Direction) => void
	}

	let { rules, onMove }: Props = $props()
	let open = $state(false)
	let tutorial = $derived(rules.includes('tutorial'))

	let surface = $state<HTMLElement>()
</script>

{#if !tutorial}
	<div class="rules-wrapper">
		<Gestures {onMove} onClick={() => (open = !open)} {surface}>
			<button class="rules-button" bind:this={surface}>Regeln in diesem Level</button>
		</Gestures>

		{#if open}
			<div class="rules-box">
				<button class="close-button" onclick={() => (open = false)}>×</button>

				{#each rules as rule}
					<GameRule {rule} />
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../helper';

	.rules-wrapper {
		margin: 1rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: center;
		z-index: 51;
	}

	.rules-button {
		background-color: #6c016c;
		padding: 0.33rem 0.8rem;
		font: inherit;
		font-size: 90%;
	}

	.close-button {
		float: right;
		padding-block: 0.5rem;
		margin: 0 -1rem 0 1rem;
		font: inherit;
		font-size: 1.5rem;
		border-radius: 0.5rem;

		&:hover,
		&:focus {
			background-color: #fff1;
		}
	}

	.rules-box {
		padding: 0 1rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
		background-color: #6c016c;
	}
</style>
