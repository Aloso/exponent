<script lang="ts">
	import type { Square, SquareAnimation } from '$lib/square'

	interface Props {
		square: Square
	}

	let { square }: Props = $props()
	let label = $derived(getLabel(square.num))

	interface OldSquare {
		num: number
		label: string
		animation: SquareAnimation
	}

	let old = $derived.by(() => {
		const ani = square.animation
		if (ani?.kind !== 'merge') return
		const num = ani.oldNum
		const label = getLabel(num)
		return [
			{ num, label, animation: { kind: 'move', x: ani.x1, y: ani.y1 } },
			{ num, label, animation: { kind: 'move', x: ani.x2, y: ani.y2 } },
		] satisfies [OldSquare, OldSquare]
	})

	function getLabel(num: number | undefined) {
		if (num === undefined) return ''
		if (num > 16_000) {
			const kilos = (num / 1000) | 0
			return kilos + 'K'
		} else {
			return `${num}`
		}
	}
</script>

<div class="square-bg" class:empty={square.variant === 'empty'}>
	{#if old}
		<div
			class="square d{old[0].label.length} full"
			data-num={old[0].num}
			data-ani="move"
			style="--ani-x: {old[0].animation.x}; --ani-y: {old[0].animation.y}"
		>
			{old[0].label}
		</div>
		<div
			class="square d{old[1].label.length} full"
			data-num={old[1].num}
			data-ani="move"
			style="--ani-x: {old[1].animation.x}; --ani-y: {old[1].animation.y}"
		>
			{old[1].label}
		</div>
	{/if}

	<div
		class="square d{label.length}"
		class:full={square.num !== undefined}
		class:wall={square.variant === 'wall'}
		data-num={square.num}
		data-ani={old ? 'appear-merge' : square.animation?.kind}
		style={square.animation?.kind === 'move'
			? `--ani-x: ${square.animation.x}; --ani-y: ${square.animation.y}`
			: undefined}
	>
		{label}
	</div>
</div>

<style lang="scss">
	.square-bg {
		position: relative;
		border-radius: 0.3rem;
		background-color: #0002;
		box-shadow: inset 0 0.5rem 0 0.05rem #00000008;
		user-select: none;

		&.empty {
			background-color: transparent;
			box-shadow: none;
		}
	}

	.square {
		position: absolute;
		width: 100%;
		height: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.3rem;

		&.full {
			background-color: #fff3;
			box-shadow: inset 0 -0.5rem 0 #00000017;

			&[data-num='2'] {
				background-color: #9c5408;
			}
			&[data-num='4'] {
				background-color: #9c2108;
			}
			&[data-num='8'] {
				background-color: #b50887;
			}
			&[data-num='16'] {
				background-color: #6408b5;
			}
			&[data-num='32'] {
				background-color: #0a19c5;
			}
			&[data-num='64'] {
				background-color: #0a64c5;
			}
			&[data-num='128'] {
				background-color: #039965;
			}
			&[data-num='256'] {
				background-color: #128415;
			}
			&[data-num='512'] {
				background-color: #6bae0c;
			}
			&[data-num='1024'] {
				background-color: #d1d511;
			}
			&[data-num='2048'] {
				background-color: #f4a810;
			}
		}

		&.wall {
			background-image: url('/images/wall.svg');
		}

		&[data-ani='move'] {
			animation: move 0.2s ease forwards;
		}
		&[data-ani='appear'] {
			animation: appear 0.5s ease-out forwards;
		}
		&[data-ani='appear-merge'] {
			animation: appear-fast 0.25s ease-out forwards;
			z-index: 2;
		}

		@keyframes appear-fast {
			0% {
				transform: scale(0);
				opacity: 0.5;
			}
			50% {
				transform: scale(0);
				opacity: 0.5;
			}
			100% {
				transform: scale(1);
			}
		}

		@keyframes appear {
			0% {
				transform: scale(0);
				opacity: 0.5;
			}
			60% {
				transform: scale(0);
				opacity: 0.5;
			}
			100% {
				transform: scale(1);
			}
		}

		@keyframes move {
			0% {
				transform: translate(calc(var(--ani-x) * 100%), calc(var(--ani-y) * 100%));
				z-index: 1;
			}
			99% {
				transform: translate(0, 0);
				z-index: 1;
			}
			100% {
				z-index: 0;
			}
		}

		&.d1 {
			font-size: calc(0.075 * var(--app-width));
		}
		&.d2 {
			font-size: calc(0.065 * var(--app-width));
		}
		&.d3 {
			font-size: calc(0.055 * var(--app-width));
		}
		&.d4 {
			font-size: calc(0.05 * var(--app-width));
		}
		&.d5 {
			font-size: calc(0.045 * var(--app-width));
		}
		&.d6 {
			font-size: calc(0.04 * var(--app-width));
		}
		&.d7 {
			font-size: calc(0.0375 * var(--app-width));
		}
		&.d8 {
			font-size: calc(0.035 * var(--app-width));
		}
	}
</style>
