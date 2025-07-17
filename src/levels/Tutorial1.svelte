<script lang="ts">
	import { emptyPos, update, type LevelOverlayProps } from '$lib/levels'
	import { onMount } from 'svelte'
	import TutorialOverlay from '../components/TutorialOverlay.svelte'

	let { field, onFinished }: LevelOverlayProps = $props()

	let step = $state(0)
	let isInteractive = $derived(step === 1 || step === 2 || step === 3)

	onMount(() => {
		const handler = field.on('move', (event) => {
			if (
				(step === 1 && event.direction === 'right') ||
				(step === 2 && event.direction === 'down') ||
				step === 3
			) {
				if (step === 1) {
					event.newPos = update(emptyPos, (pos) => {
						pos.squares[2][3].num = 2
						pos.squares[2][3].animation = { kind: 'move', x: -1, y: 0 }
						pos.squares[0][3].num = 2
						pos.squares[0][3].animation = { kind: 'appear' }
					})
					setTimeout(() => step++, 500)
				} else if (step === 2) {
					setTimeout(() => step++, 500)
				} else if (step === 3) {
					if (event.newPos.squares.some((row) => row.some((s) => s.num === 16))) {
						setTimeout(() => step++, 500)
					}
				}
				return event
			}
		})

		return () => {
			field.off('move', handler)
		}
	})

	let prevStep = 0
	$effect(() => {
		if (step === prevStep) return
		prevStep = step

		switch (step) {
			case 1:
				field.setPos(
					update(emptyPos, (pos) => {
						pos.squares[2][2].num = 2
					}),
				)
				break
			case 2:
				field.setPos(
					update(emptyPos, (pos) => {
						pos.squares[2][3].num = 2
						pos.squares[0][3].num = 2
					}),
				)
				break
			case 3:
				// field.setGoal(16)
				break
			case 4:
				// field.setGoal(undefined)
				break
		}
	})
</script>

<TutorialOverlay
	bind:step
	lastStep={4}
	lastLabel="Ja"
	{isInteractive}
	isForwardDisabled={isInteractive}
	{onFinished}
>
	{#if step === 0}
		<p>Willkommen zu <em>Exponent</em>!</p>
	{:else if step === 1}
		<svg viewBox="0 0 50 16" class="arrow">
			<path
				stroke="white"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M1,8 C15,5 35,11 49,8 L43,1 L49,8 L43,15 L49,8"
			/>
		</svg>
		<p>Oben siehst du ein 4×4 Spielfeld. Probiere, <em>nach rechts zu swipen</em>!</p>
	{:else if step === 2}
		<p>Super!</p>
		<p>
			Beim Swipen bewegen sich die Zahlen in die entsprechende Richtung. Danach erscheint eine neue
			Zahl in einem beliebigen Feld.
		</p>
		<p>Swipe nun <em>nach unten</em>!</p>
	{:else if step === 3}
		<p>
			Aufeinander treffende Zahlen werden <em>kombiniert</em>. Versuche, eine
			<em>16</em> zu erreichen!
		</p>
		<p>Achtung: Wenn im Spielfeld kein Platz mehr ist, hast du verloren.</p>
	{:else if step === 4}
		<p>Du hast eine <em>16</em> erreicht!</p>
		<p>Bist du bereit für den <em>ersten Level</em>?</p>
	{/if}
</TutorialOverlay>

<style lang="scss">
	.arrow {
		display: block;
		width: 55%;
		height: auto;
		margin: 0 auto;
		opacity: 0.2;
	}
</style>
