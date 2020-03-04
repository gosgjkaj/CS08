const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId, getUser } = require('../utils')
const { convert } = require('../convertGrades')

function createPost(root, args, context) {
	return context.prisma.createPost({
    text: args.text,
    guid: args.guid,
		postedBy: {connect: {id: args.userID}}
	})
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password, role: args.role })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}



async function changeGradeWeight(parent,args,context, info){

  let newgrade = await context.prisma.updateStudentCourseWeight({
  //let newgrade = await context.prisma.updateStudentCourseGrade({
    data:{
      grade: args.grade,
      weight: args.weight
    },
    where: {
      id: args.id
    }
  }, info)
  return newgrade
}

async function changeDegreeGradesWeight(parent,args,context, info){

  let newgrade = await context.prisma.updateStudentCourseGrade({
    data:{
      grade: args.grade,
      weight: args.weight
    },
    where: {
      id: args.id
    }
  }, info)
  return newgrade
}
async function createDegree(parent, args, context, info) {
    let DegreeObject = {
      degreeCode: args.data.degreeCode,
      name: args.data.name,
      info: args.data.info, 
  };
  let newDegree = await context.prisma.createDegree(DegreeObject);
    return newDegree
}

async function updateDegree(parent, args, context, info) {
    let DegreeObject = {
      degreeCode: args.data.degreeCode,
      name: args.data.name,
      info: args.data.info, 
  };

  if (args.data.courses && args.data.courses.length > 0)
	{
			let CourseIdArray = args.data.courses.split(data.courses);
			const IDObjectArray = [];
			let IDObject={};

			CourseIdArray.forEach(element => 
				 {	
						   IDObject.id = element;
						   IDObjectArray.push(IDObject);
				 })
			
			DegreeObject.courses =  { connect: IDObjectArray }
  }
  
	let updatedDegree = await context.prisma.updateDegree({
    where: {id: args.id},
    data: DegreeObject
  });
  return updatedDegree
}

async function deleteDegree(parent, args, context, info) {
  let deletedDegree = await context.prisma.deleteDegree({id: args.id})
    return deletedDegree
}

async function createStudentByUpload(parent, args, context, info) {
  let students= JSON.parse(JSON.stringify(args.students))
  console.log(students,"creating students")
  try {
    for (let i = 0; i < students.length; i++) {
      let year
      if (students[i].level =="Third") {
        year = args.entryYear -3
      } else if (students[i].level == "Fourth") {
        year = args.entryYear -4
      } else {
        year = args.entryYear
      }
      let created = await context.prisma.createStudent({
        firstname: students[i].firstname,
        surname: students[i].surname,
        guid: students[i].EMPLID,
        degree: {connect: {id: students[i].degree}},
        level: students[i].level,
        entryYear: year
      })
  }

  } catch(e) {
    return ["Students failed to be created. Please check the formatting in the file."]
  }
  return []
  }

  async function createStudent(parent, args, context, info) {
    //console.log("createStudent:: args=", args);
    let newStudent =   await context.prisma.createStudent({
      firstname: args.data.firstname,
      surname: args.data.surname,
      guid: args.data.guid,
      level: args.data.level,
      entryYear: args.data.entryYear,
      degree: {
        connect: {
          id: args.data.degree
        }
      },
  
    })
  
    return newStudent;
  }

async function updateStudent(parent, args, context, info) {
  let updatedStudent = await context.prisma.updateStudent({
    where: {id: args.id},
    data: {
      firstname: args.data.firstname,
      surname: args.data.surname,
      guid: args.data.guid,
      degree: {connect: {id: args.data.degree}},
      level: args.data.level, 
      entryYear: args.data.entryYear
    }
});
    return updatedStudent
}

async function deleteStudent(parent, args, context, info) {

  console.log("deleteStudent:: args=", args);

  let deleteManyStudentCourseGrades = await context.prisma.
  deleteManyStudentCourseGrades({
    student: {
      id: args.id
    }
  });

  console.log("deleteStudent:: After deleteManyStudentCourseGrades");
  let deletedStudent = await context.prisma.deleteStudent({ id: args.id })
    return deletedStudent
}

