function course(root, args, context) {
    return context.prisma.courseRun({id: root.id}).course()
}

module.exports = {
    course
}