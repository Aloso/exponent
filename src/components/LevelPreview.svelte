<script lang="ts">
	import type { LevelDto } from '$lib/api/types'
	import { formatDateRelative } from '$lib/dateTime'
	import { deserializeB64 } from '$lib/serde'
	import Field from './Field.svelte'
	import ModeLabel from './ModeLabel.svelte'
	import DifficultyLabel from './DifficultyLabel.svelte'

	interface Props {
		level: LevelDto
		withAuthor?: boolean
	}

	let { level, withAuthor }: Props = $props()
</script>

<a class="wrapper button" href="/level?l={level.level_id}">
	<Field small level={deserializeB64(level.data)} noGestures />
	<h3>
		{level.name}
		<ModeLabel mode={level.mode} right />
		<DifficultyLabel difficulty={level.difficulty} right />
	</h3>
	<p>
		<span class="date">{formatDateRelative(level.created)}</span>
		{#if level.votes !== 0}
			<span class="votes" class:red={level.votes < 0}>
				{level.votes}
				<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						d="M12.3657 0.888071C12.6127 0.352732 13.1484 0 13.75 0C14.9922 0 15.9723 0.358596 16.4904 1.29245C16.7159 1.69889 16.8037 2.13526 16.8438 2.51718C16.8826 2.88736 16.8826 3.28115 16.8826 3.62846L16.8825 7H20.0164C21.854 7 23.2408 8.64775 22.9651 10.4549L21.5921 19.4549C21.3697 20.9128 20.1225 22 18.6434 22H8L8 9H8.37734L12.3657 0.888071Z"
					/>
					<path
						fill="currentColor"
						d="M6 9H3.98322C2.32771 9 1 10.3511 1 12V19C1 20.6489 2.32771 22 3.98322 22H6L6 9Z"
					/>
				</svg>
			</span>
		{/if}
	</p>
	{#if withAuthor}
		<p>von <em>{level.author.display_name}</em></p>
	{:else if level.desc}
		<p class="ellipsis">{level.desc}</p>
	{/if}
</a>

<style lang="scss">
	.wrapper {
		min-width: 0;
		text-align: left;
		padding: 0;
	}

	h3 {
		font-size: 1.05rem;
		margin: 0.5rem 0 0 0;
	}

	p {
		font-size: 0.9rem;
		margin: 0;
	}

	.date {
		opacity: 0.6;
	}
	.votes {
		float: right;
		display: flex;
		gap: 0.25rem;
		align-items: center;

		&.red {
			color: #ff9696;

			svg {
				transform: rotate(180deg);
			}
		}
	}
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