async function createStudentGrade(parent, args, context, info) {
  console.log("createStudentGrade::args=", args);
  let newStudentGrade = await context.prisma.createStudentCourseGrade({
    student: {connect: {id: args.data.student}},
    course: {connect: {id: args.data.course}},
    weight: args.data.weight,
    grade: args.data.grade,
    date: args.data.date
  })
  return newStudentGrade
}

async function updateStudentGrade(parent, args, context, info) {
  console.log("updateStudentGrade::args=", args);
  let updatedStudentGrade = await context.prisma.updateStudentCourseGrade({
    where: {
      id: args.id
    },
    data: {
      student: {connect: {id: args.data.student}},
      course: {connect: {id: args.data.course}},
      weight: args.data.weight,
      grade: args.data.grade,
      date: args.data.date
    }
  });
  return updatedStudentGrade
}

async function deleteStudentGrade(parent, args, context, info) {
  console.log("deleteStudentGrade::args=", args);
  let deletedStudentGrade = await context.prisma.deleteStudentCourseGrade({
    id: args.id
  })
  return deletedStudentGrade
}

function createOverallGradeGPA(root, args, context) {
	return context.prisma.createOverallGrade({
    student: {connect: {id: args.studentID}},
    year: args.year,
    studentLevel: args.studentLevel,
    grade: args.grade
    
	})
}

async function createOverallGrade(parent, args, context, info) {
  let newOverallGrade = await context.prisma.createOverallGrade({
    student: args.data.student,
    year: args.data.year,
    studentLevel: args.data.studentLevel,
    grade: args.data.grade,
})
    return newOverallGrade
}


async function changeOverallGrade(parent,args,context, info){

  let newGpa = await context.prisma.updateOverallGrade({
    data:{
      grade: args.grade,
    },
    where: {
      id: args.id
    }
  }, info)
  return newGpa
}



async function updateOverallGrade(parent, args, context, info) {
  let updatedOverallGrade = await context.prisma.updateOverallGrade({
    where: {id: args.id},
    data: {
      student: args.data.student,
      year: args.data.year,
      studentLevel: args.data.studentLevel,
      grade: args.data.grade,
    }
});
    return updatedOverallGrade
}

async function deleteOverallGrade(parent, args, context, info) {
  let deletedOverallGrade = await context.prisma.deleteOverallGrade({ id: args.id })
    return deletedOverallGrade
}

async function deleteUser(root, args, context ) { 
  let deleteduser = await context.prisma.deleteUser({ id: args.id })
    return deleteduser
}

async function updateUserRole(root, args, context) {
  return await context.prisma.updateUser({
    data: {
      role: args.role
    },
    where: {
      id: args.id
    }
  })
}

async function createCourseDegreeWeight(parent, args, context, info) {

  let CDWtObject = {
    course: {
      connect: {
        id: args.data.course
      }
    },
    degree: {
      connect: {
        id: args.data.degree
      }
    },
    weight: args.data.weight
  }

  console.log("createCourseDegreeWeight::CDWtObject=", CDWtObject);

  let newCourseDegreeWeight = await context.prisma.createCourseDegreeWeight(CDWtObject)
  return newCourseDegreeWeight
}

async function updateCourseDegreeWeight(parent, args, context, info) {
  console.log("updateCourseDegreeWeight:: args=", args);
  let CDWtObject = {
    data: {
      course: {
        connect: {
          id: args.data.course
        }
      },
      degree: {
        connect: {
          id: args.data.degree
        }
      },
      weight: args.data.weight
    },
    where: {
      id: args.where.id
    }
  };
  let whereClause = {
    where: {
      id: args.where.id
    }
  };

  console.log("updateCourseDegreeWeight::CDWtObject=", CDWtObject, ", whereClause=", args.where.id);

  let updatedCourseDegreeWeight = await context.prisma.
  updateCourseDegreeWeight(CDWtObject);
  return updatedCourseDegreeWeight
}

