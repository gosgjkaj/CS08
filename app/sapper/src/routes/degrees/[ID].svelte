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

  let searchString = "";

  let currentYear = new Date().getFullYear();
  let selectedYear = currentYear;
  let selectedLevel = "";
  let finalizeGpa = false;
  let allowEdits = false;
  let students;

  //Leo's Query
  let courses = query(client(), {query: gql`
		query($year: Int!){
			coursesFromYear(year: $year){
				courseID
				
				id
			}
		}`,
		variables: { year }
  })

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
  let yearRuns = [
    { id: 2004, text: "Year 2004-2005" },
    { id: 2018, text: "Year 2018-2019" },
    { id: 2019, text: "Year 2019-2020" },
    { id: 2020, text: "Year 2020-2021" },
    { id: 2021, text: "Year 2021-2022" }
  ];

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
    yearDifference = selectedYear - currentYear;
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
        <div class="buttons">
          {#each result.data.getCoursesByDegree as courseweight}
            <button
              on:click={gotoCourse(courseweight.course.courseID)}
              class="button is-link is-light">
              {courseweight.course.name}
            </button>
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
  <div class="container is-fluid">
    <div class="notification">

      <!-- select year showing -->
      <div class="select is-info is-large">
        <select bind:value={selectedYear}>
          {#each yearRuns as yearRun}
            <option value={yearRun.id}>{yearRun.text}</option>
          {/each}
        </select>
      </div>
      <!-- select level showing -->
      <button
        on:click={() => (selectedLevel = '')}
        class="button is-large is-info is-outlined">
        Show All
      </button>
      {#each levels as level}
        <button
          on:click={() => (selectedLevel = level.id)}
          class="button is-large is-info is-outlined">
          {level.text}
        </button>
      {/each}

    </div>
  </div>

  <!-- Title Bar -->
  <div class="container is-fullhd ">
    <div class="notification">

      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-5">
              <!-- Search String change -->
              <strong>
                Students for {searchString.trim().length > 0 ? 'search query ' + searchString : ' Degree ' + anonCode}
              </strong>
            </p>
          </div>
        </div>

        <!-- Search  -->
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

        <!-- End of Search -->

      </nav>
    </div>
  </div>

  {#await $studentsearch}
    <div class="section">
      <progress class="progress is-small is-info" max="100" />
    </div>
  {:then result}

    <div class="box ">

      <nav class="level" style="margin: 5px 1.5%;">
        <div class="level-left">
          <div class="buttons">
            <button
              class="button is-link is-small"
              on:click={() => toggleNames()}>
              Names
            </button>
            <button
              class="button is-primary is-small"
              on:click={() => toggleAnon()}>
              Anonymous
            </button>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <button
              class="button is-primary"
              on:click={() => (finalizeGpa = true)}>
              Finalize
            </button>
          </div>
          {#if finalizeGpa == true}
            <div class="level-item">
              <button
                class="button is-danger"
                on:click={() => (allowEdits = true)}>
                Edit
              </button>
            </div>
          {/if}
          <button on:click={() => exportStudents()}>Export</button>
        </div>

      </nav>

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

<!-- What Leo let out, showing courses in degree. Just in case you want it-->

<!--

    <select bind:value={year} on:change={()=>courses.refetch({year})} >
	{#each yearRuns as yearRun}
		<option value={yearRun.id}> {yearRun.text}</option>
	{/each}
		</select>
    


    {#await $courses}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then results}
        {#await $coursesByDegree}
        <div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
        {:then result}  
        <div class="box has-background-info">
        <p class="title has-text-white">Courses in degree: (Click button to check course detail)</p>
        </div>
            <div class="box buttons">
            {#each result.data.getCoursesByDegree as coursesFromDegree}
                {#each results.data.coursesFromYear as course}
                    {#if coursesFromDegree.course.courseID == course.courseID}
                        <button class="button is-large is-info is-outlined">{course.courseID} </button>
                    {/if}
                {/each} 
            {/each}
            </div>
            
        {:catch}
            <p class="content has-background-danger ">failed to load courses</p>
        {/await}
    {:catch}
		<p class="content has-background-danger ">failed to load courses</p>
	{/await}

-->

