<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let student

let id = student.id
let firstname= student.firstname
let guid = student.guid
let surname = student.surname
let level = student.year
let color = "has-text-black"

let studentGrades = query(client(), {query: gql`
            query{
               gradefromStudentID(id: "${ guid }"){
                   grade
                   course{
                       courseID
                   }
                
                }
            }`
        })

</script>

<div class="columns">

    {#await $studentGrades}

	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
    
	{:then result}

    {#each result.data.gradefromStudentID as st}

		    <StudentDegreeRow student={student} class="content" />
	{/each}



</div>