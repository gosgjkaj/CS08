<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js">
  import { query, mutate } from "svelte-apollo";
  import { gql } from "apollo-boost";
  import { client } from "../gqlClient";
  import {
    convert,
    degreeClassification,
    exportClassification
  } from "../components/convertGrades.js";
  import GradeEditWindow from "../components/GradeEditWindow.svelte";
  import EditNotesWindow from "../components/EditNotesWindow.svelte";
  import GpaEditWindow from "../components/GpaEditWindow.svelte";
  import currentYear  from '../currentYear.js'
  import DesignatedSelect from "../components/DesignatedSelect.svelte";
  import {degreeToAcademic} from "../components/convertCode.js";

  let date = currentYear
  import { session } from "../stores";
  export let exportStudent;
  export let restricted;
  export let firstname;
  export let guid;
  export let save
  export let surname;
  export let alphanum;
  export let anonCode;
  export let showAnon;
  export let showNames;
  export let totalCourses;
  export let finalizeGpa;
  export let allowEdits;
  export let level;

  export let selectedYear;
  export let selectedLevel;
  
$:selectedLevel, guid=guid
  
  export let studentID;
  export let reload 
  let editing = false;
  let addEdit = false;
  let text;
  let id;
  let show22 = false;
  let showNUM = false;
  let showGpa = false;
  let noGPA = false;
  let showGrades = false;
  let editGpa = false;
  let color = "has-text-black";
  let total = 0;
  let fullAnonCode;
  let userID = $session.user.id;
  let hasValidGrades = true;
  let designatedDegree
  let hasDesDegree = false
  let gpas=[]
 
  let finalGpa;
  let academicPlan = degreeToAcademic(anonCode)



//stages to execute:
/*
1. get student grades
2. calculate
3. if there is no overall create it
4 of there is overall grade display it
5. set the entry text to red if the overall grade is  not equal to the calculations

*/

//QUERIES
 let editRes;
let edits = query(client(), {
    query: gql`
		query($guid: String!){
			postfromGUID(guid: $guid) {
				text
                createdAt
                postedBy{
                  
                    name
                    
                }
			}
		}`,variables:{guid}
  });
 
  $edits.then(res => {
    editRes = res.data.postfromGUID;
  });

  let grades=[]
  let studentGrades = query(client(), {
    query: gql`
    query($studentID: ID!){
        gradefromStudentID(id: $studentID ){
            grade
            weight
            id
            course{
                courseID
            }
            status        
        }
    }`,
    variables:{ studentID }
  });

  $studentGrades.then(res => {
    if( res.data.gradefromStudentID!=null){
    grades = res.data.gradefromStudentID;
    }
  });


   //Query for getting overallgrade (Gpa) from student


  let final22
  let finalALPHA
  let finalGradeStatus
  let gpaINDB // OVERALL GRADE STORED IN  DB IF PRESENT
  let studentGpa = query(client(), {
    query: gql`
    query($studentID: ID!){
        overallGradeFromId(id: $studentID){
            grade
            id
        }
    
    }`,variables:{ studentID }
  });
 
  $studentGpa.then(res => {
    gpas = res.data.overallGradeFromId;
  
    if( gpas.length!=0){

        final22 = gpas[0].grade
        gpaINDB = gpas[0].grade
        finalALPHA = convert(gpas[0].grade)
        if(final22 < 6){
          hasDesDegree = true
        }
    
    }else{
      gpaINDB= ""
    }

  });





  //Function to generate anonymous code for student
  async function createAnonCode() {
    let code;
    let sum;
    let subStr = guid.substring(2, guid.length - 2);
    let subStr2 = guid.substring(6, guid.length);
    let intGuid = parseInt(subStr);
    let intGuid2 = parseInt(subStr2);
    code = anonCode + "-" + subStr * subStr2;
    fullAnonCode = code;
  }
  $: anonCode, createAnonCode(anonCode);










  //PART ONE -NOTES FOR EDITS
  //Function to crate edit notes
  async function createpost() {
    addEdit = false;
    let postMutation = await mutate(client(), {
      mutation: gql`
      mutation($guid: String!){
		createPost(text: "${text}", guid: $guid, userID: "${userID}")
		{
			text
		}
      }`,variables:{guid}
    });

    await edits.refetch({guid}).then(res => {
    editRes = res.data.postfromGUID;
  });

  }

  //Function + query to check if student has been edited (has edit notes)
  //hasedits == 2 if student has edit notes, hasedits == 1 if there are no edit notes
  


  let hasEdits;
  async function checkEdits() {
    let res = 0;
    if (editRes != null) {
      if (editRes.length == 0) {
        res += 1;
      } else if (editRes.length > 0) {
        res += 2;
      }

      hasEdits = res;
    }
  }
  $: editRes, checkEdits();





  //PART TWO CALCULATIONS
  

 
  //Query for student grades
  
  //$: grades, console.log("grades for :",reload, guid, grades);
  //$: gpas, console.log("gpas for :", reload, guid, gpas);

 
 
  
  //Function to calculate Gpa, total of weights
  let totalweight;              //sum of all student grade weights
  let GPA;                      //Gpa in 22point format  created from the calculations
  let ALPHA;                    //Gpa in alpha numeric format
  let degreeClass;              //degree classification
  let gradeNum;                 //number of grades
  let hasAllGrades = false;     //boolean for if a student has all it's grades
  let exportValue;
  let finalClass;

  let warning = "has-text-black"
