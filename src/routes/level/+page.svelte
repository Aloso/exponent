<script lang="ts">
	import { getNextLevel, levels } from '$lib/levels'
	import LevelButton from '../../components/LevelButton.svelte'

	let nextLevel = $derived(getNextLevel())
	let nextLevelIndex = $derived(
		nextLevel ? levels.findIndex((lvl) => lvl.id === nextLevel.id) : undefined,
	)
</script>

<div class="levels">
	{#each levels as level, i}
		<LevelButton
			{level}
			active={level.id === nextLevel?.id}
			disabled={nextLevelIndex !== undefined && nextLevelIndex >= 0 && i > nextLevelIndex}
		/>
	{/each}
</div>

<style lang="scss">
	.levels {
		padding: 1.5rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem 1rem;
	}
</style>
