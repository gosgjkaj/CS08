<script>
	import { session } from '../stores'
	import { client } from '../gqlClient'
	import { query } from 'svelte-apollo'
	import { gql } from 'apollo-boost'
    import { goto } from '@sapper/app'
    


    let searchInput = ""

    let search = false

    function searching(){
        search = true
    }

    function resetSearch(){
        search = false
    }
</script>

<input type="text" placeholder="Enter GUID here" bind:value={searchInput} name="searchBar">
<button on:click={searching}><i class="fa fa-search">Search student</i></button>


{#if search}
searching 
{searchInput}!

{/if}
