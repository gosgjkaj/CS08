<script>
	import { session } from '../stores'
	import { client } from '../gqlClient'
	import { query } from 'svelte-apollo'
	import { gql } from 'apollo-boost'
	import { goto } from '@sapper/app'
</script>

<svelte:head>
	<title>School of Chemistry Database</title>
</svelte:head>

{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permissions.
	</p>
{:else}
	Please log in to use this database.
{/if}
	