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
    console.log("CourseDegreeWtSelection::afterUpdate, degreeID=", degreeID);
    if (degreeID) {
      courses.refetch({ where: { degree: degreeID } });
      console.log("CourseDegreeWtSelection:: after refetch");
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
    <p style="color: red">{errorMessage}</p>
    <select name="test" bind:value={selectedCourse}  on:change="{() => setWeight(this.value)}" >
      <option value="" disabled>-- Select--</option>
      {#each result.data.getcourseDegreeWeights as CDWeight}
         { map.set(CDWeight.course.id, CDWeight.weight) } 
        <option value={CDWeight.course.id}>{CDWeight.course.name}</option>
      {:else}
        {errorMessage="Courses for this degree has not been created yet. Please create courses."}
      {/each}
    </select>
  {:catch error}
    Error: {error}
  {/await}

</div>