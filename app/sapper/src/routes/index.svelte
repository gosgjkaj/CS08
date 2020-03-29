<script context="module">
 export async function preload(page, session) {
 if(session.user==null){
	return this.redirect(302, '/login')
 }
 return {}
 }

</script>

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

<!-- checking if logged in -->
{#if $session.user}

	<section class="hero is-info">
		<div class="hero-body">
			<div class="container">
				<h1 class="title">School of Chemistry</h1>
				<h2 class="subtitle">click a degree to enter Grade management:</h2>
			</div>
		</div>
    </section>
		
		<!-- checking degree codes in database and list them here -->
		{#await $degrees}
			<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
		{:then result}
			<!-- if degree code exist: -->
			<div style="display:flex; flex-wrap: wrap; margin-top:2%; margin-left:2%; justify-content:space-between">
				{#each result.data.getDegrees as degree}
					<!-- for each degree code, create a container -->
					<div class="box" style="display:flex; flex-direction:column; background-color:#EBF1F5; width:47%; margin-right:2%">
						<!-- button redirect to degree page for final calculation -->
						<div style="display:flex; justify-content:center">
							<button on:click={gotoDegree(degree.id)} class="button is-large is-info" style="width:90%">{degree.name}</button>
						</div>
						<br>
						<p class="has-text-centered">Code: {degree.degreeCode}<br>Infomation: {degree.info}<br></p><br>
						
							<!-- container for courses belongs to this degree code -->
							<div class="box" style="display:flex; flex-direction:column; justify-content: space-between">
								<div style="margin-bottom:5px">
									
								</div>
								<!-- for each course, create a course row -->
								<CourseRow degree={degree} class="content"/>
							</div>
					</div>		
				{/each}
			</div>

		{:catch}
			<!-- if no degree exist or something goes wrong -->
			<p class="content has-background-danger ">failed to load degrees</p>
		{/await}

{:else}

	<!-- if user not logged in -->
	<div class="container" style="display:flex; jusity-content:center">
		<h1 style="font-size: 55px; font-weight: bold; text-align: center; margin:20px" >Please log in to access this part of the database.</h1>
	</div>

{/if}

<!-- footer -->
<footer class="footer">
  <div class="content has-text-centered">
    <p class="has-text-centered">
    School of Chemistry, University of Glasgow
    </p>
  </div>
</footer>

