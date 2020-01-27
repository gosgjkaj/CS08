function course(root, args, context) {
    return context.prisma.courseDegreeWeight({id: root.id}).course()
}
function degree(root, args, context) {
    return context.prisma.courseDegreeWeight({id: root.id}).degree()
}


module.exports = {
    course,
    degree,

}