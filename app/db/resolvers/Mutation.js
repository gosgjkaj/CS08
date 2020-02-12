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
  const user = await context.prisma.createUser({ ...args, password, role: 'Admin' })

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

module.exports = {
	signup, login,
  createPost,
  changeGradeWeight,
  deleteUser,
  updateUserRole
}