<script>
  import { query } from "svelte-apollo";
  import { GET_CourseDegreeWeight_GQL } from "../utils/gql/gqloperations";
  import { client } from '../gqlClient';

  export let selectedCourse="", 
    degreeID = "";

  console.log("degreeID=", degreeID);
  $: courses = query(client(), {
    query: GET_CourseDegreeWeight_GQL,
    variables: { degree:degreeID }
  });
</script>

<div>
  {#await $courses}
    Loading courses for degree {degreeID}
  {:then result}
  <p>Loading courses for degree {degreeID}</p>
      <select bind:value={selectedCourse}>
      <option value="" disabled>-- Select--</option>
        {#each result.data.coursesSearch as course}
          <option value={course.id}>{course.name} </option>
        {/each}
      </select>
  {:catch error}
    Error: {error}
  {/await}

</div>
