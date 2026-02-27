<script lang="ts">
	import type { Direction } from '$lib/events'
	import type { Level } from '$lib/levels'
	import { defaultMode, fibMode, logarithmicMode } from '$lib/modes'
	import { parsePosition } from '$lib/parse'
	import { serializeB64 } from '$lib/serde'
	import type { Block, Square } from '$lib/square'
	import Field from '../../components/Field.svelte'
	import Header from '../../components/Header.svelte'
	import SquareComponent from '../../components/Square.svelte'

	type FieldType = 'normal' | 'empty' | 'wall' | 'mouth' | 'black-hole'

	let field = $state<Field>()
	let level = $state<Level>({
		id: 'custom',
		mode: defaultMode,
		name: '',
		pos: parsePosition(`n`),
		rules: ['default'],
		goal: 256,
	})
	let serialized = $derived(serializeB64(level))

	let selected = $state<[number, number]>()
	let fieldType = $state<FieldType>()
	let fieldDirection = $state<Direction>('left')
	let fieldBlock = $state<Block>()
	let fieldTarget = $state<number>()

	let globalMode = $state<'default' | 'logarithmic' | 'fibonacchi'>('default')
	let globalSize = $state([4, 4])

	let problems = $derived.by(() => {
		let problems: string[] = []

		let goals = 0
		let numbers = 0

		let { squares } = level.pos
		for (const field of squares.flat()) {
			if (field.goal !== undefined) goals += 1
			if (field.block !== undefined) numbers += 1
		}

		if (numbers === 0) {
			problems.push('Auf dem Spielfeld muss zu Beginn mindestens eine Zahl sein')
		}
		if (typeof level.goal !== 'number' && goals === 0) {
			problems.push('Wenn kein Ziel gesetzt ist, muss mindestens ein Zielfeld vorhanden sein')
		}
		if (level.name === '') {
			problems.push('Der Level benötigt einen Namen')
		}
		if (globalSize[0] > globalSize[1] * 1.5) {
			problems.push('Das Spielfeld ist zu hoch, um auf gewöhnliche Handy-Bildschirme zu passen')
		}

		return problems
	})

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
						square.direction = undefined
						break
					case 'empty':
					case 'wall':
					case 'black-hole':
						square.variant = nextFieldType
						square.direction = undefined
						square.goal = undefined
						square.block = undefined
						break
					case 'mouth':
						square.variant = nextFieldType
						square.direction = square.direction ?? fieldDirection
						square.goal = undefined
						square.block = undefined
						break
				}

				fieldBlock = square.block
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
		let nextFieldBlock = fieldBlock
		queueMicrotask(() => {
			if (selected) {
				const [x, y] = selected
				const square = level.pos.squares[y][x]
				square.block = nextFieldBlock
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
					const { direction, goal, block } = square
					fieldType = square.variant
					if (direction) {
						fieldDirection = direction
					}
					fieldTarget = goal
					fieldBlock = block
				}
				return event
			})

			return () => field?.off('click', clickHandler)
		}
	})

	let highlights = $derived.by(() => {
		if (!selected) return undefined
		const [x, y] = selected
		const result = level.pos.squares.map((row) => row.map(() => ''))
		result[y][x] = 'outline: 0.25rem solid white'
		return result
	})
</script>

<!-- TODO: Reset action -->
<Header back>Level-Editor</Header>

<div class="rows-columns-editor">
	<div>
		<em>Reihen:</em>
		<button class="plus-minus" onclick={() => globalSize[0]--} disabled={globalSize[0] === 1}>
			–
		</button>
		{globalSize[0]}
		<button class="plus-minus" onclick={() => globalSize[0]++} disabled={globalSize[0] === 10}>
			+
		</button>
	</div>
	<div>
		<em>Spalten:</em>
		<button class="plus-minus" onclick={() => globalSize[1]--} disabled={globalSize[1] === 1}>
			–
		</button>
		{globalSize[1]}
		<button class="plus-minus" onclick={() => globalSize[1]++} disabled={globalSize[1] === 8}>
			+
		</button>
	</div>
</div>

<Field bind:this={field} {level} noGestures {highlights} />

