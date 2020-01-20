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
    let studentGrade = query(client(), {query: gql`
            query{
                fromCourseID(id: "${ id }"){
                    student{
                        firstname
                        surname
                    }
                    course{
                        courseID
                    }
                    grade
                }
            }`
        })

</script>


{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>

	{#await $studentGrade}
	<p>Loading courses</p>
	{:then result}
	<div class="box has-background-info">
	<p class="title has-text-white">Data for course: {result.data.fromCourseID[0].course.courseID} </p>
	</div>
		<div class="box buttons">
		{#each result.data.fromCourseID as grade}
		<p  class="content">{grade.student.firstname} {grade.student.surname} {grade.grade} </p>
		{/each}
		</div>
	
	{/await}
{/if}
<p> </p>