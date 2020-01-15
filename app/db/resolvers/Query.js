const { getUser } = require('../utils')

function userPosts(root, args, context) {
	return context.prisma.user({id: args.id}).posts()
}

async function checkPermission(parent, args, context) {
	const user = await getUser(context)
	return user == null ? null : user.role
}

async function coursesFromYear(root, args, context) {
	let courseRuns = await context.prisma.courseRuns({ where: {year: args.year} }).course()
	courseRuns = courseRuns.map(item => item.course)
	return courseRuns
}

module.exports = {
	userPosts,
	coursesFromYear,
	checkPermission
}