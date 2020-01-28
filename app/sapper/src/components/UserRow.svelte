<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let user
export let afterDelete = () => {}
let hovered = false
let modalShown = false
let editing = false
let role= user.role
async function deleteEntry(id){
    let deletedEntry = await mutate(client(), { mutation: gql`
            mutation{
	            deleteUser(id: "${id}"){
                   id
                   name
                   email
                }
            }`
        })
    afterDelete()
}
async function updateRole(id, role) {
    let userRole = await  mutate(client(), { mutation: gql`
            mutation{
	           updateUserRole(id: "${id}", role: ${role}){
                  role
                }
            }`
        })
        editing= false
        role = userRole.data.updateUserRole.role
}
async function resetRole() {
    editing = false
}
let newrole
</script>

<div class="box is-primary" on:mouseenter={()=>hovered=true}
	on:mouseleave={()=>hovered=false}> 
<div >
<p class=" has-text-weight-semibold"> {user.name}</p>
<p>email: {user.email}</p>
{#if editing}
<p>Role:</p>
<select  class="select" bind:value={newrole}>
    <option value="Admin" >Admin </option>
    <option value="Normal"> Normal</option>
    <option value="Restricted">Restricted(Read only)</option>
</select>
<div class="level-right">
<button class="button is-success" on:click="{updateRole(user.id, newrole)}" > Save </button>
<button class="button" on:click="{()=>resetRole()}" > Cancel </button>
</div>
{:else}
<p class="has-text-danger">Role: {role}</p>
{#if hovered}
<div class="level-right">
<button class="button" on:click="{()=>editing=true}">Edit</button>
<button class="button" on:click="{()=>modalShown=true}">Delete</button>
</div>
{/if}
{/if}
</div>
</div>

{#if modalShown}

<div class="modal" class:is-active={modalShown}>
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Delete User</p>
      <button class="delete" aria-label="close" on:click="{()=>modalShown=false}"></button>
    </header>
    <section class="modal-card-body">
      Are you sure you want to delete user {user.name} from the database?
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" on:click="{deleteEntry(user.id)}">Save changes</button>
     <button class="button" on:click="{()=>modalShown=false}"> Cancel </button>
    </footer>
  </div>
</div>
{/if}