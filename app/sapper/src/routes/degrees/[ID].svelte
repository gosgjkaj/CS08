<script context="module">
  export async function preload(page, session) {
    const id = page.params["ID"];
    return { id };
  }
</script>

<script>
  export let id;
  export let twentyTwo = false;
  export let alphanum = false;
  import { session } from "../../stores";
  import { client } from "../../gqlClient";
  import { query, mutate } from "svelte-apollo";
  import { levelconvert } from "../../components/leveldifferences.js";
  import { gql } from "apollo-boost";
  import StudentDegreeRow from "../../components/StudentDegreeRow.svelte";
  import { downloadCSV } from "../../export-csv.js";
  import currentYear  from '../../currentYear.js'
	// hardcoded data
  let year = currentYear
  let save= 0 //used to save calcuations into db
  let searchString = "";
   function checkUser(){
    if($session.user!=null){
      return $session.user.role=="Restricted"
  }
}
  let restricted =checkUser()

  let reload = false 
  let selectedYear = year;
  let selectedLevel = "";
  let finalizeGpa = true;
  let allowEdits = false;
  let students;

  function convertLevel(lev, entr){
    let levels = ["First", "Second", "Third" ,"Fourth" ,"Fifth" ];
  if (selectedYear != year){
    if(lev=="Graduated"){
      return "Graduated"
    }
     return levels[selectedYear-entr-1]
  }else{
    return lev
  }
  }
  function allowEditing(){

      if (allowEdits == false){
        allowEdits = true
      }else if (allowEdits == true){
        allowEdits = false
      }

  }
 
  //query for listing courses in degree
  let coursesByDegree = query(client(), {
    query: gql`
            query{
                getCoursesByDegree(id: "${id}"){
                    id
                    course{
                        courseID
                        level
                        name
                    }
                }
            }`
  });

  let allCourses;
  $coursesByDegree.then(res => {
    allCourses = res.data.getCoursesByDegree;
  });


  let totalCourses;

  async function getCoursesLength(allCourses) {
    let num = 0;

    if (allCourses != null) {
      for (let i = 0; i < allCourses.length; i++) {
        num += 1;
      }

      totalCourses = num;
    }
  }

  $: allCourses, getCoursesLength(allCourses);

  //query for student by degree id from table "student"
  let student = query(client(), {
    query: gql`
        query{
            studentfromDegreeID(id: "${id}"){
                id
                firstname
                surname
                guid
                level
                entryYear       
            }
        }`
  });

  $: student.result().then(res => {
    students = res.data.studentfromDegreeID;
  
  });
  let displayStudents = [];
   $: students, (displayStudents = students);
   $: students, displayEntries();

  let degreeName = query(client(), {
    query: gql`
        query{
            namefromDegreeID(id: "${id}"){
                degreeCode
                name
            }
        }`
  });

  let degCode;
  $degreeName.then(res => {
    degCode = res.data.namefromDegreeID;
  });


  let anonCode;
  async function getCode(degCode) {
    let temp;
    if (degCode != null) {
      temp = degCode[0].degreeCode;
      anonCode = temp;
    }
  }
  $: degCode, getCode(degCode);

  //sample year runs
  let yearRuns = [];
  for (let  x= year-6; x <= year; x++) {
    yearRuns.push({ id: x, text: `${x}-${x+1}` })
  }

  //levels needed
  let levels = [
    { id: 3, text: "Third" },
    { id: 4, text: "Fourth" },
    { id: 5, text: "Fifth" }
  ];

  let showAnon = false;
  let showNames = true;

  function toggleAnon() {
    showAnon = true;
    showNames = false;
  }

  function toggleNames() {
    showAnon = false;
    showNames = true;
  }

  if (finalizeGpa == true) {
    console.log("TRUE");
  }

  function resetSearch() {
    searchString = "";
    displayEntries();
  }

  function clickedButton(lvl){
    selectedLevel= lvl
    if (selectedLevel==""){
      reload=false
    }else{
    reload = true
  }
  }

  let studentsearch = query(client(), {
    query: gql`
            query($searchString: String!){
                studentSearch(id: "${id}", searchString: $searchString){
                    id
                    firstname
                    surname
                    guid
                    level
                    entryYear       
                }
            }`,
    variables: { searchString }
  });

  let exportList = [];


  function displayEntries() {
    if (students != null) {

        let searchStringArg = searchString.toLowerCase();

        if(currentYear== selectedYear){
        if (selectedLevel == "") {
          
          displayStudents = students.filter(
            student =>
             ( 
             (2 < selectedYear - student.entryYear &&
              selectedYear - student.entryYear < 6 &&
              selectedYear >= student.entryYear && student.level !="Graduated" )
               ||(selectedYear==student.entryYear && student.level=="Fifth") 
               ) &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg) || 
                student.guid.toLowerCase().includes(searchStringArg))
          );
        } else {
          displayStudents = students.filter(
            student =>
             ( (2 < selectedYear-student.entryYear &&
             selectedYear - student.entryYear == selectedLevel &&
              selectedYear >= student.entryYear && student.level !="Graduated" ) ||(selectedYear==student.entryYear && selectedLevel==5 &&student.level =="Fifth")) &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg))
          );
        }
        }else{

          if (selectedLevel == "") {
          
          displayStudents = students.filter(
            student =>
             ( 
            ( (2 < selectedYear - student.entryYear &&
              selectedYear - student.entryYear < 6 &&
              selectedYear >= student.entryYear)||(selectedYear==student.entryYear &&student.level=="Graduated" ))
              &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg) || 
                student.guid.toLowerCase().includes(searchStringArg))
             ))
        } else {
          displayStudents = students.filter(
            student =>
             (( (2 < selectedYear-student.entryYear && selectedYear - student.entryYear == selectedLevel ) 
                ||(selectedLevel==5 && student.level =="Fifth")
               ||(selectedYear==student.entryYear &&student.level=="Graduated") )
               &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg))
             )
          );
        }

        }
      
      }
    

    displayStudents=displayStudents
    if (displayStudents != null) {
      exportList = Array.from(displayStudents);
    }
  }
  $: selectedYear, displayEntries();

  $: selectedLevel, displayEntries();
  $: searchString, displayEntries();
  $:save, displayStudents=displayStudents

  function exportStudents() {
    let headers = {
      EMPLID: "StudentID",
      Name: "Name",
      AcPlan : "Acad Plan",
      DegreeHonors: "Degree Honors",

    };

    let fileName = `"${anonCode}_${selectedYear}"`;
    downloadCSV(headers, exportList, fileName);
    exportList = Array.from(displayStudents)
  }
