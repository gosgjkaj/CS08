<script>
  import ApolloClient from "apollo-boost";
  import { query, mutate } from "svelte-apollo";
  import { client } from "../gqlClient";
  import yearRuns from "../utils/js/YearRuns";
  import { session } from "../stores";




  import {
    GET_COURSERUNS_GQL,
    ADD_COURSERUN_GQL,
    EDIT_COURSERUN_GQL,
    DELETE_COURSERUN_GQL
  } from "../utils/gql/gqloperations";
  import Card from "../components/Card.svelte";
  //import TitleBar from '../components/TitleBar.svelte'
  import LevelSelection from "../components/LevelSelection.svelte";
  import YearSelection from "../components/YearSelection.svelte";
  
  function checkUser(){
    if($session.user!=null){
      return $session.user.role=="Restricted"
  }
}
  let restricted =checkUser()

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
  function resetSearch() {
    searchString = "";
    GET_COURSERUNS_LIST.refetch({ searchString });
  }

  function SearchEvent(e) {
    let TargetValue = e.target.value;
    searchString = TargetValue;
   
    GET_COURSERUNS_LIST.refetch({ searchString });
  }
  function OnYearDropDownChange() {
   
    RefreshYearData();
  }
  function onNewCourseClick() {
    
    initNewCourseItem();
  }

  function validateCourse() {
   
    if (
      (currentCourseObject.year && currentCourseObject.year.length<1) ||
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
          year: currentCourseObject.year,
          level: currentCourseObject.level,
          courseID: currentCourseObject.courseID,
          name: currentCourseObject.name,
          info: currentCourseObject.info
        }
      };
     

      const courseEdit = mutate(client(), {
        mutation: EDIT_COURSERUN_GQL,
        variables: EditObject
      })
        .then(data => {
          ResetCourseObject();
          GET_COURSERUNS_LIST.refetch();
        })
        
      closeModal();
    }
  }

  function deleteRecord() {
    
    const courseDelete = mutate(client(), {
      mutation: DELETE_COURSERUN_GQL,
      variables: {
        id: `${currentCourseObject.id}`,
        courseid: `${currentCourseObject.course.id}`
      }
    })
      .then(data => {
        ResetCourseObject();
        GET_COURSERUNS_LIST.refetch();
      })
      
    closeDeleteModal();
  }

  function CreateCourse() {
    if (validateCourse()) {
      const InsertObject = {
        data: {
          year: currentCourseObject.year,
          level: currentCourseObject.level,
          courseID: currentCourseObject.courseID,
          name: currentCourseObject.name,
          info: currentCourseObject.info
        }
      };
   

      const courseCreate = mutate(client(), {
        mutation: ADD_COURSERUN_GQL,
        variables: InsertObject
      })
        .then(data => {
          ResetCourseObject();
          GET_COURSERUNS_LIST.refetch();
        })
        
        
      closeModal();
    }
  }
  //End of APOLLO cLIENT cALLS
  //========================================

  let GET_COURSERUNS_LIST = query(client(), {
    query: GET_COURSERUNS_GQL,
    variables: { searchString }
  });

  function ReloadCourses() {
    GET_COURSERUNS_LIST.refetch();
    //GET_COURSERUNS_LIST.refetch({ year });
  }
  //
  function RefreshYearData() {
  
    ReloadCourses();
  }

  //==========Model Functions ===========

  function onEditCourseClick(EditItemObject) {
    ResetCourseObject();
    let coursetemp = {};
    coursetemp = {
      id: EditItemObject.id,
      year: EditItemObject.course.year,
      level: EditItemObject.course.level,
      year: EditItemObject.year,
      courseID: EditItemObject.course.courseID,
      name: EditItemObject.course.name,
      info: EditItemObject.course.info
    };
   

    currentCourseObject = coursetemp;
    

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
   
    openModal();
  }

  function ResetCourseObject() {
    currentCourseObject = {};
    currentCourseObject = {
      year: "",
      name: "",
      year: "",
      info: "",
      courseID: "",
      level: ""
    };
  }

  async function onSaveCourseClick() {
    try {
      buttonSaveIsLoading = true;
      //logic here

     
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
  <title>Courses</title>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.25.0/slimselect.min.js">

  </script>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.25.0/slimselect.min.css" />
  <!-- <link rel="stylesheet" type="text/css" href="../../node_modules/multi.js/dist/multi.min.css"> -->
  <!-- <script src="../../node_modules/multi.js/dist/multi-es6.min.js"></script> -->
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" /> 
  -->
  <!-- <style>
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
  </style> -->
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
              <strong>
                Courses {searchString.trim().length > 0 ? ' for search query ' + searchString : ''}
              </strong>
            </p>
          </div>
        </div>

        <!-- Search  -->
        <div class="level-left">
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

            {#if searchString.trim().length > 0}
              <p>
                <a
                  href="javascript:;"
                  on:click={resetSearch}
                  class="button is-success">
                  Reset Search
                </a>
                &nbsp;
              </p>
            {/if}
            {#if !restricted}
            <p>
              <a
                href="javascript:;"
                on:click={onNewCourseClick}
                class="button is-success">
                Add Course
              </a>
            </p>
            {/if}
          </div>
        </div>

        <!-- End of Search -->

      </nav>
    </div>
  </div>

  <!-- Start of Iteration Courses -->
  {#await $GET_COURSERUNS_LIST}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then data}

    <section class="section cards">
      <div class="container">
        <div class="columns is-multiline">

          {#each data.data['getCourseRuns'] as currentCourseObject, i}
            <div class="column img1 toaster is-quarter">
              <Card title={currentCourseObject.course.name}>
                <table class="table is-striped is-hoverable">

                  <tr>
                    <td>Level</td>
                    <td>{currentCourseObject.course.level}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{currentCourseObject.year}</td>
                  </tr>
                  <tr>
                    <td>Course ID:</td>
                    <td>{currentCourseObject.course.courseID}</td>
                  </tr>
                  <tr>
                    <td>Details:</td>
                    <td>{currentCourseObject.course.info}</td>
                  </tr>
                </table>
                {#if !restricted}
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
                {/if}
              </Card>
            </div>
          {:else}
            <p class="subtitle is-5 $subtitle-color: $red">
              {#if searchString.trim().length > 0}
                <div>
                  No Courses for the search query {searchString}.
                </div>
              {:else}
                <p>No courses</p>
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
        </div>
        <div class="columns is-desktop">
          <div class="column">
            <label class="label">Year</label>
            <div class="control">
              <!-- <YearSelection
                multiple={true}
                bind:selected={currentCourseObject.year} /> -->

                 <YearSelection
                  bind:selected={currentCourseObject.year}
                multiple={true}
                />
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
                <textarea
                  class="textarea"
                  placeholder="Course Details"
                  bind:value={currentCourseObject.info} />
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
          <label class="label has-text-danger">
            Please confirm you would like to delete this course?
          </label>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class={buttonDeleteClass} on:click={deleteRecord}>
          Delete
        </button>
        <button class="button" on:click={closeDeleteModal}>Cancel</button>
      </footer>
    </div>
  </div>
  <!-- End of Delete Modal -->
{:else}Please log in to access this part of the database.{/if}



             
