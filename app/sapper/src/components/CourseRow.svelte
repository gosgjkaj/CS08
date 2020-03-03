<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let degree
let year = new Date().getFullYear();
let coursesFromYear = query(client(), {query: gql`
            query{
                 coursesFromYear(id: "${ degree.id }", year: ${year}){
                        courseID
                        level
                        name
                        info
                        id

                }
            }`
        })
</script>


{#await $coursesFromYear}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
{:then result}
    {#each result.data.coursesFromYear as course}
        <div class="box" onclick="location.href='/courses/{course.id}'"  style="cursor: pointer;"> {course.name}</div>
        <div class="box"> <p>Code : {course.courseID}</p>
         <p>Info : {course.info}</p></div>
    {/each}
{:catch}
	<p class="content has-background-danger ">failed to load courses</p>
{/await}

    