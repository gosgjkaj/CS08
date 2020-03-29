<script>

  let desDegrees = [ 
    
    {id: "DD-UD", status: "DD-UD" },
    {id: "DD-UM", status: "DD-UM"},
    {id: "DD-UQ", status: "DD-UQ"},
    {id: "GC", status: "GC"},
  ];
  export let selected="DD-UD";
</script>

<div class="select">
  {#await desDegrees}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then list}
   <div class="select is-primary ">
        <select bind:value={selected}>
          <option value="" disabled>-- Select--</option>
      {#each list as item}
        <option value={item.id}> {item.status}</option>
      {/each}
    </select>
    </div>
  {:catch}
    Error!
  {/await}
</div>
