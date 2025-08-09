<script lang="ts">
	import type { LevelMode } from '$lib/modes'
	import type { Square } from '$lib/square'

	interface Props {
		square: Square
		mode: LevelMode
		highlights?: string
		onclick: () => void
	}

	let { square, mode, highlights, onclick }: Props = $props()
	let label = $derived(getLabel(square.num))

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
				label: getLabel(old.num),
				color: mode.getColor(old.num),
				animation: { kind: ani.kind === 'merge' ? 'move' : 'move-vanish', x: old.x, y: old.y },
			}))
		} else {
			return []
		}
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

<button class="square-bg" class:empty={square.variant === 'empty'} style={highlights} {onclick}>
	{#if square.goal}
		<div class="goal">{square.goal}+</div>
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
	.square-bg {
		display: flex;
		justify-content: center;
		position: relative;
		margin: 8%;
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
		width: 80%;
		height: 80%;
		margin: 10%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-weight: 600;
		color: #fffa;
		border: 0.2rem solid #fff7;
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
			background-color: var(--color, #fff3);
			box-shadow: inset 0 -0.5rem 0 #00000017;

			:global(.hidden-fields) &::after {
				position: absolute;
				content: '?';
				color: #fff7;
				left: 0;
				right: 0;
				text-align: center;
				font-size: calc(0.3 * var(--app-width) / var(--columns, 4));
			}
		}

		&.wall {
			background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPGcgZmlsbD0id2hpdGUiPgogICAgPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgeD0iMSIgeT0iMSIgcng9IjAuNSIgcnk9IjAuNSIgc3R5bGU9Im9wYWNpdHk6IDAuNSIgLz4KICAgIDxyZWN0IHdpZHRoPSI5IiBoZWlnaHQ9IjQiIHg9IjYiIHk9IjEiIHJ4PSIwLjUiIHJ5PSIwLjUiIHN0eWxlPSJvcGFjaXR5OiAwLjQiIC8+CiAgICA8cmVjdCB3aWR0aD0iOSIgaGVpZ2h0PSI0IiB4PSIxIiB5PSI2IiByeD0iMC41IiByeT0iMC41IiBzdHlsZT0ib3BhY2l0eTogMC41IiAvPgogICAgPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgeD0iMTEiIHk9IjYiIHJ4PSIwLjUiIHJ5PSIwLjUiIHN0eWxlPSJvcGFjaXR5OiAwLjMiIC8+CiAgICA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4PSIxIiB5PSIxMSIgcng9IjAuNSIgcnk9IjAuNSIgc3R5bGU9Im9wYWNpdHk6IDAuNCIgLz4KICAgIDxyZWN0IHdpZHRoPSI5IiBoZWlnaHQ9IjQiIHg9IjYiIHk9IjExIiByeD0iMC41IiByeT0iMC41IiBzdHlsZT0ib3BhY2l0eTogMC42IiAvPgogIDwvZz4KPC9zdmc+');
		}

		&.black-hole {
			background: url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iI2ZmZjIiCiAgICBkPSJNIDIsMSBDIDEuNDQ2LDEgMSwxLjQ0NiAxLDIgViA4IEMgMS45NDgsNC42NzIgNC4wNDMsMi44NzMgNi41NzMsMy4yMjkgOS43LDMuNjY4IDkuODIzLDYuODUgOCw4IDguOTM3LDkuODI0IDEyLjEsOS43IDEyLjc1LDYuNzgxIDEzLjI0LDQuNTk2IDExLjcsMS4wMzQgOCwxIFogTSA4LDggQyA2LjUwOSw2LjM2NiAzLjk1Niw3LjQ0MiAzLjM0NCw5LjI2NyAyLjM4LDEyLjE0IDMuNzE4LDE0Ljk1IDgsMTUgaCA2IGMgMC41NSwwIDEsLTAuNDUgMSwtMSBWIDggYyAwLDMuNjggLTMuOSw1LjUyIC02LjA3NSw0LjY5IEMgNi4yOCwxMS42OCA2LjE3NCw5LjQzMiA4LDggWiIgLz4KPC9zdmc+')
				#24001b;
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
			background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTgsMiBBNiw2LDI3MCwxLDAsMTQsOCBMOCw4IiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+');
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

		&.d1 {
			font-size: calc(0.3 * var(--app-width) / var(--columns, 4));
		}
		&.d2 {
			font-size: calc(0.26 * var(--app-width) / var(--columns, 4));
		}
		&.d3 {
			font-size: calc(0.22 * var(--app-width) / var(--columns, 4));
		}
		&.d4 {
			font-size: calc(0.2 * var(--app-width) / var(--columns, 4));
		}
		&.d5 {
			font-size: calc(0.18 * var(--app-width) / var(--columns, 4));
		}
		&.d6 {
			font-size: calc(0.16 * var(--app-width) / var(--columns, 4));
		}
		&.d7 {
			font-size: calc(0.15 * var(--app-width) / var(--columns, 4));
		}
		&.d8 {
			font-size: calc(0.14 * var(--app-width) / var(--columns, 4));
		}
	}
</style>
