<script context="module">
    export async function preload(page, session) {
        const  id = page.params['ID']
        return { id }
    }
</script>

<script>
    export let id
    import { session } from '../../stores'
	import { client } from '../../gqlClient'
	import { query } from 'svelte-apollo'
    import { gql } from 'apollo-boost'
    import StudentRow from '../../components/StudentRow.svelte'
    let cellnumber = 0
    let studentGrade = query(client(), {query: gql`
            query{
                gradeFromCourseID(id: "${ id }"){
                    student{
                        firstname
                        surname
                        guid
                    }
                    course{
                        courseID
                    }
                    grade
                    id
                    weight
                }
            }`
        })
    


</script>


{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>

	{#await $studentGrade}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then result}
	<div class="box has-background-info">
	<p class="title has-text-white">Data for course: </p>
	</div>
    <div class="content">
		<div class="box ">
            <div class="columns has-text-weight-bold">
               <div class="column is-1">Firstname</div>
                <div class="column is-1">Surname</div>
                <div class="column is-1">GUID</div>
                <div class="column is-1">Grade</div>
                <div class="column is-1">Weight</div>
            </div>
		    {#each result.data.gradeFromCourseID as grade}
		    <StudentRow grade={grade} class="content" />
		    {/each}
		</div>
	</div>
	{/await}
{/if}
<p> </p>
