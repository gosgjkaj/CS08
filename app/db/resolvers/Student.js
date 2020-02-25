function degree(root, args, context) {
    return context.prisma.student({id: root.id}).degree()
}

async function myoverallgrades(root, args, context) { 
    let OverallGrades = await context.prisma.overallGrades( {where:  { student: {id:root.id} }});
    return OverallGrades
}

function mygrades(root, args, context) {
    return  context.prisma.studentCourseGrades({where:  { student: {id:root.id} }});
}

module.exports = {
    degree, myoverallgrades, mygrades
}