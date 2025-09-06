<script lang="ts">
	interface Props {
		small?: boolean
		levelId: number
		votes: number
		myVote: number
		canVote: boolean
	}

	let { small, levelId, votes, myVote, canVote }: Props = $props()
	let error = $state<string>()

	let myCurrentVote = $state(myVote)
	let myExpectedVote = $state(myVote)

	async function save(newVote: 0 | 1 | -1) {
		error = undefined
		myExpectedVote = newVote

		const url = new URL('/api/levels/vote', window.location.href)
		url.searchParams.set('level_id', String(levelId))
		url.searchParams.set('vote', String(newVote))

		const result = await fetch(url, { method: 'post' })
		if (!result.ok) {
			error = 'Beim Speichern der Bewertung ist ein Fehler aufgetreten.'
		}
		votes = (await result.json()).votes
		myCurrentVote = myExpectedVote = newVote
	}
</script>

<p class="rating" class:small>
	{#if !small}
		<span>Bewertung</span>
	{/if}
	<button
		onclick={() => (myCurrentVote === -1 ? save(0) : save(-1))}
		disabled={!canVote}
		aria-label="Gefällt mir nicht"
		title="Gefällt mir nicht"
	>
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			class="down"
			class:active={myExpectedVote === -1}
		>
			<path
				fill="currentColor"
				d="M12.3657 0.888071C12.6127 0.352732 13.1484 0 13.75 0C14.9922 0 15.9723 0.358596 16.4904 1.29245C16.7159 1.69889 16.8037 2.13526 16.8438 2.51718C16.8826 2.88736 16.8826 3.28115 16.8826 3.62846L16.8825 7H20.0164C21.854 7 23.2408 8.64775 22.9651 10.4549L21.5921 19.4549C21.3697 20.9128 20.1225 22 18.6434 22H8L8 9H8.37734L12.3657 0.888071Z"
			/>
			<path
				fill="currentColor"
				d="M6 9H3.98322C2.32771 9 1 10.3511 1 12V19C1 20.6489 2.32771 22 3.98322 22H6L6 9Z"
			/>
		</svg>
	</button>

	{votes}

	<button
		onclick={() => (myCurrentVote === 1 ? save(0) : save(1))}
		disabled={!canVote}
		aria-label="Gefällt mir"
		title="Gefällt mir"
	>
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			class="up"
			class:active={myExpectedVote === 1}
		>
			<path
				fill="currentColor"
				d="M12.3657 0.888071C12.6127 0.352732 13.1484 0 13.75 0C14.9922 0 15.9723 0.358596 16.4904 1.29245C16.7159 1.69889 16.8037 2.13526 16.8438 2.51718C16.8826 2.88736 16.8826 3.28115 16.8826 3.62846L16.8825 7H20.0164C21.854 7 23.2408 8.64775 22.9651 10.4549L21.5921 19.4549C21.3697 20.9128 20.1225 22 18.6434 22H8L8 9H8.37734L12.3657 0.888071Z"
			/>
			<path
				fill="currentColor"
				d="M6 9H3.98322C2.32771 9 1 10.3511 1 12V19C1 20.6489 2.32771 22 3.98322 22H6L6 9Z"
			/>
		</svg>
	</button>
</p>

{#if error}
	<p>{error}</p>
{/if}

<style lang="scss">
	.rating {
		display: flex;
		gap: 0.5rem;
		align-items: center;

		&.small {
			justify-content: center;
		}

		button {
			padding: 0.3rem 0.5rem;

			&[disabled] {
				opacity: 0.3;
			}
		}

		svg {
			display: block;
			width: 1rem;
			height: 1rem;
			opacity: 0.7;
			border-radius: 50%;

			&.active {
				background-color: #0006;
				box-shadow: 0 0 0 0.5rem #0006;
			}

			&.down {
				transform: rotate(180deg);

				&.active {
					color: #ff9b9b;
				}
			}

			&.up {
				&.active {
					color: #80f6ff;
				}
			}
		}
	}
</style>
