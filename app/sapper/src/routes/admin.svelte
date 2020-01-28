<script context="module">
	import { checkPermission } from '../utils.js'

	export async function preload(page, session) {
		const permission = await checkPermission()

		if (permission != "Admin") {
			return this.redirect(302, '/login')
		}

		return { }
	}
</script>

<script>
	import { query } from 'svelte-apollo'
	import { gql } from 'apollo-boost'
	import { client } from '../gqlClient'
	import { session } from '../stores'
	import UserRow from '../components/UserRow.svelte'
	import RegisterUser from '../components/RegisterUser.svelte'
	let users = query(client(), {query: gql`
			query{
				getUsers{
					id
					name
					email
					role
				}
			}`
		})	

</script>

<div class="container">
	<h1 class="title is-size-2">Admin Page</h1>
	

	<div class="columns">
		<div class="column is-5">
			<h3 class="title is-size-5">Manage Users</h3>
			{#await $users}
			<p>Loading users</p>
			{:then result}
				{#each result.data.getUsers as user}
				{#if user.id != $session.user.id}
				<UserRow user={user} afterDelete={() => users.refetch()} class="content"/>
				{/if}
				{/each}
			{/await}
		</div>
		<div class="column is-1"></div>
		<div class="column is-5">
		<h3 class="title is-size-5">Register Users</h3>
		<RegisterUser afterRegister={() => users.refetch()}/>
		</div>
		
	</div>
</div>