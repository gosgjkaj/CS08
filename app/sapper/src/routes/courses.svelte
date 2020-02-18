<script>
  import ApolloClient from "apollo-boost";
  import { query, mutate } from "svelte-apollo";
  import { client } from '../gqlClient';
  import yearRuns from '../utils/js/YearRuns';
  import { session } from '../stores';


  import {
    GET_ALL_COURSES_GQL,
    GET_YEAR_COURSES_GQL,
    DELETE_COURSE_GQL,
    ADD_COURSE_GQL,
    EDIT_COURSE_GQL
  } from "../utils/gql/gqloperations";
  import Card from "../components/Card.svelte";
  import LevelSelection from "../components/LevelSelection.svelte";
  import YearSelection from "../components/YearSelection.svelte";

  let currentCourseObject = {};
  let isDataInvalid = false;
  let deleteCourse = {};

  let selectedYear = yearRuns[0];

  let searchString = "";

  let buttonSaveIsLoading = false;
  $: buttonSaveClass =
    buttonSaveIsLoading === true
      ? "button is-success is-loading"
      : "button is-success";

  let buttonDeleteIsLoading = false;
  $: buttonDeleteClass =
    buttonDeleteIsLoading === true
      ? "button is-danger is-loading"
      : "button is-danger";

  let modalIsVisible = false;
  $: modalClass = modalIsVisible === true ? "modal is-active" : "modal";

  let modalDeleteIsVisible = false;
  $: modalDeleteClass =
    modalDeleteIsVisible === true ? "modal is-active" : "modal";

  //============Validation etc =======================

  //Search String change

  function  resetSearch() {
    searchString = "";
    GET_COURSES_LIST.refetch({ searchString });
  }

  function SearchEvent(e) {
    console.log(
      "e.target.value=",
      e.target.value,
      ", searchString=",
      searchString
    );
    GET_COURSES_LIST.refetch({ searchString });
  }

  function OnYearDropDownChange() {
    //console.log("OnYearDropDownChange called");
    RefreshYearData();
  }
  function onNewCourseClick() {
    //console.log("TitleBarclickEvent called");
    initNewCourseItem();
  }

  function validateCourse() {
    console.log("validateCourse:: currentCourseObject=", currentCourseObject);
    if (
      !currentCourseObject.year ||
      !currentCourseObject.level || 
      currentCourseObject.courseID.length < 1 ||
      !currentCourseObject.name ||
      !currentCourseObject.info 
    ) {
      isDataInvalid = true;
      return false;
    } else {
      isDataInvalid = false;
      return true;
    }
  }

  //=== end of Validation etc =========================

  //=============  APOLLO cLIENT cALLS ====================
  function EditCourse() {
    if (validateCourse()) {
      const EditObject = {
        id: currentCourseObject.id,
        data: {
          level: currentCourseObject.level,
          year: currentCourseObject.year,
          courseID: currentCourseObject.courseID,
          name: currentCourseObject.name,
          info: currentCourseObject.info
        }
      };
      console.log("EditObject=", EditObject);

      const courseEdit = mutate(client(), {
        mutation: EDIT_COURSE_GQL,
        variables: EditObject
      })
        .then(data => {
          ResetCourseObject();
          GET_COURSES_LIST.refetch();
        })
        .catch(e => {
          console.error("Error during Edit Course : ", e);
        });
      closeModal();
    }
  }

  function deleteRecord() {
    const courseDelete = mutate(client(), {
      mutation: DELETE_COURSE_GQL,
      variables: { id: `${currentCourseObject.id}` }
    })
      .then(data => {
        ResetCourseObject();
        GET_COURSES_LIST.refetch();
      })
      .catch(e => {
        console.error("Error during Delete : ", e);
      });
    closeDeleteModal();
  }

  function CreateCourse() {
    if (validateCourse()) {
      const InsertObject = {
          level: currentCourseObject.level,
          year: currentCourseObject.year,
          courseID: currentCourseObject.courseID,
          name: currentCourseObject.name,
          info: currentCourseObject.info
      };
      console.log("InsertObject=", InsertObject);

      const courseCreate = mutate(client(), {
        mutation: ADD_COURSE_GQL,
        variables: InsertObject
      })
        .then(data => {
          ResetCourseObject();
          GET_COURSES_LIST.refetch();
        })
        .catch(e => {
          console.error("Error during Insert Course : ", e);
        });
      closeModal();
    }
  }
  //End of APOLLO cLIENT cALLS
  //========================================

  let GET_COURSES_LIST = query(client(), {
    query: GET_YEAR_COURSES_GQL,
    variables: { year: selectedYear.id, searchString }
  });

  function ReloadCourses() {
    GET_COURSES_LIST.refetch({ year: selectedYear.id });
  }
  //
  function RefreshYearData() {
    ReloadCourses();
  }

  //==========Model Functions ===========

    function onEditCourseClick(EditItemObject) {
    ResetCourseObject();
    //console.log("onEditCourseClick:: currentCourseObject object after reset init:", currentCourseObject);
    //currentCourseObject.degreeIDs.length = 0
    //console.log("onEditCourseClick:: currentCourseObject object after array init:", currentCourseObject);
    let coursetemp = {};
    //console.log("onEditCourseClick:: currentCourseObject object init:", currentCourseObject);
    //currentCourseObject = EditItemObject;
    coursetemp = {
      id: EditItemObject.id,
      level: EditItemObject.level,
      year: EditItemObject.year,
      courseID: EditItemObject.courseID,
      name: EditItemObject.name,
      info: EditItemObject.info
    };
    console.log(
      "onEditCourseClick:: currentCourseObject object temp:",
      coursetemp
    );
    //console.log("onEditCourseClick:: currentCourseObject object :", currentCourseObject);
    currentCourseObject = coursetemp;
    console.log(
      "onEditCourseClick:: currentCourseObject object:",
      currentCourseObject
    );
    openModal();
  }
  async function onDeleteClick(item) {
    currentCourseObject = item;
    openDeleteModal();
  }

  function closeModal() {
    modalIsVisible = false;
    ResetCourseObject();
  }

  function closeDeleteModal() {
    modalDeleteIsVisible = false;
  }

  function openModal() {
    isDataInvalid = false;
    modalIsVisible = true;
  }

  function openDeleteModal() {
    modalDeleteIsVisible = true;
  }

  function initNewCourseItem() {
    ResetCourseObject();
    console.log(
      "initNewCourseItem:: currentCourseObject object=",
      currentCourseObject
    );
    openModal();
  }

  function ResetCourseObject() {
    currentCourseObject = {};
    currentCourseObject = {
      name: "",
      year: "",
      info: "",
      courseID: "",
      level: "",
    };
  }

  async function onSaveCourseClick() {
    try {
      buttonSaveIsLoading = true;
      //logic here

      console.log(
        "onSaveCourseClick:: currentCourseObject object::",
        currentCourseObject
      );
      if (currentCourseObject.id) {
        EditCourse();
      } else {
        CreateCourse();
      }
    } catch (error) {
      console.log(error);
    } finally {
      buttonSaveIsLoading = false;
    }
  }

  //===== End of Modal functions
