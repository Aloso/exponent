<script lang="ts">
	import { goto } from '$app/navigation'
	import Header from '../../../components/Header.svelte'
</script>

<Header back>
	Account
	{#snippet action2()}
		<button
			class="logout-button"
			onclick={() => {
				localStorage.removeItem('account')
				goto('/api/logout')
			}}
		>
			Ausloggen
		</button>
	{/snippet}
</Header>

<div class="content">
	<h2>Gesperrt</h2>
	<p>Dein Account wurde deaktiviert.</p>
	<p>Mögliche Gründe sind:</p>
	<ul>
		<li>Verstöße gegen unsere <a href="/account/code-of-conduct">Verhaltens-Richtlinien</a></li>
		<li>Verstöße gegen geltendes Recht</li>
	</ul>
	<p>
		Wenn du glaubst, dass die Sperrung unbegründet ist, kannst du
		<a href="mailto:support@aloso.foo?subject=Beschwerde wg. Sperrung meines Exponent-Accounts">
			eine Beschwerde einreichen.
		</a>
	</p>
</div>

<style lang="scss">
	.content {
		width: 90%;
		margin: 0 auto;

		h2 {
			font-size: 1.25rem;
		}
	}

	.logout-button {
		background-color: #fff2;
		padding-block: 0.4rem;
		font-size: 0.9rem;
	}
</style>
