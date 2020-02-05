function student(root, args, context) {
    return context.prisma.overallGrade({id: root.id}).student()
}

module.exports = {
    student
}