$:save, saveCalc()
  async function saveCalc(){
    let calc = parseFloat(GPA)
    if(save!=0 && GPA <= 22 && GPA>= 0 && gpas.length!=0){
      let gradeid = gpas[0].id
      

        let updategpa = await mutate(client(), { mutation: gql`
            mutation($calc: Float!, $gradeid: ID!){
	            changeOverallGrade(grade: $calc, id: $gradeid){
                    grade
                    
                }
            }`, variables:{calc, gradeid}
        })
    gpaINDB= GPA
    final22 =calc
    finalALPHA = convert(calc)
    if(final22 < 6){
          hasDesDegree = true
        }
    warning = "has-text-black"
    gpaReload()
    

    }
  }

  function RowIsNotSaved(){
    if( GPA != gpaINDB){
      warning =  "has-text-danger"
    }else{
      warning= "has-text-black"
    }
  }
  $: gpas

  $: GPA, RowIsNotSaved()

  $: selectedLevel, reloadEntities()
  $: selectedYear, reloadGrades()

async function reloadGrades(){
  await studentGrades.refetch({studentID}).then(res => {
  
     if(res.data.gradefromStudentID!=null){
      grades = res.data.gradefromStudentID;
      gradeNum= grades.length
     }
     else{
       grades=[]
       gradesNum=0
     }
  });
}
 async function reloadEntities(){
    hasValidGrades = true;
   designatedDegree
   hasDesDegree = false
   totalweight=0
   hasAllGrades = false
   gpas=[]
   await edits.refetch({guid}).then(res => {
    editRes = res.data.postfromGUID;
    hasEdits=editRes.length
  });
  await studentGpa.refetch({studentID}).then(res => {
    gpas = res.data.overallGradeFromId;

    if(gpas.length!=0){

        final22 = gpas[0].grade
        gpaINDB = gpas[0].grade
        finalALPHA = convert(gpas[0].grade)
        if(final22 < 6){
          hasDesDegree = true
        }
    
    }
    else{gpaINDB =""}

  });
   await studentGrades.refetch({studentID}).then(res => {
    
     if(res.data.gradefromStudentID!=null){
      grades = res.data.gradefromStudentID;
     }
     else{
       grades=[]
     }
  });
  
 
  
  getTotal(grades, reload)
   }
   


  async function getTotal(grades, executemut) {
   
    let total = 0
    gradeNum=grades.length
      if(grades.length!=0 && level !="Third"&& level !="Graduated"){
        let gradeslength = grades.length;       
        let gradenum = 0;
        let gpa = 0
        if (gradeslength == totalCourses) {
            
            hasAllGrades = true;
            for (let i = 0; i < gradeslength; i++) {
                let gradeStatus = grades[i].status;
                let finalGradeStatus = grades[i].status;
                gradenum += 1;
                total += grades[i].weight;
                gpa += grades[i].weight * grades[i].grade;

                if(gradeStatus == "MV" || gradeStatus == "CR" || gradeStatus == "CW"){
                  hasValidGrades= false
                }
            }
        } else {
            for (let i = 0; i < gradeslength; i++) {
                let gradeStatus = grades[i].status;
                let finalGradeStatus = grades[i].status;
                gradenum += 1;
                total += grades[i].weight;
                if(gradeStatus == "MV" || gradeStatus == "CR" || gradeStatus == "CW"){
                  hasValidGrades= false
                }     
            }
        }

        totalweight = total;
   
        GPA = ((gpa.toFixed(1) ));
        RowIsNotSaved()
        ALPHA = convert(gpa);
        degreeClass = degreeClassification(ALPHA);
        gradeNum = gradenum;
   
    
        //Function to check Gpa exists. If not, set the Gpa previously calculated above as the student's overall grade

        if(hasValidGrades == true){
          let exportValue = final22
        } else if (hasValidGrades == false){
          let exportValue = "TBC"
        }
        
          if ((gradeNum == totalCourses && level == "Fifth") || (level == "Fourth" && gradeNum == totalCourses)) {
          if(gpas != null || gpas != undefined){
              if (!reload && gpas.length == 0 &&  totalweight > 0.9998 && totalweight < 1.0001)  {

                
              
                  let gpaMutation = await mutate(client(), {
                      mutation: gql`
                          mutation($studentID: ID!){
		                      createOverallGradeGPA(studentID: $studentID, year: ${date}, studentLevel: ${level} , grade: ${gpa} )
		                  {
			                  grade
		                  }
                          }`,variables:{studentID}
                    });
                   
                     gpas = [gpaMutation.data.createOverallGradeGPA]
                    final22 = gpas[0].grade
                    gpaINDB = gpas[0].grade
                    finalALPHA = convert(gpas[0].grade)
                    if(final22 < 6){
                    hasDesDegree = true
        }
                    color = "has-text-black"
                  


              }}






                  
                  
                
              }
            
          }
    
  } 
