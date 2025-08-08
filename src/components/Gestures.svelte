<script lang="ts">
	import type { Direction } from '$lib/events'
	import type { Snippet } from 'svelte'

	interface Props {
		zIndex?: number
		onMove: (direction: Direction) => void
		surface?: HTMLElement
		onClick?: () => void
		children?: Snippet
	}

	let { zIndex, onMove, surface = $bindable(), onClick, children }: Props = $props()
	let gestureCanvas = $state<HTMLElement>()

	$effect(() => {
		if (gestureCanvas) {
			surface = gestureCanvas
		}
	})

	function getDirection(dx: number, dy: number): Direction | undefined {
		const distance = Math.sqrt(dx * dx + dy * dy)
		const required = 20 + Math.min(window.innerWidth, window.innerHeight) / 15
		if (distance > required) {
			let angle = Math.atan2(dy, dx)
			if (angle < 0) {
				angle += Math.PI * 2
			}
			const section = Math.PI / 4
			if (angle < section || angle > section * 7) {
				return 'right'
			} else if (angle < section * 3) {
				return 'down'
			} else if (angle < section * 5) {
				return 'left'
			} else {
				return 'up'
			}
		}
	}

	$effect(() => {
		if (!surface) return
		const eventTarget = surface

		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') onMove('left')
			else if (event.key === 'ArrowRight') onMove('right')
			else if (event.key === 'ArrowUp') onMove('up')
			else if (event.key === 'ArrowDown') onMove('down')
		}

		let gestureStart: { x: number; y: number } | undefined

		const touchStartHandler = (event: TouchEvent) => {
			gestureStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }
			event.preventDefault()
			event.stopImmediatePropagation()
		}
		const pointerDownHandler = (event: PointerEvent) => {
			if (!gestureStart) {
				gestureStart = { x: event.clientX, y: event.clientY }
				event.preventDefault()
				event.stopImmediatePropagation()
			}
		}

		const touchMoveHandler = (event: TouchEvent) => {
			if (gestureStart) {
				event.preventDefault()
				event.stopImmediatePropagation()

				const dx = event.touches[0].clientX - gestureStart.x
				const dy = event.touches[0].clientY - gestureStart.y
				const direction = getDirection(dx, dy)
				if (direction) {
					gestureStart = undefined
					onMove(direction)
				}
			}
		}
		const pointerMoveHandler = (event: PointerEvent) => {
			if (gestureStart) {
				event.preventDefault()
				event.stopImmediatePropagation()

				const dx = event.clientX - gestureStart.x
				const dy = event.clientY - gestureStart.y
				const direction = getDirection(dx, dy)
				if (direction) {
					gestureStart = undefined
					onMove(direction)
				}
			}
		}

		const endHandler = (event: PointerEvent | TouchEvent) => {
			if (gestureStart && onClick && event.target === surface) {
				onClick()
			}

			gestureStart = undefined
		}

		const cancelHandler = () => {
			gestureStart = undefined
		}

		window.addEventListener('keydown', keyDownHandler)
		if ('ontouchstart' in document.documentElement) {
			eventTarget.addEventListener('touchstart', touchStartHandler, { passive: false })
			window.addEventListener('touchmove', touchMoveHandler, { passive: false })
			window.addEventListener('touchend', endHandler)
			window.addEventListener('touchcancel', cancelHandler)
		} else {
			eventTarget.addEventListener('pointerdown', pointerDownHandler, { passive: false })
			window.addEventListener('pointermove', pointerMoveHandler, { passive: false })
			window.addEventListener('pointerup', endHandler)
			window.addEventListener('pointercancel', cancelHandler)
		}

		return () => {
			window.removeEventListener('keydown', keyDownHandler)
			if ('ontouchstart' in document.documentElement) {
				eventTarget.removeEventListener('touchstart', touchStartHandler)
				window.removeEventListener('touchmove', touchMoveHandler)
				window.removeEventListener('touchend', endHandler)
				window.removeEventListener('touchcancel', cancelHandler)
			} else {
				eventTarget.removeEventListener('pointerdown', pointerDownHandler)
				window.removeEventListener('pointermove', pointerMoveHandler)
				window.removeEventListener('pointerup', endHandler)
				window.removeEventListener('pointercancel', cancelHandler)
			}
		}
	})
</script>

{#if children}
	{@render children()}
{:else}
	<div class="gesture-canvas" bind:this={gestureCanvas} style:z-index={zIndex}></div>
{/if}

<style lang="scss">
	.gesture-canvas {
		z-index: 50;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100dvh;
	}
</style>
