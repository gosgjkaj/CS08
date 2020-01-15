<script>
	import { session } from '../stores'
	import { client } from '../gqlClient'
	import { query } from 'svelte-apollo'
	import { gql } from 'apollo-boost'

	let year = 2019
	let courses = query(client(), {query: gql`
		query{
			coursesFromYear(year: ${year}){
				courseID
				weight
			}
		}`
	})
</script>

<svelte:head>
	<title>Sapper/Prisma/Bulma app template</title>
</svelte:head>

<div class="box has-background-warning">
	<p class="content"><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
</div>

<div class="box">
	<p class="content">
		<a href="/admin">Admin Page</a>
	</p>
</div>

{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>

	{#await $courses}
	<p>Loading courses</p>
	{:then result}
		{#each result.data.coursesFromYear as course}
		<p class="content">{course.courseID} with weight {course.weight} </p>
		{/each}
	{/await}
{/if}