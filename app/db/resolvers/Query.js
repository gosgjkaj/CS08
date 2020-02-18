const { getUser } = require('../utils')

function userPosts(root, args, context) {
	return context.prisma.user({id: args.id}).posts()
}

async function checkPermission(parent, args, context) {
	const user = await getUser(context)
	return user == null ? null : user.role
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
			year: args.year,
			studentLevel: args.level,
			student: {
				id: args.id
			}
		}
	})
}

async function getCourses(root, args, context) {
	return await context.prisma.courses();
}

async function getCoursesFromYear(root, args, context) {
	return await context.prisma.courses({where: {year:args.year}});
}

async function getStudents(root, args, context) {
	if (args.searchString && args.searchString.trim().length > 0) {
		let searchStringArg = args.searchString.toLowerCase();
		let allStudents = await context.prisma.students();
		return allCourses.filter( (student) => student.surname.toLowerCase().includes(searchStringArg) ||
		student.firstname.toLowerCase().includes(searchStringArg));
	}
	return await context.prisma.students();
}

async function getDegrees(root, args, context) {
	if (args.searchString) {
		let searchStringArg = args.searchString.toLowerCase();
		let allDegrees = await context.prisma.degrees();
		return allDegrees.filter((degree) => degree.degreeCode.toLowerCase().includes(searchStringArg) ||
		degree.name.toLowerCase().includes(searchStringArg));
	}
	return await context.prisma.degrees();
}

async function coursesSearch(root, args, context) {
	if (args.searchString && args.searchString.trim().length > 0) {
		let searchStringArg = args.searchString.toLowerCase();
		let allCourses = await context.prisma.courses();
		return allCourses.filter((course) => course.name.toLowerCase().includes(searchStringArg) ||
		course.courseID.toLowerCase().includes(searchStringArg));
	}
	return await context.prisma.courses({where: {year:args.year}});
}

async function getcourseDegreeWeight(root, args, context) {
	return await context.prisma.courseDegreeWeight({where: {id:args.id}});
}

async function getcourseDegreeWeights(root, args, context) {
	return await context.prisma.courseDegreeWeight({where: {degree:args.degree}});
}

async function getUsers(root, args,context) {
	return await context.prisma.users()
}



module.exports = {
	userPosts,
	checkPermission,
	gradeFromCourseID,
	getGradeByID,
	getOverallGrade,
	getCourses, 
	getCoursesFromYear,
	getUsers,
	coursesSearch,
	getStudents,
	getDegrees,
	getcourseDegreeWeight,
	getcourseDegreeWeights
}