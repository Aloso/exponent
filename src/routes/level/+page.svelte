<script lang="ts">
	import { goto } from '$app/navigation'
	import { getNextLevel, levels } from '$lib/levels'
	import LevelButton from '../../components/LevelButton.svelte'

	let nextLevel = $derived(getNextLevel())

	$effect(() => {
		if (nextLevel) {
			goto(`/level/${nextLevel.id}`, { replaceState: true })
		}
	})
</script>

<div class="levels">
	{#each levels as level, number}
		<LevelButton {level} {number} />
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