</script>

{#if $session.user}

  {#await $degreeName}
    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>
  {:then result}
    {#each result.data.namefromDegreeID as degree}
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container">
            <h2 class="subtitle">Students in degree:</h2>
            <h1 class="title">{degree.name}</h1>
          </div>
        </div>
      </section>
    {/each}
  {/await}

  <nav class="level" style="margin: 5px 1.5%;">
    <div class="level-left">

      <h1>Courses in degree: &nbsp; &nbsp;</h1>
      
      <!-- showing courses belongs to this degree -->
      {#await $coursesByDegree}
        <div class="section">
          <progress class="progress is-small is-info" max="100" />
        </div>
      {:then result}
        <div style="display:flex">
          {#each result.data.getCoursesByDegree as courseweight}
            <div class="button is-static is-info is-light" style="margin-right:5px">
              <p>{courseweight.course.name}</p>
            </div>
          {/each}
        </div>
      {/await}

    </div>

   
  </nav>

  <!-- This div select sorting values -->
  <div class="container is-fluid notification">
    <div style="display:flex; flex">

      <!-- select year showing -->
      <div class="select is-info is-medium ">
        <select bind:value={selectedYear} style="margin-right:10px">
          {#each yearRuns as yearRun}
            <option value={yearRun.id}>{yearRun.text}</option>
          {/each}
        </select>
      </div>
      <!-- select level showing -->
      <button
        on:click={() =>  clickedButton("")} 
        class="button is-medium is-info is-outlined"  style="margin-right:5px">
        Show All
      </button>
      {#each levels as level}
        <button
          on:click={() =>  clickedButton(level.id)} 
          class="button is-medium is-info is-outlined" style="margin-right:5px">
          {level.text}
        </button>
      {/each}
      
      <!--  -->
      <div style="margin-left: auto; align-self: center">
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <p class="control has-icons-right">
                <input
                  id="searchStringElement"
                  on:input={()=>displayEntries()}
                  bind:value={searchString}
                  class="input is-rounded"
                  type="text"
                  placeholder="Search Student" />
                <span class="icon is-small is-right">
                  <i class="fas fa-search" />
                </span>
              </p>
            </div>
          </div>
          {#if searchString.trim().length > 0}
            <p class="level-item">
              <a
                href="javascript:;"
                on:click={resetSearch}
                class="button is-success">
                Reset Search
              </a>
            </p>
          {/if}
        </div>
      </div>

    </div>
  </div>


  {#await $studentsearch}
    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>
  {:then result}

    <!--conatiner for buttons-->
    <div style="display:flex">

      <div style="margin-right:auto; margin-left:2.5%">
        <button class="button is-link" on:click={() => toggleNames()}>Names</button>
        <button class="button is-primary" on:click={() => toggleAnon()}>Anonymous</button>
      </div>
       <div class="level-right">

      <div class="level-item">
        <label class="radio">
          <input
            type="radio"
            name="answer"
            on:click={() => (alphanum = false)}
            value="22pt"
            checked />
          <span>in 22pt</span>
        </label>

        <label class="radio">
          <input
            type="radio"
            name="answer"
            on:click={() => (alphanum = true)}
            value="alpha" />
          <span>in Alpha#</span>
        </label>
      </div>
    </div>

      <div style="margin-left:auto; margin-right:2.5%">
      {#if !restricted}
         <button class="button is-primary" on:click={() => (save = save+1)}>Save All</button>
        {/if}
        {#if finalizeGpa == true && !restricted}
            <button class="button is-danger" on:click={() => (allowEditing())}>Edit</button>
        {/if}
        <button class="button is-danger" on:click={() => exportStudents()}>Export</button>
      </div>

    </div>

    <div class="box has-offset-1">
      <div class="columns has-text-weight-bold">
        <div class="column is-1">Firstname</div>
        <div class="column is-1">Surname</div>
        <div class="column is-1">GUID</div>
        <div class="column is-1">Level</div>
        <div class="column is-2">Grade details</div>
        <div class="column is-1">GPA status</div>
        <div class="column is-1">
          <p>
            22pt
            <strong>/</strong>
            Alpha#
          </p>
        </div>
        <div class="column is-1">Class.</div>
        <div class="column is-3 is-success">Final GPA, Class.</div>

      </div>
      {#if displayStudents != null}
        <!-- Apply all the conditions here -->
        {#each displayStudents as { id, firstname, surname,entryYear, guid, level }, i}
          <StudentDegreeRow bind:exportStudent={exportList[i]} {restricted} level={convertLevel(level,entryYear)} studentID={id} {firstname} {surname} {guid}
            showingLevel={''} {allowEdits} {restricted} {save} bind:selectedYear={selectedYear} bind:reload={reload} bind:selectedLevel={selectedLevel} {finalizeGpa} {totalCourses} {showAnon} {showNames} {anonCode} {id} {twentyTwo} {alphanum} class="content" />
        {/each}
      {/if}
    </div>

  {/await}
{/if}

<footer class="footer">
  <div class="content has-text-centered">
    <p class="has-text-centered">
    School of Chemistry, University of Glasgow
    </p>
  </div>
</footer>

