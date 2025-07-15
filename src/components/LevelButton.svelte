<script lang="ts">
	import type { Level } from '$lib/levels'

	interface Props {
		level: Level
	}

	let { level }: Props = $props()
</script>

<a class="button level" href="/level/{level.id}">
	{#if level.number !== undefined}
		<div class="number">{level.number}</div>
	{/if}
	<div class="label">{level.name}</div>
</a>

<style lang="scss">
	@use '../helper';

	.level {
		position: relative;
		border-radius: 0.3rem;
		height: 3.8rem;
		line-height: 1.2rem;
		padding: 1rem;
		background-color: #fff1;
		@include helper.focus-background(#fff2);
	}

	.number {
		position: absolute;
		font-size: 2.3rem;
		right: 0.6rem;
		top: 3.7rem;
		font-weight: 700;
		opacity: 0.3;
		user-select: none;
	}

	.label {
		height: 2.4rem;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
