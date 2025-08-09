<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Direction } from '$lib/events'
	import type { Level } from '$lib/levels'
	import { defaultMode, fibMode, logarithmicMode } from '$lib/modes'
	import { parsePosition } from '$lib/parse'
	import { serializeB64 } from '$lib/serde'
	import type { Square } from '$lib/square'
	import Field from '../../components/Field.svelte'
	import Header from '../../components/Header.svelte'

	type FieldType = 'normal' | 'empty' | 'wall' | 'mouth' | 'black-hole'

	let field = $state<Field>()
	let level = $state<Level>({
		id: 'custom',
		mode: defaultMode,
		name: 'Unbenannt',
		pos: parsePosition(`n`),
		rules: ['default'],
		goal: 256,
	})

	let selected = $state<[number, number]>()
	let fieldType = $state<FieldType>()
	let fieldDirection = $state<Direction>('up')
	let fieldNumber = $state<number>()
	let fieldTarget = $state<number>()

	let globalMode = $state<'default' | 'logarithmic' | 'fibonacchi'>('default')
	let globalSize = $state([4, 4])

	$effect(() => {
		const mode =
			globalMode === 'default'
				? defaultMode
				: globalMode === 'logarithmic'
					? logarithmicMode
					: fibMode
		queueMicrotask(() => {
			level.mode = level.mode.hidden ? { ...mode, hidden: true } : mode
		})
	})

	$effect(() => {
		const squares: Square[][] = []
		for (let i = 0; i < globalSize[0]; i++) {
			const row: Square[] = []
			for (let j = 0; j < globalSize[1]; j++) {
				row[j] = { id: 0, variant: 'normal' }
			}
			squares.push(row)
		}
		level.pos.squares = squares
	})

	$effect(() => {
		let nextFieldType = fieldType
		queueMicrotask(() => {
			if (nextFieldType && selected) {
				const [x, y] = selected
				const square = level.pos.squares[y][x]

				switch (nextFieldType) {
					case 'normal':
						square.variant = nextFieldType
						square.effects = undefined
						square.direction = undefined
						break
					case 'empty':
						square.variant = nextFieldType
						square.effects = undefined
						square.direction = undefined
						square.goal = undefined
						square.num = undefined
						break
					case 'wall':
						square.variant = nextFieldType
						square.effects = undefined
						square.direction = undefined
						square.goal = undefined
						square.num = undefined
						break
					case 'mouth':
						square.variant = nextFieldType
						square.effects = undefined
						square.direction = square.direction ?? fieldDirection
						square.goal = undefined
						square.num = undefined
						break
					case 'black-hole':
						square.variant = 'normal'
						square.effects = ['black-hole']
						square.direction = undefined
						square.goal = undefined
						square.num = undefined
						break
				}

				fieldNumber = square.num
				fieldTarget = square.goal
			}
		})
	})

	$effect(() => {
		let nextFieldDirection = fieldDirection
		queueMicrotask(() => {
			if (nextFieldDirection && selected) {
				const [x, y] = selected
				const square = level.pos.squares[y][x]
				square.direction = nextFieldDirection
			}
		})
	})

	$effect(() => {
		let nextFieldNumber = fieldNumber
		queueMicrotask(() => {
			if (selected) {
				const [x, y] = selected
				const square = level.pos.squares[y][x]
				square.num = nextFieldNumber
			}
		})
	})

	$effect(() => {
		let nextFieldTarget = fieldTarget
		queueMicrotask(() => {
			if (selected) {
				const [x, y] = selected
				const square = level.pos.squares[y][x]
				square.goal = nextFieldTarget
			}
		})
	})

	$effect(() => {
		if (field) {
			let clickHandler = field.on('click', (event) => {
				if (selected && selected[0] === event.x && selected[1] === event.y) {
					selected = undefined
				} else {
					selected = [event.x, event.y]
					const square = level.pos.squares[event.y][event.x]
					const { direction, goal, num } = square
					fieldType = getFieldType(square)
					if (direction) {
						fieldDirection = direction
					}
					fieldTarget = goal
					fieldNumber = num
				}
				return event
			})

			return () => field?.off('click', clickHandler)
		}
	})

	function makeHighlights([x, y]: [number, number]): string[][] {
		const result = level.pos.squares.map((row) => row.map(() => ''))
		result[x][y] = 'outline: 0.25rem solid white'
		return result
	}

	function getFieldType(square: Square): FieldType {
		if (square.effects?.includes('black-hole')) {
			return 'black-hole'
		} else {
			return square.variant
		}
	}

	function tryIt() {
		const serialized = serializeB64(level)
		const params = new URLSearchParams()
		params.set('level', serialized)
		goto(`/level-builder/test?${params}`)
	}
</script>

<!-- TODO: Reset action -->
<Header back>Level-Editor</Header>

<Field
	bind:this={field}
	{level}
	noGestures
	highlights={selected ? makeHighlights(selected) : undefined}
/>

