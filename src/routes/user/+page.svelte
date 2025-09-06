<script lang="ts">
	import Header from '../../components/Header.svelte'
	import LevelPreview from '../../components/LevelPreview.svelte'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
</script>

<Header back>
	{data.user.display_name}
</Header>

<div class="content">
	<h2>Erstellte Level</h2>
	{#if !data.levels || data.levels.length === 0}
		<p>Die Person hat noch keine Level veröffentlicht</p>
	{:else}
		<div class="level-grid">
			{#each data.levels as level}
				<LevelPreview {level} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.content {
		width: 90%;
		margin: 0 auto;

		h2 {
			font-size: 1.25rem;
		}
	}

	.level-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 3rem;
	}
</style>