async function gradesReload(){
 await studentGrades.refetch({studentID}).then(res => {

     if(res.data.gradefromStudentID!=null){
      grades = res.data.gradefromStudentID;
     }
     else{
       grades=[]
     }
  });
  getTotal(grades,false)
}
async function gpaReload(){
 await studentGpa.refetch({studentID}).then(res => {
    gpas = res.data.overallGradeFromId;

    if(gpas.length!=0){

        final22 = gpas[0].grade
        gpaINDB = gpas[0].grade
        finalALPHA = convert(gpas[0].grade)
        if(final22 < 6){
          hasDesDegree = true
        }
    
    }
    else{gpaINDB =""}

  })
                 
}

  $: grades,exportStudent = {
    EMPLID: showAnon ? "anonymous" : guid,
    Name: showAnon ? fullAnonCode : `"${surname},${firstname}"` ,
    AcadPlan: `"${anonCode}"`,
    DegreeHonors: hasValidGrades ? (hasDesDegree ? designatedDegree : exportClassification(degreeClassification(convert(final22)))) : "TBC",


   
  };





  async function toggleEdit() {
    editing = true;
    color = "has-text-danger";
  }
  async function cancelEdit() {
    editing = false;
    color = "has-text-black";
    newgrade = valueOfGrade;
    newweight = weightOfGrade;
  }

  //  Modal for editing grade
  let modalIsVisible = false;
  $: modalClass = modalIsVisible === true ? "modal is-active" : "modal";

  async function closeModal() {
    modalIsVisible = false;
    await studentGrades.refetch().then(res => {
    grades = res.data.gradefromStudentID;
  });
  }

  export function openModal() {
    modalIsVisible = true;
  }

  //Modal for viewing edit notes

  let editModalIsVisible = false;
  $: editModalClass = editModalIsVisible === true ? "modal is-active" : "modal";

  function closeEditModal() {
    editModalIsVisible = false;
  }

  function openEditModal() {
    editModalIsVisible = true;
  }

  //modal for editing gpa grade

  let gpaModalIsVisible = false;
  $: gpaModalClass = gpaModalIsVisible === true ? "modal is-active" : "modal";

  function closeGpaModal() {
    gpaModalIsVisible = false;
  }

  function openGpaModal() {
    gpaModalIsVisible = true;
  }


</script>