async function deleteCourseDegreeWeight(parent, args, context, info) {
  console.log("deleteCourseDegreeWeight::args=", args)
  let deletedCourseDegreeWeight = await context.prisma.deleteCourseDegreeWeight({
    id: args.id
  })
  return deletedCourseDegreeWeight
}
async function createCourseRun(parent, args, context, info) {
  let dataObject = {
    year: {set:  args.data.year },
    course: {
      create: {
        level: args.data.level,
        courseID: args.data.courseID,
        name: args.data.name,
        info: args.data.info
      }
    }
  };

  console.log("createCourseRun::dataObject=", dataObject);
  let newCourseRun = await context.prisma.createCourseRun(dataObject)
  return newCourseRun
}

async function updateCourseRun(parent, args, context, info) {
  let dataObject = {
    data: {
      year: {set:  args.data.year },
      course: {
        update: {
          level: args.data.level,
          courseID: args.data.courseID,
          name: args.data.name,
          info: args.data.info
        }
      }
    },
    where: {
      id: args.id
    }
  };
  console.log("updateCourseRun::dataObject=", dataObject);
  let updatedCourseRun = await context.prisma.updateCourseRun(dataObject)
  return updatedCourseRun
}

async function deleteCourseRun(parent, args, context, info) {
  console.log("deleteCourseRun::args=", args);

   let deletedCourseRun = await context.prisma.deleteCourseRun({
    id: args.id
  })

  let deletedcourse = await context.prisma.deleteCourse({
    id: args.courseid
  })
  
  return deletedCourseRun
}

async function checkStudentNames(root, args, context) {
  return await context.prisma.$exists.student(
    {
     guid: args.guid,
    },
  )
}

async  function checkGrade(root, args, context) {
  let grade= await context.prisma.$exists.studentCourseGrade({
    AND: [
      {
      student: {
        guid: args.guid
        }
     },
     {
       date: args.year
     },
     {
       course: {
         id: args.course
       }
     }
    ]}
  )
  
  return grade
}
async function addGrade(root, args, context) {
  let studentlist = JSON.parse(JSON.stringify(args.studentlist))
  let weights = JSON.parse(JSON.stringify(args.weights))
  //let studentlist = args.studentlist
  //let weights = args.weights
  let year = args.year
  let course = args.course
  let results = {failed:[]}
  for(let i = 0; i < studentlist.length; i++) {
    let gradeexists = await context.prisma.$exists.studentCourseGrade({
      AND: [
        {
        student: {
          guid: studentlist[i]["EMPLID"]
          }
      },
      {
        date: args.year
      },
      {
        course: {
          id: args.course
        }
      }
      ]}
    )

    let student = await context.prisma.student({guid:studentlist[i]["EMPLID"]})
    console.log(student)
    let studentDegree = await context.prisma.student({guid:studentlist[i]["EMPLID"]}).degree()
    console.log(studentDegree)
    let weight
    
  
    for(let j = 0; j < weights.length; j++){
      if(weights[j].degree == studentDegree.id){
  
        weight = weights[j].weight
      }
   
    }
   
    if (!gradeexists){
      let addagrade = await context.prisma.createStudentCourseGrade({
        course: {connect: {id: args.course}},
        student: {connect: {id: student.id}},
        weight: weight,
        grade: convert(studentlist[i]["Grade"]),
        date: args.year,
      }

      )
  }else{
    results.failed.push(student.guid)
  }
  
}
 return results
}
module.exports = {
	signup, login,
  createPost,
  changeGradeWeight,
  createCourseRun, 
  deleteCourseRun,
  updateCourseRun,
  deleteUser,
  updateUserRole,
  createDegree,
  updateDegree,
  deleteDegree,
  createStudent,
  createStudentByUpload,
  updateStudent,
  deleteStudent,
  createStudentGrade,
  updateStudentGrade,
  deleteStudentGrade,
  createOverallGrade,
  updateOverallGrade,
  deleteOverallGrade,
  createCourseDegreeWeight,
  deleteCourseDegreeWeight,
  updateCourseDegreeWeight,
  checkStudentNames,
  checkGrade,
  addGrade,
  createOverallGradeGPA,
  changeOverallGrade,
  changeDegreeGradesWeight
}