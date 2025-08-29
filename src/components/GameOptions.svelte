<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Author, SafeUser } from '$lib/api/types'
	import { formatDateRelative } from '$lib/dateTime'
	import type { Direction } from '$lib/events'
	import type { LevelRule } from '$lib/levels'
	import { onMount } from 'svelte'
	import GameRule from './GameRule.svelte'
	import Gestures from './Gestures.svelte'
	import LevelRating from './LevelRating.svelte'

	export interface LevelData {
		levelId: number
		author: Author
		created: number
		votes: number
		myVote?: number
		desc?: string
		difficulty?: number
	}

	interface Props {
		rules: LevelRule[]
		levelData?: LevelData
		onMove: (direction: Direction) => void
	}

	let { rules, levelData, onMove }: Props = $props()
	let open = $state<'rules' | 'menu'>()
	let tutorial = $derived(rules.includes('tutorial'))
	let importantRules = $derived(rules.filter((r) => r !== 'default'))

	let surface = $state<HTMLElement>()

	let me = $state<SafeUser>()

	onMount(() => {
		const stored = localStorage.getItem('userAccount')
		if (stored) {
			me = JSON.parse(stored)
		}
	})
</script>

{#if !tutorial}
	<div class="tab-wrapper">
		<Gestures
			{onMove}
			onClick={(target) => {
				const { tab } = target.dataset
				if (tab === 'author') {
					goto(`/users?id=${levelData!.author.user_id}`)
				} else if (tab === 'menu' || tab === 'rules') {
					open = open === tab ? undefined : tab
				}
			}}
			{surface}
		>
			<div class="tabbbar" bind:this={surface}>
				{#if levelData}
					<div class="level-data">
						von
						<a href="/user?id={levelData.author.user_id}" data-tab="author">
							{levelData.author.display_name}
						</a>
					</div>
					<button class="tab-button" class:active={open === 'menu'} data-tab="menu">Menü</button>
				{/if}
				{#if importantRules.length}
					<button class="tab-button" class:active={open === 'rules'} data-tab="rules">Regeln</button
					>
				{/if}
			</div>
		</Gestures>

		{#if open === 'rules'}
			<div class="rules-box">
				<button class="close-button" onclick={() => (open = undefined)}>×</button>

				{#each importantRules as rule}
					<GameRule {rule} />
				{/each}
			</div>
		{:else if open === 'menu' && levelData}
			<div class="menu-box">
				<button class="close-button" onclick={() => (open = undefined)}>×</button>

				<LevelRating
					levelId={levelData.levelId}
					canVote={me !== undefined && levelData.author.user_id !== me.user_id}
					votes={levelData.votes}
					myVote={levelData.myVote ?? 0}
				/>
				<p>Erstellt: {formatDateRelative(levelData.created)}</p>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../helper';

	.tab-wrapper {
		width: 90%;
		margin: 1rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: center;
		z-index: 51;
	}

	.tabbbar {
		width: 100%;
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	.level-data {
		flex-grow: 1;
	}

	.tab-button {
		background-color: #6c016c;
		padding: 0.45rem 0.8rem;
		font: inherit;
		font-size: 95%;

		&.active {
			box-shadow: inset 0 0 0 0.15rem #fff3;
		}
	}

	.close-button {
		float: right;
		padding-block: 0.5rem;
		margin: 0 -1rem 0 1rem;
		font: inherit;
		font-size: 1.5rem;
		border-radius: 0.5rem;

		&:hover,
		&:focus {
			background-color: #fff1;
		}
	}

	.rules-box,
	.menu-box {
		width: 100%;
		box-sizing: border-box;
		padding: 0 1rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
		background-color: #6c016c;
	}
</style>
