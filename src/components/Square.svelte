<script lang="ts">
	import type { LevelMode } from '$lib/modes'
	import { squareLabel, type Square } from '$lib/square'

	interface Props {
		square: Square
		mode: LevelMode
		highlights?: string
		onclick: () => void
	}

	let { square, mode, highlights, onclick }: Props = $props()
	let label = $derived(squareLabel(square.num))

	interface OldSquare {
		num: number
		label: string
		color: string
		animation: { kind: 'move' | 'move-vanish'; x: number; y: number }
	}

	let oldSquares = $derived.by<OldSquare[]>(() => {
		const ani = square.animation
		if (!ani) return []
		if (ani.kind === 'merge' || ani.kind === 'vanish') {
			return ani.old.map((old) => ({
				num: old.num,
				label: squareLabel(old.num),
				color: mode.getColor(old.num),
				animation: { kind: ani.kind === 'merge' ? 'move' : 'move-vanish', x: old.x, y: old.y },
			}))
		} else {
			return []
		}
	})
</script>

<button class="square-bg" class:empty={square.variant === 'empty'} style={highlights} {onclick}>
	{#if square.goal}
		<div class="goal" class:big={square.goal >= 1000}>{square.goal}+</div>
	{/if}

	{#each oldSquares as old}
		<div
			class="square d{old.label.length} full"
			data-ani={old.animation.kind}
			style="--ani-x: {old.animation.x}; --ani-y: {old.animation.y}; --color: {old.color}"
		>
			{old.label}
		</div>
	{/each}

	<div
		class="square d{label.length}"
		class:full={square.num !== undefined}
		class:wall={square.variant === 'wall'}
		class:black-hole={!!square.effects?.includes('black-hole')}
		class:mouth={square.variant === 'mouth'}
		data-ani={oldSquares.length === 2 ? 'appear-merge' : square.animation?.kind}
		data-direction={square.direction}
		style="{square.num ? `--color: ${mode.getColor(square.num)};` : ''}
		{square.animation?.kind === 'move'
			? `--ani-x: ${square.animation.x}; --ani-y: ${square.animation.y}`
			: ''}"
	>
		{label}
	</div>
</button>

<style lang="scss">
	@use '../squares.scss';

	.square-bg {
		display: flex;
		justify-content: center;
		position: relative;
		height: 0;
		margin: 8%;
		padding: 0 0 84% 0;
		border-radius: 0.3rem;
		background-color: #0002;
		box-shadow: inset 0 0.5rem 0 0.05rem #00000008;
		user-select: none;

		&.empty {
			background-color: transparent;
			box-shadow: none;
		}
	}

	.goal {
		box-sizing: border-box;
		position: absolute;
		width: 84%;
		height: 84%;
		margin: 8%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-weight: 600;
		font-size: 0.67em;
		color: #fffa;
		border: 0.15em solid #fff7;

		&.big {
			font-size: 0.55em;
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
		pointer-events: none;

		&.full {
			background-color: var(--color, #fff3);
			box-shadow: inset 0 -0.5rem 0 #00000017;

			:global(.hidden-fields) &::after {
				position: absolute;
				content: '?';
				color: #fff7;
				left: 0;
				right: 0;
				text-align: center;
			}
		}

		&.wall {
			background-image: squares.$wall_bg;
		}

		&.black-hole {
			background: squares.$black_hole_bg;
		}

		&[data-ani='move'] {
			animation: move 0.2s ease forwards;
		}
		&[data-ani='move-vanish'] {
			animation: move-vanish 0.4s ease forwards;
			z-index: 2;
		}
		&[data-ani='appear'] {
			animation: appear 0.5s ease-out forwards;
		}
		&[data-ani='appear-merge'] {
			animation: appear-fast 0.25s ease-out forwards;
			z-index: 2;
		}

		&.mouth {
			background: squares.$mouth_bg;
			opacity: 0.7;

			&[data-direction='up'] {
				transform: rotate(-225deg) !important;
			}
			&[data-direction='down'] {
				transform: rotate(-45deg) !important;
			}
			&[data-direction='left'] {
				transform: rotate(45deg) !important;
			}
			&[data-direction='right'] {
				transform: rotate(225deg) !important;
			}
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

		@keyframes move-vanish {
			0% {
				transform: translate(calc(var(--ani-x) * 100%), calc(var(--ani-y) * 100%)) scale(1);
				opacity: 1;
				z-index: 1;
			}
			50% {
				transform: translate(0, 0) scale(1);
				opacity: 1;
				z-index: 1;
			}
			100% {
				transform: translate(0, 0) scale(0);
				opacity: 0;
				z-index: 1;
			}
		}

		@include squares.font-sizes();
	}
</style>
