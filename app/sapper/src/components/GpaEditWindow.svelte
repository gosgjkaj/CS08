<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'
export let gpa

let gradeid = gpa.id
let valueOfGrade = gpa.grade

let editing = false
let color = "has-text-black"

let editmessage

async function updateGpa(gradeid, newgrade){
        let updategpa = await mutate(client(), { mutation: gql`
            mutation{
	            changeOverallGrade(grade: ${newgrade}, id: "${gradeid}"){
                    grade
                    
                }
            }`
        })
        

    editing = false
    color = "has-text-black"
    valueOfGrade = updategpa.data.changeOverallGrade.grade
  

    }


    async function toggleEdit(){
        editing = true
        color = "has-text-danger"

    }
    async function cancelEdit(){
        editing = false
        color = "has-text-black"
        newgrade = valueOfGrade
    


    }

    let newgrade = valueOfGrade
 




</script>

<div class="columns">

    <div class="column is-2">"Final GPA:" </div>  
      

    {#if editing}

        <input class="column is-1 level-1 has-text-danger" bind:value={newgrade} placeholder={valueOfGrade}/>

        <div class="buttons">
        <button class="button is-success level-1 is-block " on:click={updateGpa(gradeid,newgrade)} >
            <span class="icon is-small">
            <i class="fas fa-check"></i>
            </span>
            <span>Save</span>
        </button>
        <button class="button level-1 is-danger is-outlined is-block " on:click={()=>cancelEdit()}>
            <span>Cancel</span>
            <span class="icon is-small">
            <i class="fas fa-times"></i>
            </span>
        </button>
        
    

        </div>

    {:else}
        <div class="column is-2 {color}"> {valueOfGrade}</div>
        <div class="column"><button  on:click={()=>toggleEdit()} class="button is-danger">Edit</button></div>
    {/if}



</div>