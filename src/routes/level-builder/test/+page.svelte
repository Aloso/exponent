<script lang="ts">
	import type { Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import LevelTest from '../../../levels/LevelTest.svelte'
	import { deserializeB64, deserializeLevel } from '$lib/serde'

	let level = $state<Level>()
	let error = $state<string>()

	onMount(() => {
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
	})
</script>

{#if error}
	<p>Fehler: {error}</p>
{/if}

{#if level}
	<LevelTest {level} />
{/if}

<style lang="scss">
</style>