</script>

<svelte:head>
  <title>Courses for Year {selectedYear.text}</title>
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" /> 
  -->
  <style>
    .select position relative display inline-block margin-bottom 15px width 100%
        select display inline-block width 100% cursor pointer padding 10px 15px
        outline 0 border 0 border-radius 0 background $color--light-grey color
        $color--dark-grey appearance none -webkit-appearance none -moz-appearance
        none &: : -ms-expand display none &: hover,
      &: focus color $color--black background $color--grey &: disabled opacity
        0.5 pointer-events none .select__arrow position absolute top 16px right
        15px width 0 height 0 pointer-events none border-style solid
        border-width 8px 5px 0 5px border-color $color--dark-grey transparent
        transparent transparent .select select: hover ~& .select select: focus
        ~& border-top-color $color--black .select select: disabled ~&
        border-top-color $color--grey;
  </style>
</svelte:head>

{#if $session.user}
<!-- Title Bar -->
<div class="container is-fullhd ">
  <div class="notification">

    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
          <!-- Search String change -->
            <strong>Courses for {searchString.trim().length > 0 ? "search query " + searchString : " Year " + selectedYear.text}</strong>
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
                on:input={SearchEvent}
                bind:value={searchString}
                class="input is-rounded"
                type="text"
                placeholder="Search Course" />
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

      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <!-- Dropdown items here -->
          <div class="select">
          <select bind:value={selectedYear} on:change={OnYearDropDownChange}>
              {#each yearRuns as yearlevel}
                <option value={yearlevel}>{yearlevel.text}</option>
              {/each}
            </select>
            <div class="select__arrow" />
          </div>
          <!-- End of DD items -->

        </div>
        <p class="level-item">
          <a
            href="javascript:;"
            on:click={onNewCourseClick}
            class="button is-success">
            Add New Course
          </a>
        </p>
      </div>
    </nav>
  </div>
</div>

<!-- Start of Iteration Courses -->
{#await $GET_COURSES_LIST}
  <progress class="progress is-small is-primary" max="100">15%</progress>
{:then data}

  <section class="section cards">
    <div class="container">
      <div class="columns is-multiline">

        {#each data.data['coursesSearch'] as currentCourseObject, i}
          <div class="column img1 toaster is-quarter">
            <Card title={currentCourseObject.name}>
              <table class="table is-striped is-hoverable">
                <tr>
                  <td>Year</td>
                  <td>{currentCourseObject.year}</td>
                </tr>
                <tr>
                  <td>Level</td>
                  <td>{currentCourseObject.level}</td>
                </tr>
                <tr>
                  <td>Course ID:</td>
                  <td>{currentCourseObject.courseID}</td>
                </tr>
                <tr>
                  <td>Details:</td>
                  <td>{currentCourseObject.info}</td>
                </tr>
              </table>
              <footer class="card-footer">
                <div class="columns is-centered">
                  <div class="column">
                    <a
                      class="button is-success"
                      href="javascript:;"
                      on:click={() => onEditCourseClick(currentCourseObject)}>
                      <span class="icon is-small">
                        <i class="fas fa-edit" />
                      </span>
                      <span>Edit</span>
                    </a>
                  </div>
                  <div class="column">
                    <a
                      class="button is-danger"
                      href="javascript:;"
                      on:click={() => onDeleteClick(currentCourseObject)}>
                      <span class="icon is-small">
                        <i class="fas fa-trash" />
                      </span>
                      <span>Delete</span>
                    </a>
                  </div>
                </div>
              </footer>
            </Card>
          </div>
        {:else}
          <p class="subtitle is-5 $subtitle-color: $red"> 
              {#if searchString.trim().length> 0}
                <div> 
                  No Courses for the search query {searchString}.  

                </div>
               {:else}
               <p>No courses for selected year {selectedYear.text}</p> 
              {/if}           
            
          </p>  
        {/each}

      </div>
    </div>
  </section>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
<!-- End of Iteration Courses -->

<!-- Modals -->
<div class={modalClass}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {currentCourseObject.name ? currentCourseObject.name : 'Add New Course'}
      </p>
      <button class="delete" aria-label="close" on:click={closeModal} />
    </header>
    <section class="modal-card-body">
      {#if isDataInvalid}
        <p class="help is-danger">Please enter all required fields!</p>
      {/if}

      <div class="columns is-desktop">
        <div class="column field">
          <label class="label">Course ID*</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder=""
              bind:value={currentCourseObject.courseID} />
          </div>
        </div>
        <div class="column field">
          <label class="label">Level</label>
          <div class="control">
            <LevelSelection bind:selected={currentCourseObject.level} />
          </div>
        </div>
        <div class="column field">
          <label class="label">Year</label>
          <div class="control">
            <YearSelection bind:selected={currentCourseObject.year} />
          </div>
        </div>
      </div>
      <div class="columns is-desktop">
        <div class="column field">

          <div class="field">
            <label class="label">Course Name*</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Course Name(Required)"
                bind:value={currentCourseObject.name} />
            </div>
          </div>

        </div>
      </div>

      <div class="columns is-desktop">
        <div class="column field">
          <div class="field">
            <label class="label">Course Details *</label>
            <div class="control">
              <textarea class="textarea" placeholder="Course Details" 
              bind:value={currentCourseObject.info}
              />
            </div>
          </div>
        </div>
      </div>

      <div />

    </section>
    <footer class="modal-card-foot">
      <button class={buttonSaveClass} on:click={onSaveCourseClick}>
        Save changes
      </button>
      <button class="button" on:click={closeModal}>Cancel</button>
    </footer>
  </div>
</div>
<!-- End of Modals -->

<!-- Delete Modal  -->
<div class={modalDeleteClass}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title is-danger">Delete this course?</p>
      <button class="delete" aria-label="close" on:click={closeDeleteModal} />
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label is-danger">Are you sure you would like to delete the course named "{currentCourseObject.name}"?</label>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button class={buttonDeleteClass} on:click={deleteRecord}>Delete</button>
      <button class="button" on:click={closeDeleteModal}>Cancel</button>
    </footer>
  </div>
</div>
<!-- End of Delete Modal -->

{:else}
Please log in to access this part of the database.
{/if}

