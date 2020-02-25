<script> 
  import years from '../utils/js/YearRuns';
  export let selected="";
</script>

<div class="select">
  {#await years}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then list}
    <select bind:value={selected}>
    <option value="" disabled>-- Select--</option>
      {#each list as item}
        <option value={item.id}>{item.text}</option>
      {/each}
    </select>
  {:catch}
    Error!
  {/await}
</div>

