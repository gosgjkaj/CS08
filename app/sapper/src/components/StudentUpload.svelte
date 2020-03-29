<script>
  
  import { session } from "../stores";
  import { client } from "../gqlClient";
  import { query, mutate } from "svelte-apollo";
  import { gql } from "apollo-boost";
  import  Papa  from 'papaparse'
  import currentYear  from '../currentYear.js'
 
  let active = false
  let uploadResults 
  let files = []
  let review = []
  let currentyear =currentYear
  let year = currentYear
  let years=[]
  let loading =false
  let componentsActive = [true,false,false,false]
  let componentsDone = [false,false,false,false]
  let weights=[]

  let degreelist=[]

   let degrees= query(client(), {
    query: gql`
      query {
         getDegrees {
          id
            degreeCode
         }
       }
     `
   })
 $degrees.then(res=>{
   degreelist= res.data.getDegrees
 }) 

  function readFile(uploadedfile) {
    if(uploadedfile!=null){

    let filenameArray = (uploadedfile["name"]).split(".")
    let type = filenameArray[filenameArray.length -1]

    if( type == "csv") {

      let contents = Papa.parse(uploadedfile,{
        header: true,
        complete: function(results){
           uploadResults = results.data
        }
      })
      }
   
    }
  }

 
async function checkGuids() {
  
   if(uploadResults == null ){
     warning = true
     return 0
   }else{
   for ( let i = 0; i<uploadResults.length; i++) {
    let guid = uploadResults[i].StudentID
   
    
    if(guid =="") {
      i++
      continue
    }

    let checkNames = await mutate(client(), { mutation: gql`
          mutation {
        checkStudentNames( guid: "${guid}")
     }`
   })

   
    if (!checkNames.data.checkStudentNames){
       let degreeExist=false
 
     for(let k=0; k < degreelist.length; k++) {
         
         if( degreelist[k].degreeCode == uploadResults[i]["Acad Plan"]){
 
             degreeExist = true
                review.push({
                 "EMPLID": uploadResults[i].StudentID, 
                 "Name" : uploadResults[i].Name,
                 "degree": degreelist[k].id,
                 "level" : null,
                 })
                  review=review


         }}
         if (degreeExist==false){
             warning2= true
    
         }
      

     
    }
  }
 
  goNext()
  }
}


let warning  = false 
let warning2 = false

function saveChanges() {
   let i = 0
   for(i; i<(review).length; i++) {
     if(review[i]['level']==null ){
      warning = true 
      return false
    }}
   createStudents()
   return true
}

async function createStudents() {

if(review.length!=0){
 let studentinput = "["
    review.forEach(w => { 
    let names = w['Name'].split(",")
    studentinput += `{ EMPLID: "${w['EMPLID']}",
                      firstname: "${names[1]}",
                      surname: "${names[0]}",
                      degree: "${w['degree']}",
                      level: ${w['level']}
                      },`
     })
    studentinput = studentinput.substring(0, studentinput.length-1) // removes the last comma
    studentinput += "]"

    let created = await mutate(client(),{mutation: gql`
      mutation {
        createStudentByUpload(
          students: ${studentinput}
          entryYear: ${year}
        ){
          failed
        }
        
      }`
    })

 
}
}

async function goNext(){
  let i = 0
  for(i; i<2;i++){
  if (componentsActive[i]){
    if(i==0){
      if(uploadResults==null){
        warning = true 
        break
      }
    }

    if(i==1){
      let checkfields=saveChanges()
      if (!checkfields) {
        warning=true
        break
      }
    }
    componentsActive[i]=false
    componentsActive[i+1] = true
    componentsDone[i] = true
    warning=false
    
    break
  }
}
}
let failed =[]


function resetFile() { 
            const file = 
                document.querySelector('.file-input'); 
            file.value = ''; 
        } 

function clearAll(){
  resetFile()
  warning = false
  active = false
  warning2=false
  componentsActive[0] = true
  componentsActive[1] = false
  componentsActive[2] = false
  componentsDone = [false,false,false]
  uploadResults = null
  review = []
  loading = false
  
}


</script>

