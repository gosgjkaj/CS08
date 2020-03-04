<script context="module">
    export async function preload(page, session) {
        const  id = page.params['ID']
        return { id }
    }
</script>

<script>
    export let id
    import { session } from '../../stores'
	import { client } from '../../gqlClient' 
	import { query } from 'svelte-apollo'
    import { gql } from 'apollo-boost'
    import StudentRow from '../../components/StudentRow.svelte'
    let cellnumber = 0
    let studentGrade = query(client(), {query: gql`
            query{
                gradeFromCourseID(id: "${ id }"){
                    student{
                        firstname
                        surname
                        guid
                        level
                    }
                    course{
                        courseID
                    }
                    grade
                    id
                    weight
                }
            }`
        })
    
    
    let SortingLevel = ""

    function viewall(){
        SortingLevel = ""
    }

    function sortlevel3(){
        SortingLevel = 3
    }

    function sortlevel4(){
        SortingLevel = 4
    }

    function sortlevel5(){
        SortingLevel = 5
    }


</script>


{#if $session.user}

	{#await $studentGrade}
	    <div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{:then result}
    
    <section class="hero is-info">
		<div class="hero-body">
			<div class="container">
				<h2 class="subtitle">Data for Course:</h2>
                <h1 class="title">A</h1>
			</div>
		</div>
  	</section>

    <div class= "box buttons">
        <button on:click={viewall} class="button is-large is-info is-outlined">All</button>
        <button on:click={sortlevel3} class="button is-large is-info is-outlined">Level3</button>
        <button on:click={sortlevel4} class="button is-large is-info is-outlined">Level4</button>
        <button on:click={sortlevel5} class="button is-large is-info is-outlined">Level5</button>
    </div>

    <div class="content">
		<div class="box ">
            <div class="columns has-text-weight-bold">
               <div class="column is-1">Firstname</div>
                <div class="column is-1">Surname</div>
                <div class="column is-1">GUID</div>
                <div class="column is-1">Grade</div>
                <div class="column is-1">Weight</div>
            </div>
		    {#each result.data.gradeFromCourseID as student}
                {#if SortingLevel == 3}
                    {#if student.student.level == "Third"}
                        <StudentRow grade={student} class="content"/>
                    {/if}
                {:else if SortingLevel == 4}
                    {#if student.student.level == "Fourth"}
                        <StudentRow grade={student} class="content"/>
                    {/if}
                {:else if SortingLevel == 5}
                    {#if student.student.level == "Fifth"}
                        <StudentRow grade={student} class="content"/>
                    {/if}
				{:else if SortingLevel == ""}                  
                    <StudentRow grade={student} class="content"/>
                {/if}
		    {/each}
		</div>
	</div>
	{/await}
{/if}
<p> </p>
