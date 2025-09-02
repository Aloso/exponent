<script lang="ts">
	import { onMount } from 'svelte'
	import Modal from '../Modal.svelte'
	import type { ReportDto } from '$lib/api/types'

	interface Props {
		levelId: number
		authorId: number
		afterReport: () => void
		cancel: () => void
	}

	let { levelId, authorId, afterReport, cancel }: Props = $props()

	let reportStatus = $state<{ progress?: boolean; done?: boolean; error?: string }>({})

	let reason = $state('')
	let reportedBefore = $state(false)

	onMount(async () => {
		const response = await fetch(`/api/user/report?user_id=${authorId}&level_id=${levelId}`)
		if (!response.ok) return
		const report: ReportDto = await response.json()
		reason = report.reason
		reportedBefore = true
	})

	async function reportLevel() {
		reportStatus = { progress: true }
		const response = await fetch('/api/user/report', {
			method: 'POST',
			body: JSON.stringify({
				user_id: authorId,
				level_id: levelId,
				reason,
			}),
		})
		if (!response.ok) {
			reportStatus = { progress: false, error: 'Fehler beim Melden!' }
			return
		}
		const { success } = await response.json()
		if (!success) {
			reportStatus = { progress: false, error: 'Die Meldung konnte nicht gespeichert werden.' }
		}
		reportStatus = { done: true }
		setTimeout(afterReport, 1000)
	}
</script>

<Modal
	title="Level melden"
	actions={[
		{
			name: 'Abbrechen',
			action: cancel,
			disabled: reportStatus.progress || reportStatus.done,
		},
		{
			name: reportedBefore ? 'Übernehmen' : 'Melden',
			action: reportLevel,
			disabled: reportStatus.progress || reportStatus.done || reason.length === 0,
			primary: true,
		},
	]}
>
	{#if reportedBefore}
		<p><em>Du hast den Level bereits gemeldet!</em></p>
	{/if}
	<p>
		Warum meldest du den Level?<br />
		Z.B. Verstoß gegen Richtlinien oder Gesetz
		<textarea bind:value={reason} rows="5"></textarea>
	</p>
	<p>
		{#if reportStatus.error}
			{reportStatus.error}
		{:else if reportStatus.progress}
			Wird gemeldet...
		{:else if reportStatus.done}
			Der Level wurde gemeldet.
		{/if}
	</p>
</Modal>

<style lang="scss">
	textarea {
		padding-block: 0.5rem;
	}
</style>
