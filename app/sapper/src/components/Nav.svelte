<script>
	import { checkPermission } from '../utils.js'
  import { stores } from '@sapper/app'
  const { session } = stores()
  import { onMount } from "svelte";
  import menu from "../menu";
  import Upload from '../components/Upload.svelte'

  export let segment

  onMount(async () => { enableResponsibleMenu(); });

  let permission = checkPermission()

  function logout() {
    fetch("/logout", {
      method: 'POST'
    })
    // TODO: handle potential logout errors
    session.set({ user: null })
    permission = checkPermission()
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
    background-color: #2366D1;
  }
</style>

<nav class="navbar is-link" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
    <a href="/">
      <img
        src="https://www.gla.ac.uk/3t4/img/university-of-glasgow-min.png"
        width="295"
        alt="University Of Glasgow"
        height="28" />
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


	<div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      {#each menu as item}
      <a class={segment === item[0] ? 'navbar-item selected' : 'navbar-item'}
        href={item[0]}>
        {item[1]}
      </a>
    {/each}
      {#if $session.user != null && $session.user.role=="Admin"}
      <a href="/admin" class="navbar-item">Admin Page</a>
      {/if}
    </div>

     <div class="navbar-menu">
      <div class="navbar">
        <div class="buttons">
        
        </div>
      </div>
    </div>


    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          {#if $session.user != null}
          
          <Upload>
          </Upload>

          <button on:click={logout} class="button is-danger">
            Log out
          </button>

          {:else}
          <a href='/signup' class='button is light'>
          register</a>
          <a href="/login" class="button is-light">
            Log in
          </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
</nav>
