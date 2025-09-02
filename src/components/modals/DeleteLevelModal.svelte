<script lang="ts">
	import Modal from '../Modal.svelte'

	interface Props {
		levelId: number
		afterDelete: () => void
		cancel: () => void
	}

	let { levelId, afterDelete, cancel }: Props = $props()

	let deleteStatus = $state<{ progress?: boolean; done?: boolean; error?: string }>({})

	async function deleteLevel() {
		deleteStatus = { progress: true }
		const response = await fetch(`/api/levels?level_id=${levelId}`, { method: 'DELETE' })
		if (!response.ok) {
			deleteStatus = { progress: false, error: 'Fehler beim Löschen!' }
			return
		}
		const { success } = await response.json()
		if (!success) {
			deleteStatus = { error: 'Der Level konnte nicht gelöscht werden.' }
			return
		}
		deleteStatus = { done: true }
		setTimeout(afterDelete, 1000)
	}
</script>

<Modal
	title="Möchtest du den Level löschen?"
	actions={[
		{
			name: 'Abbrechen',
			action: cancel,
			disabled: deleteStatus.progress || deleteStatus.done,
		},
		{
			name: 'Löschen',
			action: deleteLevel,
			disabled: deleteStatus.progress || deleteStatus.done,
			primary: true,
		},
	]}
>
	<p>
		{#if deleteStatus.error}
			{deleteStatus.error}
		{:else if deleteStatus.progress}
			Wird gelöscht...
		{:else if deleteStatus.done}
			Der Level wurde erfolgreich gelöscht.
		{:else}
			Dies kann nicht rückgängig gemacht werden.
		{/if}
	</p>
</Modal>
