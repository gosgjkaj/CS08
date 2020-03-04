<script>
  import { onMount, afterUpdate, beforeUpdate } from "svelte";
  import years from "../utils/js/YearRuns";
  export let selected = "",
    multiple = false;
  let MultiSelectControl;

  onMount(() => {
    if (multiple) {
      MultiSelectControl = new SlimSelect({
        select: "#MultiSelectID"
      });
    }

    // update the value
  });

  beforeUpdate(() => {
    //console.log("beforeUpdate::selected values=", selected);
  });

  afterUpdate(() => {
    if (multiple) {
      //console.log("afterUpdate::selected values=", selected);
      MultiSelectControl.set(selected);
    }
  });
</script>

{#await years}
  <progress class="progress is-small is-primary" max="100">15%</progress>
{:then list}
  {#if multiple}
    <select id="MultiSelectID" bind:value={selected} multiple>
      {#each list as item}
        <option selected value={item.id}>{item.text}</option>
      {/each}
    </select>
  {:else}
    <select bind:value={selected}>
      <option value="" disabled>-- Select--</option>
      {#each list as item}
        <option value={item.id}>{item.text}</option>
      {/each}
    </select>
  {/if}

{:catch}
  Error!
{/await}
