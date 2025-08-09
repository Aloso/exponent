<script lang="ts">
	import type { Level } from '$lib/levels'

	interface Props {
		level: Level
		active?: boolean
		disabled?: boolean
	}

	let { level, active, disabled }: Props = $props()
</script>

<a
	class="button level"
	class:active
	aria-disabled={disabled}
	href={disabled ? undefined : `/level?id=${level.id}`}
>
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

		&[aria-disabled='true'] {
			opacity: 0.5;
			cursor: default;
		}

		&:not([aria-disabled='true']) {
			@include helper.focus-background(#fff2);
		}

		&.active {
			outline: 0.2rem solid #fffa;
		}
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