<div  class="columns {warning}">
  {#if showAnon}
    <div class="column is-2">{fullAnonCode}</div>
  {:else if showNames}
    <div class="column is-1">{firstname}</div>
    <div class="column is-1">{surname}</div>
  {/if}

  <div class="column is-1">{guid}</div>

    <div class="column is-1">{level}</div>
 
 {#if grades!=null}

  {#await $studentGrades}

    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>

  {:then result}

    <div class={modalClass}>
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit grades for {firstname} {surname}</p>
          <button class="delete" aria-label="close" on:click={closeModal} />
        </header>
        <section class="modal-card-body">

          <div class="columns has-text-weight-bold">
            <div class="column is-2">Course</div>
            <div class="column is-2">Grade</div>
            <div class="column is-1">Weight</div>
          </div>

          {#each result.data.gradefromStudentID as grade}
            <GradeEditWindow  gradesReload={()=>gradesReload()} {grade} class="content" />
          {/each}
          <div class="columns">
          <div class="column is-3">
          <button class="button is-warning" on:click={() => (addEdit = true)}>
            Add edit note
          </button></div>
          {#if addEdit}
        
            <input
              class="column is-5 has-text-danger"
              bind:value={text}
              placeholder={'Add post...'} />
      
            <div class="column is-2">
            <button
              class="button is-success is-block "
              on:click={()=>createpost()}>
              <span class="icon is-small">
                <i class="fas fa-check" />
              </span>
              <span>Save</span>
            </button>
            </div>
          <div class="column is-2">
          <button class="button level-1 is-danger is-outlined is-block " on:click={()=>text=""}>
            <span>Cancel</span>
            <span class="icon is-small">
            <i class="fas fa-times"></i>
            </span>
          </div>
          {/if}
        </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" on:click={() => closeModal()}>
            <span>Close</span>
          </button>

         

          
        </footer>
      </div>
    </div>

    <div class="column is-1">
      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu4">
            <span>Grades ({gradeNum})</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>

        <div class="dropdown-menu" id="dropdown-menu4" role="menu">
          <div class="dropdown-content">
            {#each result.data.gradefromStudentID as studentCourseGrade}
              <div class="dropdown-item">
                <p>
                  {studentCourseGrade.course.courseID}: {studentCourseGrade.grade}
                  <strong>({studentCourseGrade.weight})</strong>
                </p>
              </div>
              <hr class="dropdown-divider" />
            {/each}

          </div>
        </div>
      </div>
    </div>
  {#if !restricted}
    <div class="column is-1">
      <button on:click={() => openModal()} class="button is-light is-danger">
        Edit
      </button>
    </div>
    {/if}
  {/await}
 
        {#if hasValidGrades == true}
         {#if level=="Third"||level=="Graduated" }
          <div class="column is-3">Calculations are not available for this level</div>
          {:else}
 
            {#if totalweight > 0.9998 && totalweight < 1.0001}
              {#if hasAllGrades == true}
                <div class="column is-1">
                  <span class="icon has-text-success">
                    <i class="fas fa-check-square" />
                  </span>
                </div>
              {:else if hasAllGrades == false}
                <div class="column is-2">
                  <div class="dropdown is-hoverable">
                    <div class="dropdown-trigger">
                      <button
                        class="button"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu">
                        <span class="icon has-text-warning">
                          <i class="fas fa-exclamation-triangle" />
                        </span>

                      </button>
                    </div>

                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <div class="dropdown-item">
                          <p>
                            <strong>Warning</strong>
                            student has correct weight but not all course grades.
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            {/if}

            {#if totalweight < 0.9998}
              <div class="column is-2">
                <div class="dropdown is-hoverable">
                  <div class="dropdown-trigger">
                    <button
                      class="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu">
                      <span class="icon has-text-warning">
                        <i class="fas fa-exclamation-triangle" />
                      </span>
          

                    </button>
                  </div>

                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                        {#if totalweight == 0}
                          <p>
                            <strong>Warning</strong>
                            student does not have grades.
                          </p>
                        {/if}

                        {#if totalweight > 0}
                          <p>
                            <strong>Warning</strong>
                            student is missing grade(s)
                            <strong>or</strong>
                            has incorrect weight(s).
                          </p>
                          <hr class="dropdown-divider" />
                          <p>
                            Accumulated weight:
                            <strong>{totalweight}</strong>
                          </p>
                        {/if}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/if}

            {#if totalweight > 1.0001}
              <div class="column is-3">
                <div class="dropdown is-hoverable">
                  <div class="dropdown-trigger">
                    <button
                      class="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu4">
                      <span class="icon has-text-warning">
                        <i class="fas fa-exclamation-triangle" />
                      </span>
                      <span>Error</span>
                      <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                        <p>
                          <strong>Warning</strong>
                          student has incorrect weights.
                        </p>
                        <hr class="dropdown-divider" />
                        <p>
                          Accumulated weight: <strong> {totalweight}</strong> 
                          <strong />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
   {/if}
        {/if}

        {#if hasValidGrades == false}
          <div class="column is-1">
            <span class="icon has-text-warning">
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
          <div class="column is-1">
            TBC
          </div>

          
          <div class="column is-3">
            <div class="notification is-warning">
                  <strong>{firstname}</strong> is awaiting confirmation.
            </div>
          </div>
        {/if}
         {#if level=="Third"||level=="Graduated" }
          <div class="column is-3"></div>
          {:else}
        {#if totalweight > 0.9998 && totalweight < 1.0001}
          <div class="column is-1">
            {#if alphanum}
              {ALPHA}
            {:else}
              {GPA}
            {/if}
          </div>
        

          <div class="column is-1">{degreeClass}</div>

      {:else}
          <div class="column is-1"></div>


        {/if}
        {/if}

  {#if gpas.length!=0}
    <div class={gpaModalClass}>
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit gpa for {firstname} {surname}</p>
          <button class="delete" aria-label="close" on:click={closeGpaModal} />
        </header>
        <section class="modal-card-body">

          <div class="columns has-text-weight-bold">
            <div class="column is-2">Gpa</div>

          </div>

          {#each gpas as gpa}
            <GpaEditWindow {gpa} gpaReload={() => gpaReload()} class="content" />
          {/each}

        </section>

        <footer class="modal-card-foot">
          <button class="button is-success" on:click={() => closeGpaModal()}>
            <span>Finish</span>
          </button>

          <button class="button is-warning" on:click={() => (addEdit = true)}>
            Add edit note
          </button>

          {#if addEdit}
            <input
              class="column is-5 level-1 has-text-danger"
              bind:value={text}
              placeholder={'Add post...'} />

            <button
              class="button is-success level-1 is-block "
              on:click={()=>createpost()}>
              <span class="icon is-small">
                <i class="fas fa-check" />
              </span>
              <span>Save</span>
            </button>
          {/if}

        </footer>
      </div>
    </div>
    {/if}



    {#if level == 'Fifth' || level == 'Fourth' && hasAllGrades == true && ( totalweight > 0.9998 && totalweight < 1.0001)}
      {#if finalizeGpa == true}
        <div class="column is-7">

          {#each gpas as gpa}

            {#if gpa.grade <= 5 }

                 <DesignatedSelect bind:selected={designatedDegree} /> 

            {:else if gpa.grade > 5}

                {#if alphanum}
                    {convert(gpa.grade)}  &nbsp; &nbsp;
                {:else}
                    {gpa.grade.toFixed(1)} &nbsp; &nbsp; 
                {/if}

                <strong>
                  class:&nbsp; {degreeClassification(convert(gpa.grade))} ({exportClassification(degreeClassification(convert(gpa.grade)))})
                </strong>

            {/if}

          {/each}

          {#if allowEdits == true}
            <button
              class="button is-danger is-small"
              on:click={() => openGpaModal()}>
              Edit gpa
            </button>
          {/if}

          {#if hasEdits == 2}
            <button
              on:click={() => openEditModal()}
              class="button is-small is-light is-warning">
              Edited
            </button>
          {/if}


        </div>
      {/if}
    {/if}



  {#await $edits}

    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>

  {:then result}

    <div class={editModalClass}>
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            View edit details for {firstname} {surname}
          </p>
        </header>
        <section class="modal-card-body">

          <div class="columns has-text-weight-bold">
            <div class="column is-3">Details</div>

          </div>

          {#each result.data.postfromGUID as editNote}
            <EditNotesWindow {editNote} class="content" />
          {/each}

        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" on:click={() => closeEditModal()}>
            <span>Finish</span>
          </button>

          <button class="button is-warning" on:click={() => (addEdit = true)}>
            Add edit note
          </button>

          {#if addEdit}
            <input
              class="column is-5 level-1 has-text-danger"
              bind:value={text}
              placeholder={'Add post...'} />

            <button
              class="button is-success level-1 is-block "
              on:click={createpost}>
              <span class="icon is-small">
                <i class="fas fa-check" />
              </span>
              <span>Save</span>
            </button>
          {/if}

        </footer>
      </div>
    </div>

  {/await}
  
  

  {:else}
  <div>The student  has no grades. Please upload or add them in the Students page.</div>
  
  
  {/if}
</div>



