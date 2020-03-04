<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'
import currentYear  from '../currentYear.js'
	// hardcoded data
let year = currentYear

export let degree
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
        <div class="box" style="background-color:#EBF1F5; display:flex; flex-direction:row">
            <div class="button is-primary is-outlined is-medium" onclick="location.href='/courses/{course.id}'"> {course.name}</div>
            <div style="margin-left:3%"> 
                <div>
                    <p>Code : {course.courseID}</p>
                </div>
                <div>
                    <p>Info : {course.info}</p>
                </div>
            </div>
        </div>
    {/each}
{:catch}
	<p class="content has-background-danger ">failed to load courses</p>
{/await}

    