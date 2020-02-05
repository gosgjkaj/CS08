import { gql } from 'apollo-boost'

//---------- GQLs start -------------
  const GET_ALL_COURSES_GQL = gql`
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

  const GET_YEAR_COURSES_GQL = gql`
  query getCoursesFromYear($year: Year) {
    getCoursesFromYear(year: $year) {  
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

  
  const DELETE_COURSE_GQL = gql`
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

  const ADD_COURSE_GQL = gql`
    mutation($courseID: String!, $level: Level!, $year: Year, $name: String, $info: String) {
      addCourse(courseID: $courseID, level: $level, year: $year, name: $name, info: $info) {
        level
        year
        courseID
        name
        info
      }
    }
  `;

  const EDIT_COURSE_GQL = gql`
    mutation($id: ID!, $courseID: String, $level: Level, $year: Year, $name: String, $info: String) {
      updateCourse(id: $id, courseID: $courseID, level: $level, year: $year, name: $name, info: $info) {
        id
        level
        year
        courseID
        name
        info
      }
    }
  `;

  //----------End of GQLs-------------

  export {GET_ALL_COURSES_GQL, GET_YEAR_COURSES_GQL,DELETE_COURSE_GQL, ADD_COURSE_GQL, EDIT_COURSE_GQL}