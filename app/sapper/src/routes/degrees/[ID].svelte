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

    let courseid = "5e35e9c724aa9a0007e681e0"
    let yearFromCourseRun = query(client(), {query: gql`
            query($courseid: ID!){
                getYear(id: $courseid){
                    id
                    course{
                        id
                        courseID
                    }
                    year
                }
            }`,
            variables: {courseid} 
        })

    function setCourse(courseSpecificId){
        courseid = courseSpecificId
    }
    
</script>
    {#await $coursesByDegree}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then result}  
	<div class="box has-background-info">
	<p class="title has-text-white">Courses in degree: (Click button to check course detail)</p>
	</div>
        <div class="box buttons">
		{#each result.data.getCoursesByDegree as coursesFromDegree}
            <button class="button is-large is-info is-outlined">{coursesFromDegree.course.courseID} </button>
		{/each}
		</div>
		
	{:catch}
		<p class="content has-background-danger ">failed to load courses</p>
	{/await}
