<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let grade

let id = grade.id
let valueOfGrade = grade.grade
let weightOfGrade = grade.weight

let editing = false
let color = "has-text-black"


async function updateEntry(id, newgrade, weight){
        let updategrade = await mutate(client(), { mutation: gql`
            mutation{
	            changeGradeWeight(grade: ${newgrade}, weight: ${weight}, id: "${id}"){
                    grade
                    weight
                }
            }`
        })
        

    editing = false
    color = "has-text-black"
    valueOfGrade = updategrade.data.changeGradeWeight.grade
    weightOfGrade = updategrade.data.changeGradeWeight.weight

    }


    async function toggleEdit(){
        editing = true
        color = "has-text-danger"

    }
    async function cancelEdit(){
        editing = false
        color = "has-text-black"
        newgrade = valueOfGrade
        newweight = weightOfGrade


    }

    let newgrade = valueOfGrade
    let newweight = weightOfGrade

</script>


<div class="columns" >
    <div class="column is-1">{grade.student.firstname}</div>  
    <div class="column is-1" >{grade.student.surname}</div> 
    <div class="column is-1"> {grade.student.guid} </div>
    {#if editing}
        <input class="column is-1 level-1 has-text-danger" bind:value={newgrade} placeholder={valueOfGrade}/>
        <input class="column is-1 level-1 has-text-danger" bind:value={newweight} placeholder={weightOfGrade}/>

        <div class="buttons">
        <button class="button  is-medium is-success level-1 is-block " on:click={updateEntry(id,newgrade,newweight)} >
            <span class="icon is-small">
            <i class="fas fa-check"></i>
            </span>
            <span>Save</span>
        </button>

        <button class="button is-medium level-1 is-danger is-outlined is-block " on:click={()=>cancelEdit()}>
            <span>Cancel</span>
            <span class="icon is-small">
            <i class="fas fa-times"></i>
            </span>
        </button>
        </div>
    {:else}
        <div class="column is-1 {color}"> {valueOfGrade}</div>
        <div class="column is-1 {color}"> {weightOfGrade} </div>
        <div class="column"><button  on:click={()=>toggleEdit()} class="button is-danger">Edit</button></div>
    {/if}
</div>
 