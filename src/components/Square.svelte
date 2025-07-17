<script lang="ts">
	import type { Square } from '$lib/square'

	interface Props {
		square: Square
	}

	let { square }: Props = $props()
	let label = $derived(getLabel(square.num))

	interface OldSquare {
		num: number
		label: string
		animation: { kind: 'move' | 'move-vanish'; x: number; y: number }
	}

	let oldSquares = $derived.by<OldSquare[]>(() => {
		const ani = square.animation
		if (!ani) return []
		if (ani.kind === 'merge') {
			const num = ani.oldNum
			const label = getLabel(num)
			return [
				{ num, label, animation: { kind: 'move', x: ani.x1, y: ani.y1 } },
				{ num, label, animation: { kind: 'move', x: ani.x2, y: ani.y2 } },
			]
		} else if (ani.kind === 'vanish') {
			const num = ani.oldNum
			const label = getLabel(num)
			return [{ num, label, animation: { kind: 'move-vanish', x: ani.x, y: ani.y } }]
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

<div class="square-bg" class:empty={square.variant === 'empty'}>
	{#if square.goal}
		<div class="goal">{square.goal}+</div>
	{/if}

	{#each oldSquares as old}
		<div
			class="square d{old.label.length} full"
			data-num={old.num}
			data-ani={old.animation.kind}
			style="--ani-x: {old.animation.x}; --ani-y: {old.animation.y}"
		>
			{old.label}
		</div>
	{/each}

	<div
		class="square d{label.length}"
		class:full={square.num !== undefined}
		class:wall={square.variant === 'wall'}
		class:black-hole={!!square.effects?.includes('black-hole')}
		data-num={square.num}
		data-ani={oldSquares.length === 2 ? 'appear-merge' : square.animation?.kind}
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
