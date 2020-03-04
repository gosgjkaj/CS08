<script
  src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js">
  import { query, mutate } from "svelte-apollo";
  import { gql } from "apollo-boost";
  import { client } from "../gqlClient";
  import {
    convert,
    degreeClassification
  } from "../components/convertGrades.js";
  import GradeEditWindow from "../components/GradeEditWindow.svelte";
  import EditNotesWindow from "../components/EditNotesWindow.svelte";
  import GpaEditWindow from "../components/GpaEditWindow.svelte";

  import { session } from "../stores";
  export let exportStudent;
  export let selectedYear;
  export let firstname;
  export let guid;
  export let surname;
  export let alphanum;
  export let showingLevel;
  export let anonCode;
  export let showAnon;
  export let showNames;
  export let totalCourses;
  export let finalizeGpa;
  export let allowEdits;
  export let entryYear;
  export let level;
  export let studentId;

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
  var date = new Date().getFullYear();
  let finalGpa;



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

  //Function to crate edit notes
  async function createpost() {
    addEdit = false;
    let postMutation = await mutate(client(), {
      mutation: gql`
      mutation{
		createPost(text: "${text}", guid: ${guid}, userID: "${userID}")
		{
			text
		}
      }`
    });
  }

  //Function + query to check if student has been edited (has edit notes)
  //hasedits == 2 if student has edit notes, hasedits == 1 if there are no edit notes
  let edits = query(client(), {
    query: gql`
		query{
			postfromGUID(guid: ${guid}) {
				text
                createdAt
                postedBy{
                  
                    name
                    
                }
			}
		}`
  });
  let editRes;
  $edits.then(res => {
    editRes = res.data.postfromGUID;
  });
  $: editRes, console.log(editRes);

  let hasEdits;
  async function checkEdits(editRes) {
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
  $: editRes, checkEdits(editRes);

  //Query for student grades
  let studentGrades = query(client(), {
    query: gql`
    query{
        gradefromStudentID(id: "${guid}"){
            grade
            weight
            id
            course{
                courseID
            }        
        }
    }`
  });

  let grades;
  $studentGrades.then(res => {
    grades = res.data.gradefromStudentID;
  });
  $: grades, console.log(grades);

 let final22
 let finalALPHA
 let finalGPA

  //Query for getting overallgrade (Gpa) from student
  let studentGpa = query(client(), {
    query: gql`
    query{
        overallGradeFromId(id: "${studentId}"){
            grade
            id
        }
    
    }`
  });
  let gpas;
  $studentGpa.then(res => {
    gpas = res.data.overallGradeFromId;
    if(gpas[0] != null || gpas[0] != undefined){
        final22 = gpas[0].grade
        finalALPHA = convert(gpas[0].grade)
    
    }

  });
  $: gpas
  
  $:finalGPA, exportStudent = {
    EMPLID: showAnon ? "anonymous" : guid,
    Name: showAnon ? fullAnonCode : `"${surname}, ${firstname}"` ,
    Grade:  alphanum ? finalALPHA : final22
  };

  //Function to calculate Gpa, total of weights
  let totalweight;              //sum of all student grade weights
  let GPA;                      //Gpa in 22point format
  let ALPHA;                    //Gpa in alpha numeric format
  let degreeClass;              //degree classification
  let gradeNum;                 //number of grades
  let hasAllGrades = false;     //boolean for if a student has all it's grades

  let finalClass;
  console.log("GRADES:" + grades)
  async function getTotal(grades) {
    let total = 0;
    
      if(grades != null || grades != undefined){
        let gradeslength = grades.length;       
        let gradenum = 0;
        let gpa = 0
        if (gradeslength == totalCourses) {
            
            hasAllGrades = true;
            for (let i = 0; i < gradeslength; i++) {
                gradenum += 1;
                total += grades[i].weight;
                gpa += grades[i].weight * grades[i].grade;
            }
        } else {
            for (let i = 0; i < gradeslength; i++) {
                gradenum += 1;
                total += grades[i].weight;
                
            }
        }

        totalweight = total;
        console.log("WEIGHT:" + totalweight)
        GPA = parseInt(Math.round(gpa * 10.0) / 10.0);
        ALPHA = convert(gpa);
        degreeClass = degreeClassification(ALPHA);
        gradeNum = gradenum;
        console.log("GRADES:" + gradeslength)
        console.log("COURSES:" + gradenum)
        console.log("GPA:" + GPA)
        console.log("gpa:" + gpa)
      console.log("TYPE: " + typeof GPA)
      if(typeof GPA == "number"){
        //Function to check Gpa exists. If not, set the Gpa previously calculated above as the student's overall grade
        if ((gradeNum == totalCourses && level == "Fifth") || level == "Fourth") {
          if(gpas != null || gpas != undefined){
            if (gpas.length == 0) {
              
                let gpaMutation = mutate(client(), {
                    mutation: gql`
                        mutation{
		                    createOverallGradeGPA(studentID: "${studentId}", year: ${date}, studentLevel: ${level} , grade: ${GPA} )
		                {
			                grade
		                }
                        }`
                });
            }
          }
        }
        }
    }
    
  }
  $: grades, getTotal(grades);

  //console.log("GRADES: " + grades.length)
  //console.log("COURSES" + totalCourses)



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

  function closeModal() {
    modalIsVisible = false;
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



<div class="columns">
  {#if showAnon}
    <div class="column is-2">{fullAnonCode}</div>
  {:else if showNames}
    <div class="column is-1">{firstname}</div>
    <div class="column is-1">{surname}</div>
  {/if}

  <div class="column is-1">{guid}</div>
  {#if showingLevel != ''}
    <div class="column is-1">{showingLevel}</div>
  {:else}
    <div class="column is-1">{level}</div>
  {/if}

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
            <GradeEditWindow {grade} class="content" />
          {/each}

        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" on:click={() => closeModal()}>
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

    <div class="column is-2">
      <button on:click={() => openModal()} class="button is-light is-danger">
        Edit grades
      </button>
    </div>
  {/await}

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
              <span>Error</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true" />
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
            <span>Error</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true" />
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

  {#if totalweight > 0.9998 && totalweight < 1.0001}
    <div class="column is-1">
      
      {#if alphanum}
        {ALPHA}
      {:else}
        {GPA}
      {/if}

    </div>

    <div class="column is-1">{degreeClass}</div>
  {/if}

  {#await $studentGpa}

    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>

  {:then result}

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

          {#each result.data.overallGradeFromId as gpa}
            <GpaEditWindow {gpa} class="content" />
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

  {#await $studentGpa}

    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>

  {:then result}

    {#if level == 'Fifth' && hasAllGrades == true}
      {#if finalizeGpa == true}
        <div class="column is-7">

          {#each result.data.overallGradeFromId as gpa}
            
            {#if alphanum}
                {convert(gpa.grade)}  &nbsp; &nbsp;
            {:else}
                {gpa.grade} &nbsp; &nbsp; 
            {/if}

            <strong>
              class:&nbsp; {degreeClassification(convert(gpa.grade))}
            </strong>
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

  {/await}

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
</div>
