<script lang="ts">
	import { levels, type Level } from '$lib/levels'
	import { onMount } from 'svelte'
	import NormalLevel from '../../levels/NormalLevel.svelte'
	import { goto } from '$app/navigation'
	import { deserializeB64 } from '$lib/serde'
	import type { LevelDto } from '$lib/api/types'
	import type { LevelData } from '../../components/GameOptions.svelte'
	import { levelDtoToData } from '$lib/levelDto'

	let level = $state<Level>()
	let error = $state<string>()
	let levelData = $state<LevelData>()

	onMount(async () => {
		let queryParams = new URLSearchParams(window.location.search)
		if (queryParams.has('id')) {
			let levelId = queryParams.get('id')
			level = levels.find((lvl) => lvl.id === levelId)
			if (!level) {
				error = 'Level nicht gefunden'
			}
		} else if (queryParams.has('l')) {
			const url = new URL('/api/levels', window.location.href)
			url.searchParams.set('level_id', queryParams.get('l')!)

			const response = await fetch(url)
			if (!response.ok) {
				if (response.status === 404) {
					error = 'Level nicht gefunden'
				} else {
					error = 'Fehler beim Laden des Levels'
				}
			} else {
				const levelDto: LevelDto = await response.json()
				level = deserializeB64(levelDto.data)
				levelData = levelDtoToData(levelDto)
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
	<NormalLevel {level} {levelData} {navigate} continueBack />
{/if}

<style lang="scss">
</style>
