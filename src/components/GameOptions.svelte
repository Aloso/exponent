<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Author, SafeUser } from '$lib/api/types'
	import { formatDateRelative } from '$lib/dateTime'
	import type { Direction } from '$lib/events'
	import type { LevelRule } from '$lib/levels'
	import GameRule from './GameRule.svelte'
	import Gestures from './Gestures.svelte'
	import LevelRating from './LevelRating.svelte'
	import DeleteLevelModal from './modals/DeleteLevelModal.svelte'
	import EditLevelModal from './modals/EditLevelModal.svelte'
	import ReportLevelModal from './modals/ReportLevelModal.svelte'

	export interface LevelData {
		levelId: number
		author: Author
		created: number
		votes: number
		myVote?: number
		name: string
		desc?: string
		difficulty?: number
		mode?: string
	}

	interface Props {
		me?: SafeUser
		rules: LevelRule[]
		levelData?: LevelData
		onMove: (direction: Direction) => void
		onChange?: (levelData: LevelData) => void
	}

	let { me, rules, levelData, onMove, onChange }: Props = $props()
	let open = $state<'rules' | 'menu'>()
	let tutorial = $derived(rules.includes('tutorial'))
	let importantRules = $derived(rules.filter((r) => r !== 'default'))

	let surface = $state<HTMLElement>()

	let active = $state<'deleting' | 'editing' | 'reporting'>()

	function clickGestureSurface(target: HTMLElement) {
		const { tab } = target.dataset
		if (tab === 'author') {
			goto(`/user?id=${levelData!.author.user_id}`)
		} else if (tab === 'menu' || tab === 'rules') {
			open = open === tab ? undefined : tab
			setTimeout(() => {
				if (open) {
					target.scrollIntoView({ behavior: 'smooth', block: 'start' })
				} else {
					window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
				}
			})
		}
	}

	function close() {
		open = undefined
		setTimeout(() => {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
		})
	}
</script>

{#if !tutorial && (levelData || importantRules.length)}
	<div class="tab-wrapper">
		<Gestures {onMove} onClick={clickGestureSurface} {surface}>
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
				<button class="close-button" onclick={close}>×</button>

				{#each importantRules as rule}
					<GameRule {rule} />
				{/each}
			</div>
		{:else if open === 'menu' && levelData}
			<div class="menu-box">
				<button class="close-button" onclick={close}>×</button>

				<LevelRating
					levelId={levelData.levelId}
					canVote={me !== undefined && levelData.author.user_id !== me.user_id}
					votes={levelData.votes}
					myVote={levelData.myVote ?? 0}
				/>
				<p>Erstellt: {formatDateRelative(levelData.created)}</p>
				{#if levelData.desc}
					<p class="desc">{levelData.desc}</p>
				{/if}
				{#if levelData.difficulty !== undefined}
					<p>
						Schwierigkeitsgrad: <em>{levelData.difficulty}</em> <span class="faded">/ 10</span>
					</p>
				{/if}
				<p>
					{#if me}
						{#if me.user_id === levelData.author.user_id || me.trust_level >= 1}
							<button class="action-button edit" onclick={() => (active = 'editing')}>
								Bearbeiten
							</button>
						{/if}
						{#if me.user_id === levelData.author.user_id || me.trust_level >= 2}
							<button class="action-button delete" onclick={() => (active = 'deleting')}>
								Löschen
							</button>
						{/if}
						{#if me.user_id !== levelData.author.user_id}
							<button class="action-button report" onclick={() => (active = 'reporting')}>
								Melden
							</button>
						{/if}
					{/if}
				</p>
			</div>
		{/if}
	</div>
{/if}

{#if active === 'deleting'}
	<DeleteLevelModal
		levelId={levelData!.levelId}
		cancel={() => (active = undefined)}
		afterDelete={() => goto('/account')}
	/>
{:else if active === 'editing'}
	<EditLevelModal
		levelData={levelData!}
		cancel={() => (active = undefined)}
		afterEdit={(data) => {
			onChange?.(data)
			active = undefined
		}}
	/>
{:else if active === 'reporting'}
	<ReportLevelModal
		levelId={levelData!.levelId}
		authorId={levelData!.author.user_id}
		cancel={() => (active = undefined)}
		afterReport={() => (active = undefined)}
	/>
{/if}

<style lang="scss">
	@use '../helper';

	.tab-wrapper {
		width: 90%;
		margin: 1rem 2rem 0;
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
		margin: 1rem 0 0 0;
		border-radius: 0.5rem;
		background-color: #6c016c;
	}

	.desc {
		background-color: #0002;
		padding: 0.4rem 0.8rem;
		border-radius: 0.4rem;
		white-space: pre-wrap;
	}

	.faded {
		opacity: 0.6;
	}

	.action-button {
		background-color: #fff2;
		padding: 0.4rem 0.8rem;

		&.delete {
			background-color: #b00000;
		}
	}
</style>
