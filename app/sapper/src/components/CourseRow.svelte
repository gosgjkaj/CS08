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
        <div class="box is-light" style="background-color:#F0F8FF; display:flex; flex-direction:row"onclick="location.href='/courses/{course.id}'">
            <div class="button is-info is-light is-medium" > {course.name}</div>
            <div style="margin-left:3%"> 
                <div>
                    <p>Code: {course.courseID}</p>
                </div>
                <div>
                    <p>Info: {course.info}</p>
                </div>
            </div>
        </div>
    {/each}
{:catch}
	<p class="content has-background-danger ">failed to load courses</p>
{/await}

    
