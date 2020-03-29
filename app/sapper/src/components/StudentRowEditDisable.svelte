<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'
import { convert } from './convertGrades.js'
export let grade
export let student



</script>



<div class="columns " >
    <div class="column is-2 has-offset-1">{student.firstname}</div>  
    <div class="column is-2" >{student.surname}</div> 
    <div class="column is-2"> {student.guid}  </div>
    <div class="column is-2"> {student.level}  </div>
    <div class="column is-2"> {grade} </div>
</div>
 