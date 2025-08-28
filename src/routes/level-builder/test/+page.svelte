<script lang="ts">
	import type { Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import LevelTest from '../../../levels/LevelTest.svelte'
	import { deserializeB64 } from '$lib/serde'
	import type { SafeUser } from '$lib/api/types'

	let level = $state<Level>()
	let error = $state<string>()
	let user = $state<SafeUser>()
	let loggedIn = $state<boolean>()

	$inspect(user)

	onMount(async () => {
		let queryParams = new URLSearchParams(window.location.search)
		let serialized = queryParams.get('level')
		if (!serialized) {
			error = 'Kein Level angegeben'
		} else {
			try {
				level = deserializeB64(serialized)
			} catch (err) {
				error = Error.isError(err) ? err.message : 'Unerwarteter Fehler'
			}
		}

		try {
			const response = await fetch('/api/user')
			if (response.ok) {
				user = await response.json()
				loggedIn = true
			} else {
				loggedIn = false
			}
		} catch {
			loggedIn = false
		}
	})
</script>

{#if error}
	<p class="centered">Fehler: {error}</p>
{:else if loggedIn === false}
	<p class="centered">Melde dich an, um Level zu erstellen. <a href="/account">Zum Login</a></p>
{/if}

{#if level}
	<LevelTest {level} {loggedIn} />
{/if}

<style lang="scss">
	.centered {
		text-align: center;
		z-index: 60;
	}
</style>
