<script lang="ts">
	import type { LevelRule } from '$lib/levels'

	interface Props {
		rule: LevelRule
	}

	let { rule }: Props = $props()

	let [title, description] = $derived.by(() => {
		switch (rule) {
			case 'default':
				return ['Normale Regeln', 'Das Kombinieren von zwei gleichen Zahlen ergibt ihre Summe.']
			case 'logarithmic':
				return [
					'Logarithmus',
					'Beim Kombinieren von zwei gleichen Zahlen entsteht eine um 1 größere Zahl.',
				]
			case 'fibonacchi':
				return [
					'Fibonacchi-Reihe',
					'In der Fibonacchi-Reihe ist jede Zahl die Summe der zwei Zahlen davor: <em>1, 1, 2, 3, 5, 8, 13, 21, ...</em>. In diesem Modus können nur aufeinanderfolgende Fibonacchi-Zahlen kombiniert werden.',
				]
			case '20ez':
				return [
					'20ez',
					'In diesem speziellen Spielmodus werden oft deutlich höhere Zahlen generiert. Die neue Zahl hängt davon ab, was sich rechts davon und darunter befindet. Probiere es aus!',
				]

			case 'tutorial':
				return ['Tutorial', 'Dieser Level ist nur zur Erklärung.']
			case 'hidden':
				return ['Versteckte Zahlen', 'Hoffentlich erinnerst du dich an die Reihenfolge der Farben.']
			case 'antimatter':
				return [
					'Antimaterie',
					'Wenn eine normale Zahl mit einer Antimaterie-Zahl kombiniert wird, löschen sie sich aus!',
				]
			case 'empty':
				return ['Lücken', 'Das Raster hat Lücken, diese werden von Zahlen übersprungen.']
			case 'walls':
				return ['Wände', 'Die Mauersteine blockieren die Bewegung der Zalhlen.']
			case 'black-holes':
				return ['Schwarze Löcher', 'Ein schwarzes Loch verschluckt die Steine, die in ihm landen.']
			case 'target-fields':
				return [
					'Zielfelder',
					'Um zu gewinnen, muss auf jedem Zielfeld mindestens die abgebildete Zahl sein.',
				]
			case 'mouths':
				return ['Münder', 'Ein Mund verschlingt alle Zahlen, die auf ihn zukommen']
		}
	})
</script>

<div class="row">
	<em>{title}</em>: {@html description}
</div>

<style lang="scss">
	.row {
		margin: 1rem 0;
	}
</style>
