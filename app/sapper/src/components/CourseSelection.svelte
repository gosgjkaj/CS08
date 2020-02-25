<script>
  import { query } from "svelte-apollo";
  import { GET_COURSES_GQL } from "../utils/gql/gqloperations";
  import { client } from '../gqlClient';

  export let selectedCourse="", 
  degreeID = "";

  console.log("degreeID=", degreeID);
  const courses = query(client(), {
    query: GET_COURSES_GQL 
  });
</script>

<div>
  {#await $courses}
    Loading courses for degree {degreeID}
  {:then result}
      <select bind:value={selectedCourse}>
      <option value="" disabled>-- Select--</option>
        {#each result.data.getCourses as course}
          <option value={course.id}>{course.name} </option>
        {/each}
      </select>
  {:catch error}
    Error: {error}
  {/await}

</div>