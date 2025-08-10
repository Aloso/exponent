<script lang="ts">
	import type { Level } from '$lib/levels'
	import { deserializeB64 } from '$lib/serde'
	import { onMount } from 'svelte'
	import Header from '../../components/Header.svelte'
	import MusicButton from '../../components/MusicButton.svelte'
	import LevelButton from '../../components/LevelButton.svelte'

	let levels = $state<(readonly [Date, Level])[]>([])

	onMount(async () => {
		const response = await fetch(
			'https://gist.githubusercontent.com/Aloso/d763c36db80fce8fd8944582871151f5/raw',
		)
		const levelsCsv = await response.text()

		const lines = levelsCsv
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l !== '')
		lines.shift() // remove title line

		const today = new Date()
		today.setHours(23, 59, 59, 999)

		const threeWeeksAgo = new Date()
		threeWeeksAgo.setHours(23, 59, 59, 999)
		threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)

		levels = lines
			.map((line) => {
				const [date, data] = line.split(',')
				return [new Date(date), deserializeB64(data)] as const
			})
			.filter(([date, level]) => date < today && date > threeWeeksAgo)
			.sort(([d1], [d2]) => +d2 - +d1)
	})
</script>

<Header back>
	Tägliche Challenge
	{#snippet action()}
		<MusicButton />
	{/snippet}
</Header>

<div class="levels">
	{#each levels as [date, level], i}
		<LevelButton {level} {date} />
	{:else}
		<p class="centered">Im Moment sind keine täglichen Herausforderungen verfügbar! Schere</p>
	{/each}
</div>

<style lang="scss">
	.levels {
		padding: 0 1.5rem 3rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem 1rem;
	}

	.centered {
		grid-area: 1 / 1 / 1 / 3;
		text-align: center;
		margin: 2rem 0;
	}
</style>
