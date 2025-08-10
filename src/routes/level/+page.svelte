<script lang="ts">
	import { levels, type Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import NormalLevel from '../../levels/NormalLevel.svelte'
	import { goto } from '$app/navigation'
	import { deserializeB64 } from '$lib/serde'

	let level = $state<Level>()
	let error = $state<string>()

	onMount(() => {
		let queryParams = new URLSearchParams(window.location.search)
		if (queryParams.has('id')) {
			let levelId = queryParams.get('id')
			level = levels.find((lvl) => lvl.id === levelId)
			if (!level) {
				error = 'Level nicht gefunden'
			}
		} else if (queryParams.has('code')) {
			level = deserializeB64(queryParams.get('code')!)
		} else {
			error = 'URL ungültig'
		}
	})

	function navigate(levelId: string) {
		goto(`/level?id=${levelId}`, { replaceState: true })
		level = levels.find((lvl) => lvl.id === levelId)
		if (!level) {
			error = 'Level nicht gefunden'
		}
	}
</script>

{#if error}
	<p>Fehler: {error}</p>
{/if}

{#if level}
	<NormalLevel {level} {navigate} />
{/if}

<style lang="scss">
</style>
