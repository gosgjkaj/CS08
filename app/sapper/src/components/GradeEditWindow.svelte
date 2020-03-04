<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'
export let grade

let gradeid = grade.id
let valueOfGrade = grade.grade
let weightOfGrade = grade.weight

let editing = false
let color = "has-text-black"

let gradeInvalid = false
let weightInvalid = false



let editmessage

async function updateEntry(gradeid, newgrade, weight){

        if(newgrade <= 22 && newgrade>= 0){

            if(0 < weight && weight < 1){

            let updategrade = await mutate(client(), { mutation: gql`
                mutation{
	                changeDegreeGradesWeight(grade: ${newgrade}, weight: ${weight}, id: "${gradeid}"){
                     grade
                     weight
                    }
                }`
            })
        





            editing = false
            color = "has-text-black"
            valueOfGrade = updategrade.data.changeDegreeGradesWeight.grade
            weightOfGrade = updategrade.data.changeDegreeGradesWeight.weight

            }else{
                weightInvalid = true
            }

            }else{
                gradeInvalid = true
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
        newweight = weightOfGrade


    }

    let newgrade = valueOfGrade
    let newweight = weightOfGrade




</script>

<div class="columns">

    <div class="column is-2">{grade.course.courseID} </div>  
      

    {#if editing}

        <input class="column is-1 level-1 has-text-danger" bind:value={newgrade} placeholder={valueOfGrade}/>
        <input class="column is-1 level-2 has-text-danger" bind:value={newweight} placeholder={weightOfGrade}/>
        <div class="box">
        <div class="buttons">
        <button class="button is-success level-1 is-block " on:click={updateEntry(gradeid,newgrade,newweight)} >
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
    

        </div>

        {#if gradeInvalid == true}
          
                <div class="notification is-danger">
                    <button class="delete" on:click={()=>gradeInvalid = false}></button>
                    <strong> Warning </strong> input must be in the valid range: 0 - 22
                </div>

            {/if}

            {#if weightInvalid == true}

                <div class="notification is-danger">
                    <button class="delete" on:click={()=>weightInvalid = false}></button>
                    <strong> Warning </strong> input must be in the valid range: 0 - 1
                </div>

            {/if}


    {:else}
        <div class="column is-2 {color}"> {valueOfGrade}</div>
        <div class="column is-2 {color}"> {weightOfGrade} </div>
        <div class="column"><button  on:click={()=>toggleEdit()} class="button is-danger">Edit</button></div>
    {/if}



</div>