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
    
    let courseid = query(client(), {query: gql`
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
    
    let level =[
		{id:2018,text: "2018-2019"},
        {id:2019,text: "2019-2020"},
        {id:2020,text: "2020-2021"},
        {id:2021,text: "2021-2022"},
        {id:2022,text: "20222-2023"}]

</script>


    {#await $courseid}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then result}

	<div class="box has-background-info">
	<p class="title has-text-white">Courses in degree: (Click button to check course detail)</p>
	</div>
        <div class="box buttons">
		{#each result.data.getCoursesByDegree as courses}

		<button class="button is-large is-info is-outlined">{courses.course.courseID} </button>
		{/each}
		</div>
		
	{:catch}
		<p class="content has-background-danger ">failed to load courses</p>
	{/await}
