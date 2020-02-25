import { gql } from 'apollo-boost'

//---------- GQLs start -------------

const GET_CourseDegreeWeight_GQL = gql `
  query getcourseDegreeWeights($where: MyCourseDegreeWeightWhereInput!) {
		getcourseDegreeWeights(where:$where) {
			id
			weight
			degree {
        id
        name
			}
			course {
       id 
       name
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
mutation($id: ID!){
	deleteCourseDegreeWeight(id: $id) {
			id					
	}
}
`;

const GET_COURSES_GQL = gql `
  query getCourses($searchString: String) {
    getCourses(searchString: $searchString) {  
        id
        level        
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
        courseID
        name
        info
      }
    }
  `;

  const ADD_COURSE_GQL = gql `
    mutation($data: CourseCreateInput!) {
      createCourse(data: $data) {
        id
        level        
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
          courseDegreeWeights {
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
    entryYear
    degree {
        id
        name
      }
    mygrades{ 
      id
      weight
      grade
      date 
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
  myoverallgrades{
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

//============ CourseRuns GQLs=============

const  GET_COURSERUNS_GQL = gql`
query($searchString: String){
	getCourseRuns(searchString: $searchString) {
		   id
			year
			course {
			  id
			  name
			  info
			  courseID
			  level      
			}
        
  }

}
`;

const ADD_COURSERUN_GQL = gql`
mutation($data:CourseRunInput!){
	createCourseRun(data: $data) {
			id			
	}
}
`;

const EDIT_COURSERUN_GQL = gql`
mutation($id:ID!, $data:CourseRunInput!){
	updateCourseRun(id: $id, data: $data) {
			id					
	}
}
`;

const DELETE_COURSERUN_GQL = gql `
    mutation($id: ID!, $courseid: ID!) {
      deleteCourseRun(id: $id, courseid: $courseid) {
		   id  
      }
    }
  `;

//========== End of Student Overall Grades GQL  ============

// =============End of Student Grades GQL ===============

//----------End of GQLs-------------



export {
  GET_COURSES_GQL, DELETE_COURSE_GQL,  ADD_COURSE_GQL,
  EDIT_COURSE_GQL,
  GET_DEGREES_GQL,  GET_DEGREES_LOOKUP_GQL,   ADD_DEGREE_GQL, EDIT_DEGREE_GQL, DELETE_DEGREE_GQL,
  GET_STUDENTS_GQL, ADD_STUDENT_GQL, EDIT_STUDENT_GQL,DELETE_STUDENT_GQL,
  ADD_STUDENT_GRADE_GQL,  EDIT_STUDENT_GRADE_GQL , DELETE_STUDENT_GRADE_GQL  ,
  ADD_S_OVERALL_GRADE_GQL,EDIT_S_OVERALL_GRADE_GQL, DELETE_OVS_GRADE_GQL,
  ADD_CDWEIGHT_GQL, DELETE_CDWEIGHT_GQL, EDIT_CDWEIGHT_GQL,
  GET_CourseDegreeWeight_GQL, GET_COURSERUNS_GQL,
  ADD_COURSERUN_GQL, EDIT_COURSERUN_GQL, DELETE_COURSERUN_GQL
}