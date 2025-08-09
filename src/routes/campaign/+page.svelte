<script lang="ts">
	import { appState } from '$lib/appState.svelte'
	import { getNextLevel, levels } from '$lib/levels'
	import Header from '../../components/Header.svelte'
	import LevelButton from '../../components/LevelButton.svelte'
	import MusicButton from '../../components/MusicButton.svelte'

	let nextLevel = $derived(getNextLevel())
	let nextLevelIndex = $derived(
		nextLevel ? levels.findIndex((lvl) => lvl.id === nextLevel.id) : undefined,
	)

	let currentGame = $derived(appState.currentLevel)
	let suggestedLevel = $derived.by(() => {
		if (currentGame) {
			const level = levels.find((l) => l.id === currentGame.id)
			if (level !== undefined) {
				return level
			}
			return nextLevel
		}
	})
</script>

<Header back>
	Übersicht
	{#snippet action()}
		<MusicButton />
	{/snippet}
</Header>

{#if suggestedLevel}
	<div class="suggested-level">
		<p><em>{currentGame ? 'Weiterspielen' : 'Als nächstes'}</em></p>
		<LevelButton level={suggestedLevel} active />
	</div>
{/if}

<p class="label"><em>Alle Level</em></p>

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
	.suggested-level {
		display: flex;
		flex-direction: column;
		padding: 0 1.5rem;
	}

	.label {
		padding: 0 1.5rem;
	}

	.levels {
		padding: 0 1.5rem 3rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem 1rem;
	}
</style>
