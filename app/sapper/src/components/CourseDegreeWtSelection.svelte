<script>
  import { query } from "svelte-apollo";
  import { GET_CourseDegreeWeight_GQL } from "../utils/gql/gqloperations";
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from "svelte";
  import { client } from '../gqlClient';

  function setWeight(courseKey){
    gradevalue=map.get(courseKey);
  }

  export let selectedCourse = "",
    degreeID = "00002", 
    errorMessage="",gradevalue=0 ;

  var map = new Map();

  afterUpdate(() => {
   
    if (degreeID) {
      courses.refetch({ where: { degree: degreeID } });
     
    }
  });
  let courses = query(client(), {
    query: GET_CourseDegreeWeight_GQL,
    variables: { where: { degree: degreeID } }
  });
</script>

<div>
  {#await $courses}
    Loading courses for degree {degreeID}
  {:then result}
    <p style="color: red">{errorMessage}</p> <div class="select is-primary ">
        <select  name="test" bind:value={selectedCourse}  on:change="{() => setWeight(selectedCourse)}" >
      <option value="" disabled>-- Select--</option>
      {#each result.data.getcourseDegreeWeights as CDWeight}
         { map.set(CDWeight.course.id, CDWeight.weight) } 
        <option value={CDWeight.course.id}>{CDWeight.course.name}</option>
      {:else}
        {errorMessage="Courses for this degree has not been created yet. Please create courses."}
      {/each}
    </select>
    </div>
  {:catch error}
    Error: {error}
  {/await}

</div>