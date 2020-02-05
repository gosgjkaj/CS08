<script>
  export let title = "";
</script>

<style>
  .card {
    margin: 10px;
    min-height: 300px;
    min-width: 350px;
  }
  
  
</style>

<div class="card">
  {#if title}
    <header class="card-header has-background-primary">
      <p class="card-header-title">{title}</p>
    </header>
  {/if}
  <div class="card-content">
    <div class="content">
      <slot />
    </div>
  </div>
  <footer class="card-footer">
    <slot name="footer" />
  </footer>
</div>