<div>
  <button class="button modal-button is-info" on:click={() => (active = true)}>
    Upload Students
  </button>
</div>

<div class:is-active={active} class="modal">
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Upload Students</p>
      <button class="delete" on:click={() =>clearAll()} aria-label="close" />
    </header>

    <section class="modal-card-body has-text-black">

        <div class="steps">
  <div class:is-active={componentsActive[0]} class:is-completed={componentsDone[0]} class="step-item">
    <div class="step-marker">1</div>
    <div class="step-details">
      <p>Upload File</p>
    </div>
  </div>
  <div class:is-active={componentsActive[1]} class:is-completed={componentsDone[1]} class="step-item">
    <div class="step-marker">2</div>
    <div class="step-details">
      <p>Review Entries</p>
    </div>
  </div>

  <div class:is-active={componentsActive[2]} class:is-completed={componentsDone[2]} class="step-item">
    <div class="step-marker">
      <span class="icon">
        <i class="fa fa-flag"></i>
      </span>
    </div>
    <div class="step-details">
      <p>Save Changes</p>
    </div>
  </div>
</div>
    {#await $degrees}
     <div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
     {:then result}

   {#if componentsActive[0]}
      <div class="columns">
       <div class="column is-10 is-offset-1">
       <p>Please upload a CSV file containing student information:</p>
       <p>Where the data has columns: StudentID, Name, Academic Plan</p>
       </div>
      </div>
       <div class="columns">
       <div class="column is-2 is-offset-2">
       <p>File: </p>
       </div>
        <div class="column is-4">

        <div class="file is-primary">
  <label class="file-label">
   <input

          bind:files
          type="file"
          class="file-input"
          accept=".csv"
          on:change={()=>readFile(files[0])}
          />
          
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        Choose a file…
      </span>
    </span>
  </label>
</div>
    </div>
        </div>
       
        
        {#if warning}
        <p class="box has-background-warning">Please upload a file</p>
        {/if}

  
   {/if}



    {#if componentsActive[1]}
    
     {#if warning2}
        <div class="box has-background-danger">
            <p>The degree does not exist in the database. Please add a degree with the correct code before moving forward or check if there is 
            a degree that has the same code as the  code in the "Acad Plan" field.</p>
        </div>
        {/if}
        {#if review.length>0}
        <div class="box has-background-warning">
        <p>The following students are not in the current database:</p>
        <p>Please provide additional data for each of them before submiting.</p>
        </div>

        <table class="table">
        {#each review as entry}
        <tr>
        <td>{entry.EMPLID}</td> <td>{entry.Name}</td>
        <td>
            <div class="select is-primary is-small">
            <select class="select" bind:value={entry.level}>
            <option value="" disabled selected>Select Year</option>
            <option value='Third'>Third</option>
            <option value='Fourth'>Fourth</option>
            <option value='Fifth'>Fifth</option>
            </select>
            </div>
            </td>
        </tr>
        {/each}
        </table>

        {#if warning}
        <div class="box has-background-warning">
            <p>Please choose levels for all students</p>
        </div>
        {/if}
    {:else}
        <div class="content has-text-centered" > All students are in the database. </div>
    {/if}
   {/if}


    {#if componentsActive[2]}
        
        {#if warning2 }
        <div class="box has-background-danger has-text-white"> 
        Warning! An error occured while uploading students.
        Please check if the following students already exist.
        {#each failed as failedStudent}
        <p class="has-text-weight-bold">Student id: {failedStudent}</p>
        {/each}
        </div>
        {:else}
        <div>Upload completed. No issues found.</div>
        {/if}
    {/if}
   
      {/await}
      </section>
     

    <footer class="modal-card-foot">
    <button class="button" on:click={() => clearAll()}>Cancel</button>
    {#if componentsActive[0]}
    <button class="button is-success" on:click={() => checkGuids()}>Upload</button>
    {/if}
    {#if componentsActive[1] && !warning2}
    <button class="button is-success" on:click={() => goNext()}>Next</button>
    {/if}
    {#if componentsActive[2]}
      <button class="button is-success" on:click={()=>clearAll()}>Finish</button>
    {/if}   
     
    </footer>

  </div>
</div>
