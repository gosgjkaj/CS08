<script>
	import { session } from '../stores'
	import { client } from '../gqlClient'
	import { query } from 'svelte-apollo'
	import { gql } from 'apollo-boost'
	import { goto } from '@sapper/app'


	let year = 2019
	let courses = query(client(), {query: gql`
		query($year: Int!){
			coursesFromYear(year: $year){
				courseID
				weight
				id
			}
		}`,
		variables: { year }
	})
	function gotoCourse(idcourse) {
			goto(`/courses/${idcourse}`)
			
			
		}

	let yearRuns =[
		{id:2019, text: "year 2019-2020"},
		{id:2020, text: "year 2020-2021"}]

</script>

<svelte:head>
	<title>School of Chemistry Database</title>
</svelte:head>



<div class="box">
	<p class="content">
		<a href="/admin">Admin Page</a>
	</p>
</div>

{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>
<div>
	<select bind:value={year} on:change={()=>courses.refetch({year})} >
	{#each yearRuns as yearRun}
		<option value={yearRun.id}> {yearRun.text}</option>
	{/each}
		</select>

	{#await $courses}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then result}
	<div class="box has-background-info">
		<p class="title has-text-white">Courses for Year {year}-{year+1}</p>
	</div>
		<div class="box buttons">
		{#each result.data.coursesFromYear as course}

		<button on:click={gotoCourse(course.id)} class="button is-large is-info is-outlined">{course.courseID} </button>
		{/each}
		</div>
	{:catch}
		<p class="content has-background-danger ">failed to load courses</p>
	{/await}
	</div>
{/if}