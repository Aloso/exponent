<script lang="ts">
	interface Props {
		goal?: number | { fields: number }
	}

	let { goal }: Props = $props()
</script>

{#if typeof goal === 'number'}
	<div class="goal">Erreiche die Zahl <em>{goal}</em>.</div>
{:else if goal}
	{#if goal.fields > 1}
		<div class="goal">Fülle die <em>Zielfelder</em> mit der erwarteten Zahl.</div>
	{:else}
		<div class="goal">Fülle das <em>Zielfeld</em> mit der erwarteten Zahl.</div>
	{/if}
{/if}

<style lang="scss">
	.goal {
		margin: 2rem 0 1rem 0;
		text-align: center;
	}
</style>
