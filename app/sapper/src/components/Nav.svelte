<script>
	import { checkPermission } from '../utils.js'
  import { stores } from '@sapper/app'
  
  const { session } = stores()
  import { onMount } from "svelte";
  import menu from "../menu";
  import Upload from '../components/Upload.svelte'
  import StudentUpload from '../components/StudentUpload.svelte'
  import { goto } from '@sapper/app'


  export let segment

  onMount(async () => { enableResponsibleMenu(); });

  let permission = checkPermission()
   function checkUser(){
    if($session.user!=null){
      return $session.user.role=="Restricted"
  }
}
  let restricted =checkUser()


  function logout() {
   
    fetch("/logout", {
      method: 'POST'
    }) 
   
    // TODO: handle potential logout errors
    
    session.set({ user: null })
    permission = checkPermission() 
    goto("/login")
   
  }

  function enableResponsibleMenu() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }
  }

</script>

<style>
  .selected {
    background-color: #003865;
  }
</style>

<!-- Nav bar -->
<nav class="navbar is-info" style="background-color: #003865" role="navigation" aria-label="main navigation">
	<!-- UofG Logo -->
  <div class="navbar-brand">
    <a href="/">
      <img
        src="https://www.gla.ac.uk/3t4/img/university-of-glasgow.png"
        width="200"
        alt="University Of Glasgow"
        height="20" />
    </a>

    <a
      href="javascript:;"
      role="button"
      class="navbar-burger burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <!-- nav bar items as button -->
	<div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      {#each menu as item}
      {#if  $session.user!=null }
      <a class={segment === item[0] ? 'navbar-item selected' : 'navbar-item'} href={item[0]} style="font-size: 150%">
        {item[1]}
      </a>
      {/if}
    {/each}
      {#if $session.user != null && $session.user.role=="Admin"}
        <a href="/admin" class="navbar-item" style="font-size: 150%">Admin Page</a>
      {/if}
    </div>

    <!-- showing user login information and upload buttons -->
    <div class="navbar-end">
      <div class="navbar-item">
          {#if $session.user != null}
            <div>
              <p style="font-size: 110%; font-weight: 500">Hi <bold>{$session.user.name}</bold>, You have <bold>{$session.user.role}</bold> permission.</p>
              <div style="display: flex; justify-content: center">
              {#if !restricted}
              <StudentUpload style="color: #0274AF"></StudentUpload>
                <Upload style="color: #0274AF"></Upload>
                {/if}
                <button on:click={logout} class="button is-danger" style="margin-left: 5px">Log out</button>
              </div>
            </div>
          {/if}
      </div>
    </div>
  </div>
</nav>
