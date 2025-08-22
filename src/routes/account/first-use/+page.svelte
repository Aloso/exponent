<script lang="ts">
	import Header from '../../../components/Header.svelte'
	import type { Data } from './+page.server'
	import CodeOfConduct from '../../../components/CodeOfConduct.svelte'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
</script>

<Header>Account einrichten</Header>

{#if data.user}
	<div class="content">
		<h2>Willkommen, {data.user.display_name}.</h2>
		<p>Deinen Nutzernamen kannst du später noch bearbeiten.</p>
		<p>Stimme den Richtlinien zu, um fortzufahren:</p>
		<details>
			<summary>Verhaltens-Richtlinien</summary>

			<CodeOfConduct />
		</details>

		<p>
			<a class="button action-button" href="/account">Akzeptieren</a>
		</p>
	</div>
{:else}
	Ein Fehler ist aufgetreten
{/if}

<style lang="scss">
	.content {
		width: 90%;
		margin: 0 auto;
	}

	.action-button {
		background-color: #fff2;
		padding-block: 0.4rem;
		font-size: 0.9rem;
	}

	details {
		margin: 1em 0 2rem 0;

		summary {
			color: #ffff0c;
			cursor: pointer;
		}
	}
</style>
