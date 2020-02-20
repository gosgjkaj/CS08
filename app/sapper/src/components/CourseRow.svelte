<script>
import { query, mutate } from 'svelte-apollo'
import { gql } from 'apollo-boost'
import { client } from '../gqlClient'

export let degree

let coursesByDegree = query(client(), {query: gql`
            query{
                getCoursesByDegree(id: "${ degree.id }"){
                    id
                    course{
                        courseID
                        level
                    }
                    degree{
                        id
                    }
                }
            }`
        })
</script>


{#await $coursesByDegree}
	<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
{:then courses}
    {#each courses.data.getCoursesByDegree as course}
        <button class="button is-large  is-outlined ">{course.course.courseID}</button>
    {/each}
{:catch}
	<p class="content has-background-danger ">failed to load courses</p>
{/await}

    