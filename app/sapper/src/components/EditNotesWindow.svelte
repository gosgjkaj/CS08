<script>
    import { query, mutate } from 'svelte-apollo'
    import { gql } from 'apollo-boost'
    import { client } from '../gqlClient'
    export let editNote

    let createdAt 
    let time
    let postedBy 
    


    async function formatNotes() {
        let tempDate = editNote.createdAt.toString().substring(0, 10)
        let tempTime = editNote.createdAt.toString().substring(11, 16)
        let tempAuthor = editNote.postedBy.name
        time = tempTime
        createdAt = tempDate
        postedBy = tempAuthor

    }

    $:editNote,formatNotes(editNote)



</script>



    <strong> {createdAt} </strong>at <strong>{time} </strong>by <strong>{postedBy}</strong> <br/>
    <div class="box">{editNote.text}</div> 
    
   
