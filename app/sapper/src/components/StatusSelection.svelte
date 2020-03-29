<script>
  let statuses = [ 
    {id: "OK", status: "OK"},
    {id: "MV", status: "MV"},
    {id: "CR", status: "CR"},
    {id: "CW", status: "CW"},
  ];
  export let selected="OK";
</script>

<div class="select">
  {#await statuses}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then list}
   <div class="select is-primary ">
        <select bind:value={selected}>
          <option value="" disabled>-- Select--</option>
      {#each list as item}
        <option value={item.id}>{item.status}</option>
      {/each}
    </select>
    </div>
  {:catch}
    Error!
  {/await}
</div>
