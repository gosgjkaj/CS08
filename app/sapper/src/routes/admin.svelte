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

<!-- checking premissions for user -->
{#if $session.user!=null}
	<section class="hero is-primary">
	<div class="hero-body">
		<div class="container">
		<h1 class="title">
			Admin Page
		</h1>
		<h2 class="subtitle">
			This page is only accessible by an admin.
		</h2>
		</div>
	</div>
	</section>

	<!-- main container for page -->
	<div class="container" style="display: flex; flex-direction: row; flex-wrap:wrap; justify-content: center;">

		<!-- showing all existing user with their premission and be able to edit -->
		<div style="width:35%">
			<h1 style="font-size: 40px; font-weight: bold; text-align: center; margin:20px">Manage Users</h1>
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

		<!-- gap between -->
		<div style="width:15%"></div>

		<!-- register new user -->
		<div style="width:35%">
			<RegisterUser afterRegister={() => users.refetch()}/>
		</div>

	</div>
{/if}

<footer class="footer">
  <div class="content has-text-centered">
    <p class="has-text-centered">
    School of Chemistry, University of Glasgow
    </p>
  </div>
</footer>