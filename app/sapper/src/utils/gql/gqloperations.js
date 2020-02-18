import { gql } from 'apollo-boost'

//---------- GQLs start -------------

const GET_CourseDegreeWeight_GQL = gql `
  query getcourseDegreeWeights($where: MyCourseDegreeWeightWhereInput!) {
		getcourseDegreeWeights(where:$where) {
			id
			weight
			degree {
			  id
			}
			course {
			 id 
			}
		  }
    }
  `;

const ADD_CDWEIGHT_GQL = gql `
mutation($data: MyCourseDegreeWeightInput!) {
  createCourseDegreeWeight(data: $data) {
  id
  weight
  }
}
`;

const EDIT_CDWEIGHT_GQL = gql `
    mutation($data: MyCourseDegreeWeightInput!, $where:CourseDegreeWeightWhereUniqueInput!) {
      updateCourseDegreeWeight(data: $data, where:$where) {
        id
       }
    }
  `;

const  DELETE_CDWEIGHT_GQL = gql`
mutation($where: CourseDegreeWeightWhereUniqueInput!){
	deleteCourseDegreeWeight(where: $where) {
			id					
	}
}
`;

const GET_ALL_COURSES_GQL = gql `
    {      
      getCourses {
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

const GET_YEAR_COURSES_GQL = gql `
  query coursesSearch($year: Year, $searchString: String) {
    coursesSearch(year: $year, searchString: $searchString) {  
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

const DELETE_COURSE_GQL = gql `
    mutation($id: ID!) {
      deleteCourse(id: $id) {
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

const ADD_COURSE_GQL = gql `
    mutation($courseID: String!, $level: Level, $year: Year, $name: String, $info: String) {
      createCourse(courseID: $courseID, level: $level, year: $year, name: $name, info: $info) {
        level
        year
        courseID
        name
        info
      }
    }
  `;

const EDIT_COURSE_GQL = gql `
    mutation($id: ID!,$data: updateCourseInput!) {
      updateCourse(id: $id, data: $data) {
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

const GET_DEGREES_LOOKUP_GQL = gql `
      {      
          getDegrees {
            id
            degreeCode 
            name
          }
      }
`;

//------------End of Courses GQL ----------

//------------Degrees GQL ----------
const GET_DEGREES_GQL = gql `
  query getDegrees($searchString: String) {
    getDegrees(searchString: $searchString) {  
      id 
		  degreeCode 
		  name 
		  info 
      courses {
          id
          name
        }
          CourseDegreeWeights{
            id
            degree {
                id
            }
            course
            {
                id
                name
            }
            weight
          
          }
      }
    }
  `;

  const ADD_DEGREE_GQL = gql `
  mutation($data: DegreeCreateInput!) {
    createDegree(data: $data) {
     id 
     degreeCode 
     name 
     info 
    }
  }
  `;
  
  const DELETE_DEGREE_GQL = gql `
      mutation($id: ID!) {
        deleteDegree(id: $id) {
         id 
         degreeCode 
         name 
         info 
        }
      }
    `;
  
  const EDIT_DEGREE_GQL = gql`
  mutation($id: ID!, $data: DegreeUpdateInput!) {
      updateDegree(id: $id, data: $data) {
        id
        name
        degreeCode
      } 
  }
  `;
//------------End of Degrees GQL ----------

//===== Students GQLS starts ======
const  GET_STUDENTS_GQL = gql`
query($searchString: String){
	getStudents(searchString: $searchString) {
		id
		firstname 
		surname
		guid	
    level	
    degree {
        id
        name
      }
    mygrades{ 
      id
      weight
      grade
      
      course {
        id
        name
      }	
      student {
          degree {
          id
        }
      } 
      
	}
  myoverallgrade{
        id 
        student {
            degree {
              id
            }
        }  
        year 
        studentLevel 
        grade 
      }		  
    }

}
`;

const ADD_STUDENT_GQL = gql`
mutation($data:studentInput!){
	createStudent(data: $data) {
		id
		firstname, 
		surname, 
		guid		
	}
}
`;

const EDIT_STUDENT_GQL = gql`
mutation($id:ID!, $data:studentInput!){
	updateStudent(id: $id, data: $data) {
		id
		firstname, 
		surname, 
		guid		
	}
}
`;

const  DELETE_STUDENT_GQL = gql`
mutation($id:ID!){
	deleteStudent(id: $id) {
		id
		firstname, 
		surname, 
		guid		
	}
}
`;
//===== Students GQLS ends ======

//========== Student Grades GQL  ============
const ADD_STUDENT_GRADE_GQL = gql`
mutation($data:StudentCourseGradeInput!){
	createStudentGrade(data: $data) {
			id
			weight
			grade	
	}
}
`;

const EDIT_STUDENT_GRADE_GQL = gql`
mutation($id:ID!, $data:StudentCourseGradeInput!){
	updateStudentGrade(id: $id, data: $data) {
			id
			weight
			grade		
	}
}
`;

const  DELETE_STUDENT_GRADE_GQL = gql`
mutation($id:ID!){
	deleteStudentGrade(id: $id) {
			id
			weight
			grade			
	}
}
`;

//========== Student Overall Grade GQL  ============

const ADD_S_OVERALL_GRADE_GQL = gql`
mutation($data:OverallGradeInput!){
	createOverallGrade(data: $data) {
			id
			grade	
	}
}
`;

const EDIT_S_OVERALL_GRADE_GQL = gql`
mutation($id:ID!, $data:OverallGradeInput!){
	updateOverallGrade(id: $id, data: $data) {
			id
			grade		
	}
}
`;

const  DELETE_OVS_GRADE_GQL = gql`
mutation($id:ID!){
	deleteOverallGrade(id: $id) {
			id
			grade			
	}
}
`;

//========== End of Student Overall Grades GQL  ============

// =============End of Student Grades GQL ===============

//----------End of GQLs-------------



export {
  GET_ALL_COURSES_GQL,  GET_YEAR_COURSES_GQL,  DELETE_COURSE_GQL,  ADD_COURSE_GQL,
  EDIT_COURSE_GQL,
  GET_DEGREES_GQL,  GET_DEGREES_LOOKUP_GQL,   ADD_DEGREE_GQL, EDIT_DEGREE_GQL, DELETE_DEGREE_GQL,
  GET_STUDENTS_GQL, ADD_STUDENT_GQL, EDIT_STUDENT_GQL,DELETE_STUDENT_GQL,
  ADD_STUDENT_GRADE_GQL,  EDIT_STUDENT_GRADE_GQL , DELETE_STUDENT_GRADE_GQL  ,
  ADD_S_OVERALL_GRADE_GQL,EDIT_S_OVERALL_GRADE_GQL, DELETE_OVS_GRADE_GQL,
  ADD_CDWEIGHT_GQL, DELETE_CDWEIGHT_GQL, EDIT_CDWEIGHT_GQL,
   GET_CourseDegreeWeight_GQL
}