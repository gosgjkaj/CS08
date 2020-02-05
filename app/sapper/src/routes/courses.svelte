<script>
  import ApolloClient from "apollo-boost";
  import { query, mutate } from "svelte-apollo";
  import { client } from '../gqlClient';
  import yearRuns from '../utils/js/YearRuns';


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

  let course = {};
  let isDataInvalid = false;
  let deleteCourse = {};

  let selectedYear = yearRuns[0];

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
  function validateCourse(course) {
    if (
      course.courseID.length < 1 ||
      course.name.length < 1 ||
      course.info.length < 1
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
    if (validateCourse(course)) {
      const EditObject = {
        id: course.id,
        data: {
          level: course.level,
          year: course.year,
          courseID: course.courseID,
          name: course.name,
          info: course.info
        }
      };
      console.log("EditObject=", EditObject);

      const courseEdit = mutate(client(), {
        mutation: EDIT_COURSE_GQL,
        variables: EditObject
      })
        .then(data => {
          course = {};
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
      variables: { id: `${course.id}` }
    })
      .then(data => {
        course = {};
        GET_COURSES_LIST.refetch();
      })
      .catch(e => {
        console.error("Error during Delete : ", e);
      });
    closeDeleteModal();
  }

  function CreateCourse() {
    if (validateCourse(course)) {
      const InsertObject = {
          level: course.level,
          year: course.year,
          courseID: course.courseID,
          name: course.name,
          info: course.info
      };
      console.log("InsertObject=", InsertObject);

      const courseCreate = mutate(client(), {
        mutation: ADD_COURSE_GQL,
        variables: InsertObject
      })
        .then(data => {
          course = {};
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
    variables: { year: selectedYear.id }
  });

  function ReloadCourses() {
    GET_COURSES_LIST.refetch({ year: selectedYear.id });
  }
  //
  function RefreshYearData() {
    ReloadCourses();
  }

  //==========Model Functions ===========

  function onItemClick(item) {
    course = item;
    openModal();
  }

  async function onDeleteClick(item) {
    course = item;
    openDeleteModal();
  }

  function closeModal() {
    modalIsVisible = false;
  }

  function closeDeleteModal() {
    modalDeleteIsVisible = false;
  }

  function openModal() {
    modalIsVisible = true;
  }

  function openDeleteModal() {
    modalDeleteIsVisible = true;
  }

  function onNewClick() {
    course = {
      name: "",
      year: "Y1920",
      info: "",
      courseID: "",
      level: "First"
    };
    openModal();
  }

  async function save() {
    try {
      buttonSaveIsLoading = true;
      //logic here
      if (course.id) {
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

<!-- Title Bar -->
<div class="container is-fullhd ">
  <div class="notification">

    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>Courses for Year {selectedYear.text}</strong>
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <!-- Dropdown items here -->
          <div class="select">
            <select
              bind:value={selectedYear}
              on:change={() => {
                RefreshYearData();
              }}>
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
            on:click={() => onNewClick()}
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

        {#each data.data['getCoursesFromYear'] as course, i}
          <div class="column img1 toaster is-quarter">
            <Card title={course.name}>
              <table class="table is-striped is-hoverable">
                <tr>
                  <td>Year</td>
                  <td>{course.year}</td>
                </tr>
                <tr>
                  <td>Level</td>
                  <td>{course.level}</td>
                </tr>
                <tr>
                  <td>Course ID:</td>
                  <td>{course.courseID}</td>
                </tr>
                <tr>
                  <td>Details:</td>
                  <td>{course.info}</td>
                </tr>
              </table>
              <footer class="card-footer">
                <div class="columns is-centered">
                  <div class="column">
                    <a
                      class="button is-success"
                      href="javascript:;"
                      on:click={() => onItemClick(course)}>
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
                      on:click={() => onDeleteClick(course)}>
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
        {course.name ? course.name : 'Add New Course'}
      </p>
      <button class="delete" aria-label="close" on:click={closeModal} />
    </header>
    <section class="modal-card-body">

      <div class="columns is-desktop">
        <div class="column field">
          <label class="label">Course ID*</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder=""
              bind:value={course.courseID} />
          </div>
        </div>
        <div class="column field">
          <label class="label">Year</label>
          <div class="control">
            <YearSelection bind:selected={course.year} />
          </div>
        </div>

        <div class="column field">
          <label class="label">Level</label>
          <div class="control">
            <LevelSelection bind:selected={course.level} />
          </div>
        </div>

      </div>

      <div class="field">
        <label class="label">Course Name*</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Course Name(Required)"
            bind:value={course.name} />
        </div>
      </div>

      <div class="field">
        <label class="label">Course Details *</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Course Details"
            bind:value={course.info} />
        </div>
      </div>
      <div>
        {#if isDataInvalid}
          <p class="help is-danger">Please enter all required fields!</p>
        {/if}
      </div>

    </section>
    <footer class="modal-card-foot">
      <button class={buttonSaveClass} on:click={save}>Save changes</button>
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
      <p class="modal-card-title is-danger">Delete This Record?</p>
      <button class="delete" aria-label="close" on:click={closeDeleteModal} />
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label is-danger">DELETE Record "{course.name}" ?</label>
      </div>
      <div class="field">
        <label class="label has-text-dange">Are you 100% sure?</label>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button class={buttonDeleteClass} on:click={deleteRecord}>Delete</button>
      <button class="button" on:click={closeDeleteModal}>Cancel</button>
    </footer>
  </div>
</div>
<!-- End of Delete Modal -->
