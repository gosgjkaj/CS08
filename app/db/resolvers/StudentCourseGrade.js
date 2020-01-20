function course(root, args, context) {
    return context.prisma.studentCourseGrade({id: root.id}).course()
}
function student(root, args, context) {
    return context.prisma.studentCourseGrade({id: root.id}).student()
}


module.exports = {
    course,
    student,

}