<script lang="ts">
	import type { SafeUser } from '$lib/api/types'

	interface Props {
		user: SafeUser
		onclose: () => void
	}

	let { user = $bindable(), onclose }: Props = $props()

	let displayName = $state(user.display_name)
	let error = $derived.by(() => {
		const nonWordCharactersWoSpaces = displayName.replace(
			/[\p{Alphabetic}\p{M}\p{Nd}\p{Pc} ]/gu,
			'',
		)
		if (nonWordCharactersWoSpaces.length > 0) {
			return `Die Zeichen "${nonWordCharactersWoSpaces}" dürfen im Benutzernamen nicht vorkommen!`
		}
		if (displayName.trim().length > 30) {
			return 'Der Benutzername ist zu lang!'
		}
	})

	async function save() {
		const name = displayName.trim()
		const url = new URL('/api/user/display_name', window.location.href)
		url.searchParams.set('name', name)
		await fetch(url, { method: 'POST' })
		onclose()
		user.display_name = name
	}
</script>

<p>
	Benutzername: <input type="text" bind:value={displayName} />
	{#if error}
		<span class="error">{error}</span>
	{/if}
</p>
<p>
	<button class="button action-button" onclick={save} disabled={error !== undefined}>
		Speichern
	</button>
	<button class="button action-button" onclick={onclose}>Abbrechen</button>
</p>

<style lang="scss">
	.action-button {
		background-color: #fff2;
		padding-block: 0.4rem;
		font-size: 0.9rem;
	}

	input {
		display: block;
		margin: 0.5rem 0;
	}

	.error {
		color: #ffbbbb;
	}
</style>