{#if selected}
	<div class="selected-editor section">
		<div class="minisquare-wrapper">
			<SquareComponent
				mode={level.mode}
				square={{ id: 0, variant: 'normal' }}
				highlights={fieldType === 'normal' ? 'outline: white solid 0.2rem' : undefined}
				onclick={() => (fieldType = 'normal')}
			/>
			<SquareComponent
				mode={level.mode}
				square={{ id: 0, variant: 'empty' }}
				highlights={fieldType === 'empty'
					? 'outline: white solid 0.2rem'
					: 'outline: #fff2 solid 0.1rem'}
				onclick={() => (fieldType = 'empty')}
			/>
			<SquareComponent
				mode={level.mode}
				square={{ id: 0, variant: 'mouth', direction: 'left' }}
				highlights={fieldType === 'mouth' ? 'outline: white solid 0.2rem' : undefined}
				onclick={() => (fieldType = 'mouth')}
			/>
			<SquareComponent
				mode={level.mode}
				square={{ id: 0, variant: 'black-hole' }}
				highlights={fieldType === 'black-hole' ? 'outline: white solid 0.2rem' : undefined}
				onclick={() => (fieldType = 'black-hole')}
			/>
			<SquareComponent
				mode={level.mode}
				square={{ id: 0, variant: 'wall' }}
				highlights={fieldType === 'wall' ? 'outline: white solid 0.2rem' : undefined}
				onclick={() => (fieldType = 'wall')}
			/>
		</div>

		{#if fieldType === 'mouth'}
			<div class="directions">
				<label><input type="radio" value="left" bind:group={fieldDirection} /> Rechts</label>
				<label><input type="radio" value="right" bind:group={fieldDirection} /> Links</label>
				<label><input type="radio" value="up" bind:group={fieldDirection} /> Unten</label>
				<label><input type="radio" value="down" bind:group={fieldDirection} /> Oben</label>
			</div>
		{/if}

		{#if fieldType === 'normal'}
			<div class="right-aligned-inputs">
				<label>
					<input
						type="checkbox"
						checked={fieldBlock !== undefined}
						onchange={(e) => (fieldBlock = e.currentTarget.checked ? { num: 2 } : undefined)}
					/>
					<em>Zahl zu Beginn</em>
					{#if fieldBlock !== undefined}
						<input class="small-number" type="number" bind:value={fieldBlock} />
					{:else}
						<input class="small-number" type="number" disabled />
					{/if}
				</label>

				<label>
					<input
						type="checkbox"
						checked={fieldTarget !== undefined}
						onchange={(e) => (fieldTarget = e.currentTarget.checked ? 64 : undefined)}
					/>
					<em>Zielfeld</em>
					{#if fieldTarget !== undefined}
						<input class="small-number" type="number" bind:value={fieldTarget} />
					{:else}
						<input class="small-number" type="number" disabled />
					{/if}
				</label>
			</div>
		{/if}
	</div>
{/if}

<div class="global-editor section">
	<p><em>Name des Levels:</em></p>
	<input type="text" bind:value={level.name} maxlength="50" />

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

	<div class="right-aligned-inputs">
		<label>
			<input
				type="checkbox"
				checked={typeof level.goal === 'number'}
				onchange={(e) => {
					level.goal = e.currentTarget.checked ? 256 : { fields: 2 }
				}}
			/>
			<em>Ziel</em>
			{#if typeof level.goal === 'number'}
				<input class="small-number" type="number" bind:value={level.goal} />
			{:else}
				<input class="small-number" type="number" disabled />
			{/if}
		</label>
	</div>
</div>

<a
	class="button try-it-button"
	class:disabled={problems.length > 0}
	href="/level-builder/test?level={serialized}"
	target="_blank"
>
	Ausprobieren
</a>

{#if problems.length > 0}
	<div class="problems section">
		Probleme
		<ul>
			{#each problems as problem}
				<li>{problem}</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="scss">
	.rows-columns-editor {
		margin: 1rem auto;
		width: 90%;
		display: flex;

		> div {
			flex-grow: 1;
			text-align: center;
		}
	}

	.minisquare-wrapper {
		position: relative;
		display: grid;
		width: 90%;
		margin: 1rem auto;
		grid-template-columns: repeat(5, 1fr);
	}

	.section {
		position: relative;
		box-sizing: border-box;
		background-color: #6c016c;
		padding: 1px 1rem;
		margin: 1.5rem auto 0 auto;
		width: 90%;
		border-radius: 0.5rem;

		label {
			display: inline-block;
			margin: 0 0.5rem 0 0;
			padding: 0.2rem 0;
		}
	}

	.selected-editor::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border: 1rem solid white;
		border-color: transparent transparent #6c016c transparent;
		left: 50%;
		top: 0;
		border-top-width: 0;
		margin: -1rem;
	}

	input[type='number'],
	input[type='text'] {
		padding-block: 0.5rem;
	}

	.right-aligned-inputs {
		margin: 1em 0;

		label {
			display: flex;
			margin: 0;
			align-items: center;

			input[type='checkbox'] {
				margin-right: 0.5rem;
			}

			em {
				flex-grow: 1;
			}

			input[type='number'] {
				width: 10em;
			}
		}
	}

	.directions {
		margin: 1rem 0;
		text-align: center;
	}

	.plus-minus {
		background-color: #0002;
		padding: 0.15rem 0.67rem 0.25rem;
		margin: 0.1rem;
	}

	.try-it-button {
		margin: 1rem auto;
		padding: 1rem;
		background-color: #fff2;
		box-sizing: border-box;
		border-radius: 0.5rem;
		width: 90%;
		font: inherit;
		font-size: 1.2rem;

		&:hover,
		&:focus {
			background-color: #fff3;
		}

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}
	}

	.problems {
		margin-block: 0 2rem;
		padding: 1rem 1rem 0 1rem;
	}
</style>
