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
  let searchString = "";

 
  let selectedYear = year;
  let selectedLevel = "";
  let finalizeGpa = false;
  let allowEdits = false;
  let students;

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
  $: allCourses, console.log(allCourses);

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

  let degreeName = query(client(), {
    query: gql`
        query{
            namefromDegreeID(id: "${id}"){
                degreeCode
            }
        }`
  });

  let degCode;
  $degreeName.then(res => {
    degCode = res.data.namefromDegreeID;
  });
  $: degCode, console.log(degCode);

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
    { id: 5, text: "Master" }
  ];

  //set sorting level
  function setSortingLevel(id) {
    sortingLevel = id;
  }

  //calculate differnce between current year and selected year
  function calculateDifference(selectedYear) {
    yearDifference = selectedYear - year;
  }

  function gotoCourse(idcourse) {
    goto(`/courses/${idcourse}`);
  }

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
      if (searchString.trim().length > 0) {
        let searchStringArg = searchString.toLowerCase();
        console.log("SEARCH STRING: "+ searchStringArg)

        if (selectedLevel == "") {
          displayStudents = students.filter(
            student =>
              2 < selectedYear - student.entryYear &&
              selectedYear - student.entryYear < 6 &&
              selectedYear >= student.entryYear &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg))
          );
        } else {
          displayStudents = students.filter(
            student =>
              selectedYear - student.entryYear == selectedLevel &&
              selectedYear >= student.entryYear &&
              (student.firstname.toLowerCase().includes(searchStringArg) ||
                student.surname.toLowerCase().includes(searchStringArg))
          );
        }
      } else {
        if (selectedLevel == "") {
          displayStudents = students.filter(
            student =>
              2 < selectedYear - student.entryYear &&
              selectedYear - student.entryYear < 6 &&
              selectedYear >= student.entryYear
          );
        } else {
          displayStudents = students.filter(
            student =>
              selectedYear - student.entryYear == selectedLevel &&
              selectedYear >= student.entryYear
          );
        }
      }
    }

    if (displayStudents != null) {
      exportList = Array.from(displayStudents);
    }
  }
  $: selectedYear, displayEntries();
  $: selectedYear, console.log(selectedYear);
  $: selectedLevel, displayEntries();

  function exportStudents() {
    let headers = {
      EMPLID: "EMPLID",
      Name: "Name",
      Grade: "Grade"
    };

    let fileName = `"${anonCode}_${selectedYear}"`;
    downloadCSV(headers, exportList, fileName);
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
            <h1 class="title">{degree.degreeCode}</h1>
          </div>
        </div>
      </section>
    {/each}
  {/await}

  <nav class="level" style="margin: 5px 1.5%;">
    <div class="level-left">

      <h1>Courses in degree: &nbsp; &nbsp;</h1>

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
  </nav>

  <!-- This div select sorting values -->
  <div class="container is-fluid notification">
    <div style="display:flex; flex">

      <!-- select year showing -->
      <div class="select is-info is-large">
        <select bind:value={selectedYear} style="margin-right:10px">
          {#each yearRuns as yearRun}
            <option value={yearRun.id}>{yearRun.text}</option>
          {/each}
        </select>
      </div>
      <!-- select level showing -->
      <button
        on:click={() => (selectedLevel = '')} 
        class="button is-large is-info is-outlined"  style="margin-right:5px">
        Show All
      </button>
      {#each levels as level}
        <button
          on:click={() => (selectedLevel = level.id)} 
          class="button is-large is-info is-outlined" style="margin-right:5px">
          {level.text}
        </button>
      {/each}
      
      <div style="margin-left: auto; align-self: center">
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <p class="control has-icons-right">
                <input
                  id="searchStringElement"
                  on:input={displayEntries}
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

      <div style="margin-left:auto; margin-right:2.5%">
        <button class="button is-primary" on:click={() => (finalizeGpa = true)}>Finalize</button>
        {#if finalizeGpa == true}
            <button class="button is-danger" on:click={() => (allowEditing())}>Edit</button>
        {/if}
        <button class="button is-danger" on:click={() => exportStudents()}>Export</button>
      </div>

    </div>

    <div class="box">
      <div class="columns has-text-weight-bold">
        <div class="column is-1">Firstname</div>
        <div class="column is-1">Surname</div>
        <div class="column is-1">GUID</div>
        <div class="column is-1">Level</div>
        <div class="column is-3">Grade details</div>
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
        {#each displayStudents as { id, firstname, surname, guid, entryYear, level }, i}
          <StudentDegreeRow bind:exportStudent={exportList[i]} {selectedYear} {entryYear} {level} studentId={id} {firstname} {surname} {guid}
            showingLevel={''} {allowEdits} {finalizeGpa} {totalCourses} {showAnon} {showNames} {anonCode} {id} {twentyTwo} {alphanum} class="content" />
        {/each}
      {/if}
    </div>

  {/await}
{/if}

