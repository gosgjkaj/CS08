const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId, getUser } = require('../utils')
const { convert } = require('../convertGrades')

function createPost(root, args, context) {
	return context.prisma.createPost({
		text: args.text,
		postedBy: {connect: {id: args.userID}}
	})
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

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


async function checkStudentNames(root, args, context) {
  return await context.prisma.$exists.student(
    {
     guid: args.guid,
    },
  )
}

async function createStudent( root, args, context) {
  let students= JSON.parse(JSON.stringify(args.students))
try{
  for(let i = 0; i < students.length; i++) {
    let year
    if(students[i].level =="Third"){
      year = args.entryYear -3
    }else if(students[i].level == "Fourth"){
      year = args.entryYear -4
    }else{
      year = args.entryYear -5
    }
     await context.prisma.createStudent({
      firstname: students[i].firstname,
      surname: students[i].surname,
      guid: students[i].EMPLID,
      degreeID: {connect: {id: students[i].degree}},
      year: students[i].level,
      entryYear: year

     })
}
}catch(e){
  return ["Students failed to be created. Please check the formatting in the file."]
}
return []
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
    let studentDegree = await context.prisma.student({guid:studentlist[i]["EMPLID"]}).degreeID()
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
  deleteUser,
  updateUserRole,
  checkStudentNames,
  createStudent,
  checkGrade,
  addGrade
}