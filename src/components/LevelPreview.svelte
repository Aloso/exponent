<script lang="ts">
	import type { LevelDto } from '$lib/api/types'
	import { deserializeB64 } from '$lib/serde'
	import Field from './Field.svelte'

	interface Props {
		level: LevelDto
	}

	let { level }: Props = $props()
</script>

<a class="wrapper button" href="/level?code={level.data}">
	<Field small level={deserializeB64(level.data)} noGestures noGoal />
	<h3>{level.name}</h3>
	<p class="date">{new Date(level.created).toLocaleString()}</p>
	{#if level.desc}
		<p class="ellipsis">{level.desc}</p>
	{/if}
</a>

<style lang="scss">
	.wrapper {
		min-width: 0;
		text-align: left;
		padding: 0;
	}

	h3 {
		font-size: 1.05rem;
		margin: 0.5rem 0 0 0;
	}

	p {
		font-size: 0.9rem;
		margin: 0;
	}

	.date {
		opacity: 0.6;
	}
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
