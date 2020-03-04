<script>
    import { session } from '../stores'
    import { client } from '../gqlClient'
  	import { query, mutate } from "svelte-apollo"
  	import { gql } from 'apollo-boost'
  	import { goto } from '@sapper/app'
	import CourseRow from '../components/CourseRow.svelte'


	function gotoCourse(idcourse) {
		goto(`/courses/${idcourse}`)	
	}
	
	function gotoDegree(iddegree) {
		goto(`/degrees/${iddegree}`)

	}


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

</script>

<svelte:head>
	<title>School of Chemistry Database</title>
</svelte:head>

{#if $session.user}

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

			<div style="display:flex; flex-wrap: wrap; margin-top:2%; margin-left:2%; justify-content:space-between">
				{#each result.data.getDegrees as degree}
					<div class="box" style="display:flex; flex-direction:column; background-color:#EBF1F5; width:47%; margin-right:2%">
						<div style="display:flex; justify-content:center">
							<button on:click={gotoDegree(degree.id)} class="button is-large is-info" style="width:90%">{degree.degreeCode}</button>
						</div>
						<br>
						<p>Name: {degree.name}<br>Infomation: {degree.info}<br></p><br>
							<div class="box" style="display:flex; flex-direction:column; justify-content: space-between">
								<div style="margin-bottom:5px">
									<p>Courses in this degree:</p>
								</div>
								<CourseRow degree={degree} class="content"/>
							</div>
					</div>		
				{/each}
			</div>

		{:catch}
				<p class="content has-background-danger ">failed to load degrees</p>
		{/await}

{:else}

	<div class="container" style="display:flex; jusity-content:center">
		<h1 style="font-size: 55px; font-weight: bold; text-align: center; margin:20px" >Please log in to access this part of the database.</h1>
	</div>

{/if}

