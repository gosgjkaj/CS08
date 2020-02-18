<script>
  import { query } from "svelte-apollo";
  import { client } from '../gqlClient';
  import { GET_DEGREES_LOOKUP_GQL } from "../utils/gql/gqloperations";

  import years from "../utils/js/YearRuns";
  export let selectedDegrees=[""], 
    multiSelect = true;

  const degrees = query(client(), { query: GET_DEGREES_LOOKUP_GQL });
</script>

<div>
  {#await $degrees}
    Loading...
  {:then result}
    {#if multiSelect}
      <select bind:value={selectedDegrees} multiple>
            <option value="" disabled>-- Select--</option>
        {#each result.data.getDegrees as degree,i}
          <option value={degree.id}>{degree.name}</option>
        {/each}
      </select>
    {:else}
      <select bind:value={selectedDegrees}>
            <option value="" disabled>-- Select--</option>
        {#each result.data.getDegrees as degree}
          <option value={degree.id}>{degree.name}</option>
        {/each}
      </select>
    {/if}
  {:catch error}
    Error: {error}
  {/await}

</div>