<script>
    import { session } from '../stores'
    import { client } from '../gqlClient'
  	import { query, mutate } from "svelte-apollo"
  	import { gql } from 'apollo-boost'
  	import { goto } from '@sapper/app'
	import CourseRow from '../components/CourseRow.svelte'

	// hardcoded data
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



	function gotoCourse(idcourse) {
		goto(`/courses/${idcourse}`)	
	}
	
	function gotoDegree(iddegree) {
		goto(`/degrees/${iddegree}`)

	}

	let yearRuns =[
		{id:2019, text: "year 2019-2020"},
		{id:2020, text: "year 2020-2021"}]

	let degrees = query(client(), {query: gql`
		query{
			getDegrees{
				degreeCode
				id
				info
				name
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

	<!--Leo's part-->
	
	<div>
		<section class="hero is-info">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">School of Chemistry</h1>
					<h2 class="subtitle">click a degree to enter Grade management:</h2>
				</div>
			</div>
      	</section>

		{#await $degrees}
			<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
		{:then result}

		<div style="display:flex; flex-wrap:wrap; margin-left:10px; margin-right:10px">
			{#each result.data.getDegrees as degree}
				<div class="box" style="display:flex; flex-direction:column; background-color:#EBF1F5; margin:10px; width:25%">
					<div style="display:flex; justify-content:center">
						<button on:click={gotoDegree(degree.id)} class="button is-large is-info" style="width:50%">{degree.degreeCode}</button>
					</div>
					<br>
					<p>Name: {degree.name}<br>Infomation: {degree.info}<br></p><br>
						<div class="box" style="display:flex; flex-wrap:wrap; width:30%">
							<p>Courses in this degree: <br></p>
							<CourseRow degree={degree} class="content"/>
						</div>
				</div>		
			{/each}
		</div>

		{:catch}
				<p class="content has-background-danger ">failed to load degrees</p>
		{/await}

	</div>

{:else}

	<div class="container" style="display:flex; jusity-content:center">
		<h1 style="font-size: 55px; font-weight: bold; text-align: center; margin:20px" >Please log in to access this part of the database.</h1>
	</div>

{/if}

