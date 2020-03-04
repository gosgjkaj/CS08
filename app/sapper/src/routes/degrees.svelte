<script>
  import ApolloClient from "apollo-boost";
  import { query, mutate } from "svelte-apollo";
  import { client } from "../gqlClient";
  import { session } from "../stores";

  import {
    GET_DEGREES_GQL,
    ADD_DEGREE_GQL,
    EDIT_DEGREE_GQL,
    DELETE_DEGREE_GQL,
    ADD_CDWEIGHT_GQL,
    DELETE_CDWEIGHT_GQL,
    EDIT_CDWEIGHT_GQL
  } from "../utils/gql/gqloperations";
  import Card from "../components/Card.svelte";
  import CourseSelection from "../components/CourseSelection.svelte";

  let degree = {};
  let isDataInvalid = false;
  let deleteContext = "";
  let deleteCourse = {};
  let searchString = "",
    DeleteError = "", visible=false;

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

  //Hide /Show
  function ShowOrHideCourses(e) {
    e.preventDefault();
    const ButtonID = e.target.id;
    var TargetElementID = 'CrsOffered' + ButtonID;
//    alert(TargetElementID);

    var x = document.getElementById(TargetElementID);
    if (x.style.display === "none") {
      x.style.display = "block";
      document.getElementById(ButtonID).textContent = 'Collapse';
    } else {
      x.style.display = "none";
            document.getElementById(ButtonID).textContent = 'See Courses';
    }
  }

  //===================SDWeight functions variables etc ==========
  let TempCourseId = "00001";
  let buttonSDWeightSaveIsLoading = false;
  $: buttonSDWeightSaveClass =
    buttonSDWeightSaveIsLoading === true
      ? "button is-success is-loading"
      : "button is-success";

  let SDWeightEditObject = {};
  let modalSDWeightIsVisible = false;
  let isSDWeightDataInvalid = false;
  $: modalSDWeightClass =
    modalSDWeightIsVisible === true ? "modal is-active" : "modal";

  function openSDWeightModal() {
    isSDWeightDataInvalid = false;
    modalSDWeightIsVisible = true;
  }

  function closeSDWeightModal() {
    modalSDWeightIsVisible = false;
  }
  function validateSDWeight() {
    console.log("validateSDWeight::SDWeightEditObject=", SDWeightEditObject);
    if (!SDWeightEditObject.courseid || !SDWeightEditObject.weight) {
      isSDWeightDataInvalid = true;
      return false;
    } else {
      isSDWeightDataInvalid = false;
      return true;
    }
  }
  function AddCDWeightClick(degreeObject) {
    SDWeightEditObject = {};
    SDWeightEditObject.degree = degreeObject.id;
    SDWeightEditObject.weight = 0;
    SDWeightEditObject.courseid = "";

    console.log("EditCourseDegreeWeight::degreeObject=", degreeObject);
    console.log(
      "EditCourseDegreeWeight::SDWeightEditObject=",
      SDWeightEditObject
    );
    openSDWeightModal();
  }

  function EditCDWeightClick(coursedetails) {
    console.log("EditCourseDegreeWeight::coursedetails=", coursedetails);
    SDWeightEditObject = coursedetails;
    SDWeightEditObject.courseid = SDWeightEditObject.course.id;
    openSDWeightModal();
  }

  function DeleteCDWeightClick(coursedetails) {
    SDWeightEditObject = coursedetails;
    console.log("DeleteCourseDegreeWeight::coursedetails=", SDWeightEditObject);
    deleteContext = "SDWeight";
    openDeleteModal();
  }

  function UpdateCDWeightRecord() {
    if (validateSDWeight()) {
      const UpdateObject = {
        data: {
          course: SDWeightEditObject.courseid,
          degree: SDWeightEditObject.degree.id,
          weight: SDWeightEditObject.weight
        },
        where: { id: SDWeightEditObject.id }
      };
      console.log("CDWeight UpdateObject=", UpdateObject);

      const SDWeightUpdate = mutate(client(), {
        mutation: EDIT_CDWEIGHT_GQL,
        variables: UpdateObject
      })
        .then(data => {
          SDWeightEditObject = {};
          GET_DEGREES_LIST.refetch();
          closeSDWeightModal();
        })
        .catch(e => {
          console.error("Error during UPDATE CDWeight : ", e);
        });
    }
  }

  async function saveSDWeight() {
    try {
      buttonSaveIsLoading = true;
      //logic here
      if (SDWeightEditObject.id) {
        UpdateCDWeightRecord();
      } else {
        CreateCDWeightRecord();
      }
    } catch (error) {
      console.log(error);
    } finally {
      buttonSaveIsLoading = false;
    }
  }

  function CreateCDWeightRecord() {
    if (validateSDWeight()) {
      const InsertObject = {
        data: {
          course: SDWeightEditObject.courseid,
          degree: SDWeightEditObject.degree,
          weight: SDWeightEditObject.weight
        }
      };
      console.log("CDWeight InsertObject=", InsertObject);

      const SDWeightCreate = mutate(client(), {
        mutation: ADD_CDWEIGHT_GQL,
        variables: InsertObject
      })
        .then(data => {
          SDWeightEditObject = {};
          GET_DEGREES_LIST.refetch();
          closeSDWeightModal();
        })
        .catch(e => {
          console.error("Error during Insert CDWeight : ", e);
        });
    }
  }

  function deleteSDWeightRecord() {
    let deleteArguments = { id: `${SDWeightEditObject.id}` };
    console.log("deleteSDWeightRecord:: delete arguments=", deleteArguments);

    const degreeSDWtDelete = mutate(client(), {
      mutation: DELETE_CDWEIGHT_GQL,
      variables: { id: `${SDWeightEditObject.id}` }
    })
      .then(data => {
        SDWeightEditObject = {};
        GET_DEGREES_LIST.refetch();
        closeDeleteModal();
      })
      .catch(e => {
        console.error("Error during Delete : ", e);
        DeleteError = e;
      });
  }

  // ====== End of Degree Course Weight etc ===================

  //============Validation etc =======================
  function resetSearch() {
    searchString = "";
    GET_DEGREES_LIST.refetch({ searchString });
  }

  function SearchEvent(e) {
    console.log(
      "e.target.value=",
      e.target.value,
      ", searchString=",
      searchString
    );
    GET_DEGREES_LIST.refetch({ searchString });
  }
  function TitleBarChangeEvent() {
    //console.log("TitleBarChangeEvent called");
  }
  function TitleBarclickEvent() {
    //console.log("TitleBarclickEvent called");
    onNewClick();
  }

  function validateDegree(degree) {
    if (
      degree.degreeCode.length < 1 ||
      degree.name.length < 1 ||
      degree.info.length < 1
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
  function EditDegree() {
    if (validateDegree(degree)) {
      const EditObject = {
        id: degree.id,
        data: {
          degreeCode: degree.degreeCode,
          name: degree.name,
          info: degree.info
        }
      };
      console.log("EditObject=", EditObject);

      const courseEdit = mutate(client(), {
        mutation: EDIT_DEGREE_GQL,
        variables: EditObject
      })
        .then(data => {
          degree = {};
          GET_DEGREES_LIST.refetch();
          closeModal();
        })
        .catch(e => {
          console.error("Error during Edit Degree : ", e);
        });
    }
  }

  function deleteRecord() {
    if (deleteContext === "Degree") {
      deleteDegreeRecord();
    }
    if (deleteContext === "SDWeight") {
      deleteSDWeightRecord();
    }
    deleteContext = "";
  }

  function deleteDegreeRecord() {
    const degreeDelete = mutate(client(), {
      mutation: DELETE_DEGREE_GQL,
      variables: { id: `${degree.id}` }
    })
      .then(data => {
        degree = {};
        GET_DEGREES_LIST.refetch();
        closeDeleteModal();
      })
      .catch(e => {
        console.error("Error during Delete : ", e);
        DeleteError = e;
      });
  }

  function CreateDegree() {
    if (validateDegree(degree)) {
      const InsertObject = {
        data: {
          degreeCode: degree.degreeCode,
          name: degree.name,
          info: degree.info
        }
      };
      console.log("Degree InsertObject=", InsertObject);

      const degreeCreate = mutate(client(), {
        mutation: ADD_DEGREE_GQL,
        variables: InsertObject
      })
        .then(data => {
          degree = {};
          GET_DEGREES_LIST.refetch();
          closeModal();
        })
        .catch(e => {
          console.error("Error during Insert Degree : ", e);
        });
    }
  }
  //End of APOLLO cLIENT cALLS
  //========================================

  let GET_DEGREES_LIST = query(client(), {
    query: GET_DEGREES_GQL,
    variables: { searchString }
  });

  function ReloadCourses() {
    GET_DEGREES_LIST.refetch();
  }
  //

  //==========Model Functions ===========

  function onItemClick(item) {
    degree = item;
    openModal();
  }

  async function onDeleteClick(item) {
    degree = item;
    deleteContext = "Degree";
    openDeleteModal();
  }

  function closeModal() {
    modalIsVisible = false;
  }

  function closeDeleteModal() {
    modalDeleteIsVisible = false;
  }

  function openModal() {
    isDataInvalid = false;
    modalIsVisible = true;
  }

  function openDeleteModal() {
    DeleteError = "";
    modalDeleteIsVisible = true;
  }

  function onNewClick() {
    degree = {
      name: "",
      info: "",
      degreeCode: ""
    };
    openModal();
  }

  async function saveDegree() {
    try {
      buttonSaveIsLoading = true;
      //logic here
      if (degree.id) {
        EditDegree();
      } else {
        CreateDegree();
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
  <title>List of Degrees</title>
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
              <strong>
                List of Degrees {searchString.trim().length > 0 ? 'for search query ' + searchString : ''}
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
                  on:input={SearchEvent}
                  bind:value={searchString}
                  class="input is-rounded"
                  type="text"
                  placeholder="Search Degree" />
                <span class="icon is-small is-right">
                  <i class="fas fa-search" />
                </span>
              </p>

            </div>

            <div class="level-right">
              <p class="level-item">
                <a
                  href="javascript:;"
                  on:click={TitleBarclickEvent}
                  class="button is-success">
                  Add New Degree
                </a>
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

  <!-- Start of Iteration Courses -->
  {#await $GET_DEGREES_LIST}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then data}

    <section class="section cards">
      <div class="container">
        <div class="columns is-multiline">

          {#each data.data['getDegrees'] as degree, i}
            <div class="column img1 toaster is-quarter">
              <Card title={degree.name}>
                <table class="table is-striped is-hoverable">
                  <tr>
                    <td>Name</td>
                    <td>{degree.name}</td>
                  </tr>

                  <tr>
                    <td>Degree Code</td>
                    <td>{degree.degreeCode}</td>
                  </tr>
                  <tr>
                    <td>Details:</td>
                    <td>{degree.info}</td>
                  </tr>
                </table>

                <!-- Degree Action buttons -->
                <div class="columns is-centered">
                  <div class="column">
                    <a
                      class="button is-success"
                      href="javascript:;"
                      on:click={() => onItemClick(degree)}>
                      <span class="icon is-small">
                        <i class="fas fa-edit" />
                      </span>
                      <span>Edit Degree</span>
                    </a>
                  </div>
                  <div class="column">
                    <a
                      class="button is-danger"
                      href="javascript:;"
                      on:click={() => onDeleteClick(degree)}>
                      <span class="icon is-small">
                        <i class="fas fa-trash" />
                      </span>
                      <span>Delete Degree</span>
                    </a>
                  </div>

                  <div class="column">
                    <a
                      class="button is-success"
                      href="javascript:;"
                      on:click={() => AddCDWeightClick(degree)}>
                      <span class="icon is-small">
                        <i class="fas fa-plus" />
                      </span>
                      <span>Add Course</span>
                    </a>
                  </div>
                </div>

                <!-- End of Degree Action buttons -->

                <!-- Courses Start here -->
                {#if degree['courseDegreeWeights'].length > 0}
                  <p>
                    <span class="tag is-primary is-large">
                     {degree['courseDegreeWeights'].length} Course(s) Offered:
                    </span>  
                
                    <button id={degree.id} class="button" on:click={ShowOrHideCourses} >See Courses</button>

                  </p>

                  <div id="CrsOffered{degree.id}" style="display: none;">
                    <div class="columns">
                      <div class="column is-one-fourth">
                        <strong>Course</strong>
                      </div>
                      <div class="column is-one-fourth">
                        <strong>Weight</strong>
                      </div>
                      <div class="column is-one-fourth" />
                      <div class="column is-one-fourth" />
                    </div>

                    {#each degree['courseDegreeWeights'] as courseDegreeWeightsdetails, i}
                      <div class="columns">
                        <div class="column is-one-fourth">
                          {courseDegreeWeightsdetails.course.name}
                        </div>
                        <div class="column is-one-fourth">
                          {courseDegreeWeightsdetails.weight}
                        </div>
                        <div class="column is-one-fourth">
                          <a
                            href="javascript:;"
                            on:click={() => EditCDWeightClick(courseDegreeWeightsdetails)}
                            class="button is-success">
                            Edit
                          </a>
                        </div>
                        <div class="column is-one-fourth">
                          <a
                            href="javascript:;"
                            on:click={() => DeleteCDWeightClick(courseDegreeWeightsdetails)}
                            class="button is-danger">
                            Delete
                          </a>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}

                <footer class="card-footer" />
              </Card>
            </div>
          {:else}
            <p class="subtitle is-5 $subtitle-color: $red">
              {#if searchString.trim().length > 0}
                <div>
                  No degrees found for the search query {searchString}.
                  <a
                    href="javascript:;"
                    on:click={resetSearch}
                    class="button is-success">
                    Reset Search
                  </a>

                </div>
              {:else}
                <p>No degrees listed yet.</p>
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
          {degree.name ? degree.name : 'Add New Degree'}
        </p>
        <button class="delete" aria-label="close" on:click={closeModal} />
      </header>
      <section class="modal-card-body">

        <div class="columns is-desktop">
          <div class="column field">
            <label class="label">Degree Code*</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Degree Code"
                bind:value={degree.degreeCode} />
            </div>
          </div>

          <div class="column field">
            <label class="label">Degree Name*</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder=""
                bind:value={degree.name} />
            </div>
          </div>
        </div>

        <div class="columns is-desktop">
          <div class="column field">
            <label class="label">Details</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder=""
                bind:value={degree.info} />
            </div>
          </div>
        </div>

        <div>
          {#if isDataInvalid}
            <p class="help is-danger">Please enter all the required fields!</p>
          {/if}
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class={buttonSaveClass} on:click={saveDegree}>
          Save changes
        </button>
        <button class="button" on:click={closeModal}>Cancel</button>
      </footer>
    </div>
  </div>

  <!-- SDWeight Modal starts here -->
  <div class={modalSDWeightClass}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {SDWeightEditObject.id ? 'Edit Course Weight ' : 'Add Course Weight'}
        </p>
        <button
          class="delete"
          aria-label="close"
          on:click={closeSDWeightModal} />
      </header>
      <section class="modal-card-body">

        <div class="columns is-desktop">
          <div class="column field">
            <label class="label">Course*</label>
            <div class="control">
              <CourseSelection
                degreeID={SDWeightEditObject.degree}
                bind:selectedCourse={SDWeightEditObject.courseid} />
            </div>
          </div>

          <div class="column field">
            <label class="label">Weight*</label>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder=""
                bind:value={SDWeightEditObject.weight} />
            </div>
          </div>
        </div>

        <div>
          {#if isSDWeightDataInvalid}
            <p class="help is-danger">Please enter all required fields!</p>
          {/if}
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class={buttonSDWeightSaveClass} on:click={saveSDWeight}>
          Save changes
        </button>
        <button class="button" on:click={closeSDWeightModal}>Cancel</button>
      </footer>
    </div>
  </div>

  <!-- SDWeight Modal ends  here -->
  <!-- End of Modals -->

  <!-- Delete Modal  -->
  <div class={modalDeleteClass}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title is-danger">Delete this degree?</p>
        <button class="delete" aria-label="close" on:click={closeDeleteModal} />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label is-danger">
            Are you sure you would like to delete the degree named "{degree.name}"
            ?
          </label>
        </div>
        <div>
          {#if DeleteError}
            <p class="help is-danger">{DeleteError}}</p>
          {/if}
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
{:else}

	<div class="container" style="display:flex; jusity-content:center">
		<h1 style="font-size: 55px; font-weight: bold; text-align: center; margin:20px" >Please log in to access this part of the database.</h1>
	</div>

{/if}
