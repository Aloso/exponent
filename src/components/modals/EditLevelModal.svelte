<script lang="ts">
	import { levelDtoToData } from '$lib/levelDto'
	import type { LevelData } from '../GameOptions.svelte'
	import Modal from '../Modal.svelte'

	interface Props {
		levelData: LevelData
		afterEdit: (data: LevelData) => void
		cancel: () => void
	}

	let { levelData, afterEdit, cancel }: Props = $props()

	let editStatus = $state<{ progress?: boolean; done?: boolean; error?: string }>({})

	let name = $state(levelData.name)
	let desc = $state(levelData.desc ?? '')
	let difficulty = $state(levelData.difficulty)

	async function editLevel() {
		editStatus = { progress: true }
		const response = await fetch(`/api/levels?level_id=${levelData.levelId}`, {
			method: 'PUT',
			body: JSON.stringify({
				level_id: levelData.levelId,
				name,
				desc: desc === '' ? undefined : desc,
				difficulty,
			}),
		})
		if (!response.ok) {
			editStatus = { progress: false, error: 'Fehler beim Bearbeiten!' }
			return
		}
		const levelDto = await response.json()
		editStatus = { done: true }
		setTimeout(() => {
			afterEdit(levelDtoToData(levelDto))
		}, 1000)
	}
</script>

<Modal
	title="Level bearbeiten"
	actions={[
		{
			name: 'Abbrechen',
			action: cancel,
			disabled: editStatus.progress || editStatus.done,
		},
		{
			name: 'Übernehmen',
			action: editLevel,
			disabled: editStatus.progress || editStatus.done,
			primary: true,
		},
	]}
>
	<p>
		Name:
		<input type="text" bind:value={name} />
	</p>
	<p>
		Beschreibung:
		<textarea bind:value={desc} rows="5"></textarea>
	</p>
	<p>
		Schwierigkeitsgrad (0-10):
		<input type="number" min="0" max="10" bind:value={difficulty} />
	</p>
	<p>
		{#if editStatus.error}
			{editStatus.error}
		{:else if editStatus.progress}
			Wird gespeichert...
		{:else if editStatus.done}
			Der Level wurde gespeichert.
		{/if}
	</p>
</Modal>

<style lang="scss">
	input,
	textarea {
		padding-block: 0.5rem;
	}
</style>
