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
    import StudentRowEditDisable from '../../components/StudentRowEditDisable.svelte'
    import currentYear  from '../../currentYear.js'
    import { downloadCSV } from "../../export-csv.js";
    import {convert} from "../../components/convertGrades.js";

    let exportList = []
    let displayStudents = []
    let students=[]
    let Alpha= true 
    let year = currentYear
    let name
    let courseInfo={name: "name"}
    let course =  query(client(), {query: gql`
    query{
        getCourseByID(id: "${id}"){
        
            name
            courseID
        }
    }`
    })
    $course.then(res => {
    courseInfo = res.data.getCourseByID;
    })

  function convertLevel(lev){
    let levels = ["First", "Second", "Third" ,"Fourth" ,"Fifth" ];
    return levels[lev]
  }
    
    let studentGrade = query(client(), {query: gql`
            query{
                gradeFromCourseID(id: "${ id }", date: ${year} ){
                    student{
                        firstname
                        surname
                        guid
                        level
                    
                    }
                    grade
                    status
                }
            }`
        })
    $studentGrade.then(res => {
    students = res.data.gradeFromCourseID;
    if(students!=null){
        displayStudents=Array.from(students)
        convertGrades()
        createExportList()
    }
  });

  function createExportList(){
      if(displayStudents!=null){
        exportList= Array.from(displayStudents)
        for(let i=0; i<displayStudents.length; i++){
            exportList[i] = {
                EMPLID: displayStudents[i].student.guid,
                Name: `"${displayStudents[i].student.surname},${displayStudents[i].student.firstname}"`,
                Grade: displayStudents[i].grade

            }
        }
    }
  }
 
  function exportStudents() {
     
    let headers = {
      EMPLID: "EMPLID",
      Name: "Name",
      Grade: "Grade"
    };
    createExportList() 
    
    let fileName = `"${courseInfo.courseID}_${currentYear}"`;

    downloadCSV(headers, exportList, fileName);
  }

  
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

    function display(){
        if(SortingLevel!=""){
        displayStudents = students.filter(
            entry =>
                 (
                     entry.student.level==SortingLevel)
          );
        }else{
            displayStudents=students
        }

 
    }

function convertGrades(){
    if(displayStudents!=null){
     for(let i=0; i<displayStudents.length; i++){
            let grade = displayStudents[i].grade
            if(displayStudents[i].status=="OK" ){
               displayStudents[i].grade=convert(grade)
            }else{
                 displayStudents[i].grade=displayStudents[i].status
            }
     }
    }

}

$:SortingLevel, display()
$:Alpha, convertGrades()

</script>


 {#if $session.user}
    
    <section class="hero is-info">
		<div class="hero-body">
			<div class="container">
				<h2 class="subtitle">Data for Course:</h2>

                <h1 class="title">{courseInfo.name} </h1>
                 <p>Grades displayed only for the current academic year.</p>

			</div>
		</div>
  	</section>

    <div class= "box buttons">
        <button  on:click={() => (Alpha = !Alpha)} class="button  is-primary is-outlined">Change Grade Display</button>
        <button  on:click={() => (SortingLevel = '')} class="button  is-info is-outlined">All</button>
        <button on:click={() => (SortingLevel = "Third")} class="button  is-info is-outlined">Third</button>
        <button on:click={() => (SortingLevel = "Fourth")} class="button  is-info is-outlined">Fourth</button>
        <button on:click={() => (SortingLevel = "Fifth")} class="button  is-info is-outlined">Fifth</button>
        <button on:click={() =>exportStudents()} class="button  is-danger is-outlined">Export</button>
    </div> 
    

    <div class="content">
		<div class="box ">
            <div class="columns has-text-weight-bold">
               <div class="column is-2">Firstname</div>
                <div class="column is-2">Surname</div>
                <div class="column is-2">GUID</div>
                 <div class="column is-2">Level</div>
                <div class="column is-2">Grade</div>
             
            </div>
             {#if displayStudents!=null}
             
                {#each displayStudents as { student, grade, status }, i}
                            <StudentRowEditDisable  {student}  {grade} {status} class="content"/>


                {/each}
                
               
            {/if} 
		</div>
	</div>

{/if}

<footer class="footer">
  <div class="content has-text-centered">
    <p class="has-text-centered">
    School of Chemistry, University of Glasgow
    </p>
  </div>
</footer>
