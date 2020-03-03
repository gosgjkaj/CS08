<script>
    import { session } from '../stores'
    import { client } from '../gqlClient'
  	import { query, mutate } from "svelte-apollo"
  	import { gql } from 'apollo-boost'
  	import { goto } from '@sapper/app'

	let addpost = false
	let year = 2019
	let text
	let guid = 2324137
	let userID = "5e52c7c6410df80007deb449"

	async function createpost() {
		let postMutation  = await mutate(client(),{mutation: gql`
      	mutation{
			createPost(text: "${text}", guid: ${guid}, userID: "${userID}")
		{
			text
		}
      }`
	})
	}

	let courses = query(client(), {query: gql`
		query($year: Int!){
			coursesFromYear(year: $year){
				courseID
				id
			}
		}`,
		variables: { year }
	})

	function gotoCourse(idcourse) {
			goto(`/courses/${idcourse}`)
			
			
		}

	function gotoDegree(iddegree) {
		goto(`/degrees/${iddegree}`)
	}

	let yearRuns =[
		{id:2019, text: "year 2019-2020"},
		{id:2020, text: "year 2020-2021"}]


	/*let degrees =[
		{id:'5e2efc3dbe07770007e70ee4', text: "CHEM-4H"},
		{id:'5e303c22be07770007e70eeb', text: "CMC-4H"},
		{id:'5e35c051410df80007b8727f', text: "CHEM-5M (WP)"},
		{id:'5e35c070410df80007b87280', text: "CHEM-5M (EP)"},
		{id:'5e35c089410df80007b87281', text: "CMC-5M (WP)"},
		{id:'5e35c0a3410df80007b87282', text: "CMC-5M (EP)"}]
	*/

	let degrees = query(client(), {query: gql`
		query{
			getDegrees{
				degreeCode
				id
			}
		}`,
	})

	let edits = query(client(), {query: gql`
		query{
			postfromGUID(guid: ${guid}) {
				text
				createdAt
			}
		}`,
	})
	
</script>

<svelte:head>
	<title>School of Chemistry Database</title>
</svelte:head>

{#if $session.user}

	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>

	
	<div>
		<div class="box has-background-info">
			<p class="title has-text-white"> Degrees</p>
		</div>

		{#await $degrees}
			<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
		{:then result}

		<div class="box buttons">
			{#each result.data.getDegrees as degree}
				<button on:click={gotoDegree(degree.id)} class="button is-large is-info is-outlined">{degree.degreeCode} </button>
			{/each}
		</div>

		{:catch}
				<p class="content has-background-danger ">failed to load degrees</p>
		{/await}

	</div>

	<div>
		<select bind:value={year} on:change={()=>courses.refetch({year})}>
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
	

