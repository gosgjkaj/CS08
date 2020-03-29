<script>
  let levels = [ 
    {id: "First", level: "First"},
    {id: "Second", level: "Second"},
    {id: "Third", level: "Third"},
    {id: "Fourth", level: "Fourth"},
    {id: "Fifth", level: "Fifth"},
    {id: "Graduated", level: "Graduated"},
  ];
  export let selected="First", selectedOvSGLevel="First";

</script>

<div class="select">
  {#await levels}
    <progress class="progress is-small is-primary" max="100">15%</progress>
  {:then list} 
  <div class="select is-primary ">
        <select  bind:value={selected}>
          <option value="" disabled>-- Select--</option>
      {#each list as item}
        <option value={item.id}>{item.level}</option>
      {/each}
    </select>
    </div>
  {:catch}
    Error!
  {/await}
</div>
