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
                        guid
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
		<table class="table">
            <tr>
                <th>Firstname</th>
                <th>Surname</th>
                <th>GUID</th>
                <th>Grade</th>
            </tr>
		    {#each result.data.fromCourseID as grade}
		    <tr  class="content">
               <td>{grade.student.firstname}</td>  
               <td>{grade.student.surname}</td> 
               <td>{grade.student.guid}</td>
               <td>{grade.grade} </td> 
            </tr>
		    {/each}
		</table>
	
	{/await}
{/if}
<p> </p>