{#if selected}
	<div class="selected-editor">
		<p><em>Feld:</em></p>
		<label><input type="radio" value="normal" bind:group={fieldType} /> Normal</label>
		<label><input type="radio" value="empty" bind:group={fieldType} /> Leer</label>
		<label><input type="radio" value="wall" bind:group={fieldType} /> Blockade</label>
		<label><input type="radio" value="mouth" bind:group={fieldType} /> Mund</label>
		<label><input type="radio" value="black-hole" bind:group={fieldType} /> Schwarzes Loch</label>

		{#if fieldType === 'mouth'}
			<p><em>Richtung:</em></p>
			<label><input type="radio" value="left" bind:group={fieldDirection} /> Rechts</label>
			<label><input type="radio" value="right" bind:group={fieldDirection} /> Links</label>
			<label><input type="radio" value="up" bind:group={fieldDirection} /> Unten</label>
			<label><input type="radio" value="down" bind:group={fieldDirection} /> Oben</label>
		{/if}

		<p>
			<label>
				<input
					type="checkbox"
					checked={fieldNumber !== undefined}
					onchange={(e) => (fieldNumber = e.currentTarget.checked ? 2 : undefined)}
				/>
				<em>Enthält Zahl zu Beginn</em>
			</label>
		</p>
		{#if fieldNumber !== undefined}
			<input type="number" bind:value={fieldNumber} />
		{/if}

		<p>
			<label>
				<input
					type="checkbox"
					checked={fieldTarget !== undefined}
					onchange={(e) => (fieldTarget = e.currentTarget.checked ? 64 : undefined)}
				/>
				<em>Zielfeld</em>
			</label>
		</p>
		{#if fieldTarget !== undefined}
			<input type="number" bind:value={fieldTarget} />
		{/if}
	</div>
{/if}

<div class="global-editor">
	<p><em>Name des Levels:</em></p>
	<input type="text" bind:value={level.name} maxlength="50" />

	<p>
		<em>Größe:</em>
		<input type="number" class="small" bind:value={globalSize[0]} min="2" max="12" /> ×
		<input type="number" class="small" bind:value={globalSize[1]} min="2" max="12" />
	</p>

	<p><em>Modus:</em></p>
	<label><input type="radio" value="default" bind:group={globalMode} /> Normal</label>
	<label><input type="radio" value="logarithmic" bind:group={globalMode} /> Logarithmisch</label>
	<label><input type="radio" value="fibonacchi" bind:group={globalMode} /> Fibonacchi</label>

	<p>
		<label>
			<input type="checkbox" bind:checked={level.mode.hidden} />
			<em>Zahlen verstecken</em>
		</label>
	</p>

	<p>
		<em>Ziel:</em>
	</p>
	<label>
		<input
			type="radio"
			group="global-goal"
			checked={typeof level.goal === 'number'}
			onchange={() => (level.goal = 256)}
		/> Wert wählen
	</label>
	<label>
		<input
			type="radio"
			group="global-goal"
			checked={typeof level.goal === 'object'}
			onchange={() => (level.goal = { fields: 2 })}
		/> Zielfelder
	</label>
	<label>
		<input
			type="radio"
			group="global-goal"
			checked={level.goal === undefined}
			onchange={() => (level.goal = undefined)}
		/> Keins
	</label>
	{#if typeof level.goal === 'number'}
		<input type="number" bind:value={level.goal} />
	{/if}
</div>

<button class="try-it-button" onclick={tryIt}>Ausprobieren</button>

<div class="hints">
	<p><em>Hinweise:</em></p>
	<ul>
		<li>Zu Beginn muss mindestens eine Zahl im Spielfeld sein.</li>
		<li>Der Level muss <em>lösbar</em> sein.</li>
		<li>Wenn <em>Zielfelder</em> als Ziel gewählt ist, muss mindestens 1 Zielfeld existieren.</li>
	</ul>
</div>

<style lang="scss">
	.selected-editor,
	.global-editor,
	.hints {
		box-sizing: border-box;
		background-color: #6c016c;
		padding: 0 1rem 1rem 1rem;
		margin: 1.5rem auto;
		width: 90%;
		border-radius: 0.5rem;

		label {
			display: inline-block;
			margin: 0 0.5rem 0 0;
			padding: 0.2rem 0;
		}
	}

	.selected-editor {
		margin-bottom: 0;
	}

	input[type='number'],
	input[type='text'] {
		background-color: #0002;
		border: none;
		font: inherit;
		color: inherit;
		padding: 0.2rem 0.6rem;
		border-radius: 0.2rem;
		width: 100%;
		box-sizing: border-box;

		&:hover,
		&:focus {
			outline: none;
			background-color: #0004;
		}
	}

	input[type='number'].small {
		width: 80px;
	}

	.try-it-button {
		margin: 1rem auto;
		padding: 1rem;
		background-color: #fff2;
		box-sizing: border-box;
		width: 90%;
		font: inherit;
		font-size: 1.2rem;

		&:hover,
		&:focus {
			background-color: #fff3;
		}
	}

	.hints {
		padding-bottom: 0;
	}
</style>
