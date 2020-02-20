const { getUser } = require('../utils')

function userPosts(root, args, context) {
	return context.prisma.user({id: args.id}).posts()
}

async function checkPermission(parent, args, context) {
	const user = await getUser(context)
	return user == null ? null : user.role
}

async function getCoursesByDegree(root, args, context) {
	let coursesByDegree = await context.prisma.courseDegreeWeights({where: {degree: {id: args.id }}})
	return coursesByDegree
}

async function getYear(root, args, context) {
	let year = await context.prisma.courseRuns({where: {course: {id: args.id }}})
	return year
}

async function coursesFromYear(root, args, context) {
	let courseRuns = await context.prisma.courseRuns({ where: {year: args.year} }).course()
	courseRuns = courseRuns.map(item => item.course)
	return courseRuns
}
async function gradeFromCourseID(root, args, context) {
	let courseGradeStudent = await context.prisma.studentCourseGrades({where: {course: { id: args.id }}})
	return courseGradeStudent
}
async function getGradeByID(root, args, context) {
	return await context.prisma.studentCourseGrade({id:args.id})
}
async function getOverallGrade(root, args, context) {
	return await context.prisma.overallGrade( {
		where: {
			year: arg.year,
			studentLevel: args.level,
			student: {
				id: args.id
			}
		}
	})
}
async function getCourses(root, args, context) {
	return await context.prisma.courses()
}
async function getUsers(root, args,context) {
	return await context.prisma.users()
}
async function getDegrees(root, args, context) {
	return await context.prisma.degrees()
}
async function getStudents(root, args, context) {
	return await context.prisma.students()
}


module.exports = {
	userPosts,
	coursesFromYear,
	checkPermission,
	getCoursesByDegree,
	getYear,
	gradeFromCourseID,
	getGradeByID,
	getOverallGrade,
	getCourses,
	getUsers,
	getDegrees,
	getStudents
}