const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId, getUser } = require('../utils')

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

  let newgrade = await context.prisma.updateStudentCourseWeight({
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

async function createCourse(parent, args, context, info) {
  let newCourse = await context.prisma.createCourse({
      courseID: args.courseID,
      name: args.name,
      year: args.year,
      info: args.info,
      level: args.level,
})
    return newCourse
}

async function updateCourse(parent, args, context, info) {
  let updatedCourse = await context.prisma.updateCourse({
    where: {id: args.id},
    data: {
      courseID: args.data.courseID,
      name: args.data.name,
      year: args.data.year,
      info: args.data.info,
      level: args.data.level
    }
});
    return updatedCourse
}

async function deleteCourse(parent, args, context, info) {
  let deletedcourse = await context.prisma.deleteCourse({ id: args.id })
    return deletedcourse
}

async function createDegree(parent, args, context, info) {
  let newDegree = await context.prisma.createDegree({
      degreeCode: args.data.degreeCode,
      name: args.data.name,
      info: args.data.info,
})
    return newDegree
}

async function updateDegree(parent, args, context, info) {
  let updatedDegree = await context.prisma.updateDegree({
    where: {id: args.id},
    data: {
      degreeCode: args.data.degreeCode,
      name: args.data.name,
      info: args.data.info,
    }
});
    return updatedDegree
}

async function deleteDegree(parent, args, context, info) {
  let deletedDegree = await context.prisma.deleteDegree({ id: args.id })
    return deletedDegree
}

async function createStudent(parent, args, context, info) {
  let newStudent = await context.prisma.createStudent({
      firstname: args.data.firstname,
      surname: args.data.surname,
      guid: args.data.guid,
      degree: args.data.degree,
      level: args.data.level
})
    return newStudent
}

async function updateStudent(parent, args, context, info) {
  let updatedStudent = await context.prisma.updateStudent({
    where: {id: args.id},
    data: {
      firstname: args.data.firstname,
      surname: args.data.surname,
      guid: args.data.guid,
      degree: args.data.degree,
      level: args.data.level
    }
});
    return updatedStudent
}

async function deleteStudent(parent, args, context, info) {
  let deletedStudent = await context.prisma.deleteStudent({ id: args.id })
    return deletedStudent
}

async function createStudentGrade(parent, args, context, info) {
  let newStudentGrade = await context.prisma.createStudentGrade({
    student: args.data.student,
    course: args.data.course,
    weight: args.data.weight,
    grade: args.data.grade,
})
    return newStudentGrade
}

async function updateStudentGrade(parent, args, context, info) {
  let updatedStudentGrade = await context.prisma.updateStudentGrade({
    where: {id: args.id},
    data: {
      student: args.data.student,
      course: args.data.course,
      weight: args.data.weight,
      grade: args.data.grade,
    }
});
    return updatedStudentGrade
}

async function deleteStudentGrade(parent, args, context, info) {
  let deletedStudentGrade = await context.prisma.deleteStudentGrade({ id: args.id })
    return deletedStudentGrade
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


module.exports = {
	signup, login,
  createPost,
  changeGradeWeight,
  createCourse, 
  deleteCourse,
  updateCourse,
  deleteUser,
  updateUserRole,
  createDegree,
  updateDegree,
  deleteDegree,
  createStudent,
  updateStudent,
  deleteStudent,
  createStudentGrade,
  updateStudentGrade,
  deleteStudentGrade,
  createOverallGrade,
  updateOverallGrade,
  deleteOverallGrade
}