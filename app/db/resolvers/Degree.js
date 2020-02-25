async function courseDegreeWeights(parent, args, context) {
    return await context.prisma.degree({id: parent.id}).courseDegreeWeights()
     
    //.courseDegreeWeight({id: root.id}).course() 

}

module.exports = {
    courseDegreeWeights
}