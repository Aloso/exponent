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
	let label = $derived(squareLabel(square.block?.num))

	interface OldSquare {
		num: number
		label: string
		color: string
		animation: { kind: 'move' | 'move-vanish'; x: number; y: number; antimatter?: boolean }
	}

	let oldSquares = $derived.by<OldSquare[]>(() => {
		const ani = square.animation
		if (!ani) return []
		if (ani.kind === 'merge' || ani.kind === 'vanish') {
			return ani.old.map((old) => ({
				num: old.num,
				label: squareLabel(old.num),
				color: mode.getColor(old.num),
				animation: {
					kind: ani.kind === 'merge' && square.block ? 'move' : 'move-vanish',
					x: old.x,
					y: old.y,
					antimatter: old.antimatter,
				},
			}))
		} else {
			return []
		}
	})

	function appear(elem: HTMLElement, fast = false) {
		const ani = elem.animate(
			[
				{ transform: 'scale(0)', opacity: 0.5 },
				{ transform: 'scale(0)', opacity: 0.5, offset: fast ? 0.5 : 0.6 },
				{ transform: 'scale(1)' },
			],
			{ easing: 'ease-out', duration: fast ? 250 : 500, iterations: 1, fill: 'forwards' },
		)
		return () => ani.cancel()
	}

	function move(elem: HTMLElement, origin: { x: number; y: number }) {
		const ani = elem.animate(
			[
				{ transform: `translate(${origin.x * 100}%, ${origin.y * 100}%)`, zIndex: 1 },
				{ transform: 'translate(0, 0)', zIndex: 1, offset: 0.99 },
				{ zIndex: 0 },
			],
			{ easing: 'ease', duration: 200, fill: 'forwards' },
		)
		return () => ani.cancel()
	}

	function moveVanish(elem: HTMLElement, origin: { x: number; y: number }) {
		const transform = `translate(${origin.x * 100}%, ${origin.y * 100}%) scale(1)`
		const ani = elem.animate(
			[
				{ transform, opacity: 1, zIndex: 1 },
				{ transform: 'translate(0, 0) scale(1)', opacity: 1, zIndex: 1 },
				{ transform: 'translate(0, 0) scale(0)', opacity: 0, zIndex: 0 },
			],
			{ easing: 'ease', duration: 400, fill: 'forwards' },
		)
		return () => ani.cancel()
	}
</script>

<button class="square-bg" class:empty={square.variant === 'empty'} style={highlights} {onclick}>
	{#if square.goal}
		<div class="goal" class:big={square.goal >= 1000}>{square.goal}+</div>
	{/if}

	{#each oldSquares as old}
		<div
			class="square d{old.label.length} full"
			class:antimatter={old.animation.antimatter}
			class:foreground={old.animation.kind === 'move-vanish'}
			style="--color: {old.color}"
			{@attach (elem) => {
				switch (old.animation.kind) {
					case 'move':
						return move(elem, old.animation)
					case 'move-vanish':
						return moveVanish(elem, old.animation)
				}
			}}
		>
			{old.label}
		</div>
	{/each}

	<div
		class="square d{label.length}"
		class:full={square.block !== undefined}
		class:wall={square.variant === 'wall'}
		class:black-hole={square.variant === 'black-hole'}
		class:mouth={square.variant === 'mouth'}
		class:antimatter={square.block?.antimatter}
		class:foreground={oldSquares.length === 2}
		data-direction={square.direction}
		style={square.block ? `--color: ${mode.getColor(square.block.num)};` : ''}
		{@attach (elem) => {
			if (square.animation) {
				if (oldSquares.length === 2) return appear(elem, true)
				switch (square.animation.kind) {
					case 'appear':
						return appear(elem)
					case 'move':
						return move(elem, square.animation)
				}
			}
		}}
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

		:global(.small) & {
			box-shadow: inset 0 0.25rem 0 0.05rem #00000008;
			border-radius: 0.15rem;
		}

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

			&.antimatter {
				filter: invert(1);
				box-shadow: inset 0 0 0 0.5rem #0007;
			}

			:global(.small) & {
				box-shadow: inset 0 -0.25rem 0 #00000017;
				border-radius: 0.15rem;
			}

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

		&.foreground {
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

		@include squares.font-sizes();
	}
</style>
