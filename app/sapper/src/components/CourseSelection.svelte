<script>
  import { query } from "svelte-apollo";
  import { GET_YEAR_COURSES_GQL } from "../utils/gql/gqloperations";
  import { client } from '../gqlClient';

  // 2. Get the Apollo client from context
  export let selectedCourse, 
    degreeIDPassed = "";

  console.log("degreeIDPassed=", degreeIDPassed);
  const courses = query(client(), {
    query: GET_YEAR_COURSES_GQL,
    variables: { degreeIDPassed }
  });
</script>

<div>
  {#await $courses}
    Loading courses for degree {degreeIDPassed}
  {:then result}
      <select bind:value={selectedCourse}>
      <option value="" disabled>-- Select--</option>
        {#each result.data.courses as course}
          <option value={course.id}>{course.name} </option>
        {/each}
      </select>
  {:catch error}
    Error: {error}
  {/await}

</div>
