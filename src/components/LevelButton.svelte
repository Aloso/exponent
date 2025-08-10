<script lang="ts">
	import type { Level } from '$lib/levels'

	interface Props {
		level: Level
		active?: boolean
		disabled?: boolean
		date?: Date
	}

	let { level, active, disabled, date }: Props = $props()

	let isToday = $derived.by(() => {
		if (date !== undefined) {
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			const endOfToday = new Date()
			endOfToday.setHours(23, 59, 59, 999)
			return +date >= +today && +date <= +endOfToday
		}
		return false
	})
</script>

<a
	class="button level"
	class:active={active || isToday}
	aria-disabled={disabled}
	href={disabled
		? undefined
		: level.encoded
			? `/level?code=${level.encoded}`
			: `/level?id=${level.id}`}
>
	{#if level.number !== undefined}
		<div class="number">{level.number}</div>
	{:else if date !== undefined}
		<div class="date">
			{isToday ? 'Heute' : date.toLocaleDateString('de', { day: 'numeric', month: 'long' })}
		</div>
	{/if}
	<div class="label">{level.name}</div>
	{#if !date && level.id === 'custom'}
		<div class="custom">individuell</div>
	{/if}
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
		text-align: left;

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

	.date {
		position: absolute;
		font-size: 1.6rem;
		right: 0.6rem;
		top: 3.8rem;
		font-weight: 600;
		opacity: 0.5;
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

	.custom {
		float: right;
		opacity: 0.5;
	}
</style>
