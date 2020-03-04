<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let grade
let id = grade.id
let valueOfGrade = grade.grade
let weightOfGrade = grade.weight
let color = "has-text-black"
</script>

<div class="columns" >
    <div class="column is-1">{grade.student.firstname}</div>  
    <div class="column is-1" >{grade.student.surname}</div> 
    <div class="column is-1"> {grade.student.guid} </div>
    <div class="column is-1 {color}"> {valueOfGrade}</div>
    <div class="column is-1 {color}"> {weightOfGrade} </div>
</div>
 