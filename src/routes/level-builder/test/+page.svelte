<script lang="ts">
	import type { Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import LevelTest from '../../../levels/LevelTest.svelte'
	import { deserializeB64 } from '$lib/serde'

	let level = $state<Level>()
	let error = $state<string>()
	let loggedIn = $state<boolean>()
	let cheat = $state(false)

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

		loggedIn = localStorage.getItem('userAccount') !== null
		cheat = localStorage.getItem('cheat') === 'true'
	})
</script>

{#if error}
	<p class="centered">Fehler: {error}</p>
{:else if loggedIn === false}
	<p class="centered">Melde dich an, um Level zu erstellen. <a href="/account">Zum Login</a></p>
{/if}

{#if level}
	<LevelTest {level} {loggedIn} {cheat} />
{/if}

<style lang="scss">
	.centered {
		text-align: center;
		z-index: 60;
	}
</style>
