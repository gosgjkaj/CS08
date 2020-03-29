<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'
export let gpa

let gradeid = gpa.id
let valueOfGrade = gpa.grade
export let gpaReload = () => {}
let editing = false
let color = "has-text-black"
let invalid = false
let editmessage

async function updateGpa(gradeid, newgrade){

    if(newgrade <= 22 && newgrade>= 0){
        let updategpa = await mutate(client(), { mutation: gql`
            mutation{
	            changeOverallGrade(grade: ${newgrade}, id: "${gradeid}"){
                    grade
                    
                }
            }`
        })
        
    gpaReload()
    editing = false
    color = "has-text-black"
    valueOfGrade = updategpa.data.changeOverallGrade.grade
    }else{
        invalid = true;
    }

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

    <div class="column is-3">Final GPA: </div>  
      

    {#if editing}

        <input class="input column is-2" bind:value={newgrade} placeholder={valueOfGrade.toFixed(1)}/>
        &nbsp;&nbsp;&nbsp;
        <div class="buttons">
        <button class="button is-success level-1 is-block " on:click={()=>updateGpa(gradeid,newgrade)} >
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
    
        {#if invalid == true}

            <div class="notification is-danger">
                <button class="delete" on:click={()=>invalid = false}></button>
                <strong> Warning </strong> input must be in the valid range: 0 - 22
            </div>

        {/if}


    {:else}
        <div class="column is-2 {color}"> {valueOfGrade}</div>
        <div class="column"><button  on:click={()=>toggleEdit()} class="button is-danger">Edit</button></div>
    {/if}



</div>