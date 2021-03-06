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

//return all courses for the mainpage that are current courses and are included  in a degree
async function coursesFromYear(root, args, context) {
	let allCourseRuns = await context.prisma.courseRuns()
	let filtered = allCourseRuns.filter(courseRun => (courseRun.year).includes(args.year))
	let ids=[]
	
	if(filtered!=null){
	for(let i=0; i<filtered.length; i++){
		ids.push(filtered[i].id)

	}
	}

	let courses = await context.prisma.courseRuns({where: {
		id_in: ids
	}}).course()
	
	courses = courses.map(item => item.course.id)

	let coursesByDegree = await context.prisma.courseDegreeWeights({where: {degree: {id: args.id }}}).course()
	coursesByDegree = coursesByDegree.map(item => item.course)

	let result = coursesByDegree.filter(course => courses.indexOf(course.id)>=0)

	return result
}

async function gradeFromCourseID(root, args, context) {
	let courseGradeStudent = await context.prisma.studentCourseGrades({where: {date: args.date, course: { id: args.id }}})
	return courseGradeStudent
}

async function studentfromDegreeID(root, args, context){
	let degreeStudent = await context.prisma.students({where: {degree: { id: args.id }}})
	return degreeStudent
}


async function namefromDegreeID(root, args, context){
	let degreeName = await context.prisma.degrees({where: { id: args.id }})
	return degreeName
}

async function gradefromStudentID(root, args, context){
	return await context.prisma.studentCourseGrades({where: {student: {id: args.id}}})
}

async function postfromGUID(root, args, context){
	return await context.prisma.posts({where: {guid: args.guid} })
}

async function overallGradeFromId(root, args, context){
	const grade =  await context.prisma.overallGrades({where: {student: {id: args.id}}})
	return grade
}

async function yearfromStudentGrade(root, args, context){
	return await context.prisma.overallGrade({where: {student: {id: args.id}}})
}


//filter students 
async function studentSearch(root, args, context) {
	if (args.searchString.trim().length > 0) {
		let searchStringArg = args.searchString.toLowerCase();
		let allStudents = await context.prisma.students();		
		return allStudents.filter( (student) => student.firstname.toLowerCase().includes(searchStringArg) ||
		student.surname.toLowerCase().includes(searchStringArg));
	}
	
	let degreeStudent = await context.prisma.students({where: {degree: { id: args.id }}})
	return degreeStudent
	
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

//extract course-run objects for  the listing of years available for a course
async function getCourseRuns(root, args, context) {
	if (args.searchString && args.searchString.trim().length > 0) {
		let coursejoined ="";
		const indexOfSearchItems = (allCourses, searchStringArg) => allCourses.reduce(
				(acc, eachCourse, i) => {
					coursejoined = Object.values(eachCourse.course).join("")
					return coursejoined.toLowerCase().includes(searchStringArg) ? [...acc, i] : acc
				},
			[]);

	let searchStringArg = args.searchString.toLowerCase();
	let allCourseRuns = await context.prisma.courseRuns();
	let allCourses = await context.prisma.courseRuns().course();
	let MatchedIndices = indexOfSearchItems(allCourses,searchStringArg);

	return await allCourseRuns.filter( (courseRun, index) => MatchedIndices.indexOf(index)>=0)

}
return await context.prisma.courseRuns();
}

async function getStudents(root, args, context) {
    let allStudents = await context.prisma.students();
    if (args.searchString && args.searchString.trim().length > 0) {
        let searchStringArg = args.searchString.toLowerCase().split(" ");
        if (searchStringArg.length>1){
            return allStudents.filter( (student) => student.surname.toLowerCase().includes(searchStringArg[1]) &&
        student.firstname.toLowerCase().includes(searchStringArg[0]))
        }else{
        return allStudents.filter( (student) => student.surname.toLowerCase().includes(searchStringArg[0]) ||
        student.firstname.toLowerCase().includes(searchStringArg[0]) || 
        student.guid.toLowerCase().includes(searchStringArg[0]))
        }
        
    }
    return await allStudents
}

async function getCourses(root, args, context) {
	if (args.searchString && args.searchString.trim().length > 0) {
		let searchStringArg = args.searchString.toLowerCase();
		let allCourses = await context.prisma.courses();
		return allCourses.filter((course) => course.name.toLowerCase().includes(searchStringArg) ||
			course.courseID.toLowerCase().includes(searchStringArg));
	}
	return await context.prisma.courses();
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

async function getcourseDegreeWeight(root, args, context) {
	return await context.prisma.courseDegreeWeight({where: {id:args.id}});
}

async function getcourseDegreeWeights(root, args, context) {
	return await context.prisma.courseDegreeWeights({where: {id:args.degree}});
}

async function getUsers(root, args,context) {
	return await context.prisma.users()
}

async function getWeight(root, args, context) {
	return await context.prisma.courseDegreeWeights( {
		where: {
			degree: {
				id: args.degree
			},
			course: {
				id: args.course
			}
		}
	})
}
async function getCourseByID( root,args, context){
	return await context.prisma.course( {id: args.id})
}



module.exports = {
	userPosts,
	checkPermission,
	getCoursesByDegree,
	getYear,
	gradeFromCourseID,
	getGradeByID,
	getOverallGrade,
	getUsers,
	getStudents,
	getDegrees,
	getcourseDegreeWeight,
	getcourseDegreeWeights,
	getCourseRuns,
	getCourses,
	studentfromDegreeID,
	gradefromStudentID,
	yearfromStudentGrade,
	namefromDegreeID,
	postfromGUID,
	overallGradeFromId,
	studentSearch,
	getWeight, 
	coursesFromYear,
	getCourseByID
}