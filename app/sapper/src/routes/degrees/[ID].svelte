<script context="module">
    export async function preload(page, session) {
        const  id = page.params['ID']
        return { id }
    }
</script>
<script >
    export let id
    import { session } from '../../stores'
	import { client } from '../../gqlClient'
	import { query } from 'svelte-apollo'
    import { gql } from 'apollo-boost'

    let year = 2019
	let courses = query(client(), {query: gql`
		query($year: Int!){
			coursesFromYear(year: $year){
				courseID
				
				id
			}
		}`,
		variables: { year }
    })
    
    let yearRuns =[
		{id:2019, text: "year 2019-2020"},
		{id:2020, text: "year 2020-2021"}]

    
    let coursesByDegree = query(client(), {query: gql`
            query{
                getCoursesByDegree(id: "${ id }"){
                    id
                    course{
                        courseID
                        level
                    }
                    degree{
                        id
                    }
                }
            }`
        })

    
</script>
    <select bind:value={year} on:change={()=>courses.refetch({year})} >
	{#each yearRuns as yearRun}
		<option value={yearRun.id}> {yearRun.text}</option>
	{/each}
		</select>
    

    <!-->Sort the course by year<-->
    {#await $courses}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then results}
        {#await $coursesByDegree}
        <div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
        {:then result}  
        <div class="box has-background-info">
        <p class="title has-text-white">Courses in degree: (Click button to check course detail)</p>
        </div>
            <div class="box buttons">
            {#each result.data.getCoursesByDegree as coursesFromDegree}
                {#each results.data.coursesFromYear as course}
                    {#if coursesFromDegree.course.courseID == course.courseID}
                        <button class="button is-large is-info is-outlined">{course.courseID} </button>
                    {/if}
                {/each} 
            {/each}
            </div>
            
        {:catch}
            <p class="content has-background-danger ">failed to load courses</p>
        {/await}
    {:catch}
		<p class="content has-background-danger ">failed to load courses</p>
	{/await}