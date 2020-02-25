const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

// Import your resolvers here from ./resolvers
const Mutation = require('./resolvers/Mutation.js')
const Query = require('./resolvers/Query.js')
const Post = require('./resolvers/Post.js')
const StudentCourseGrade = require('./resolvers/StudentCourseGrade.js')
const OverallGrade = require('./resolvers/OverallGrade.js')
const CourseDegreeWeight = require('./resolvers/CourseDegreeWeight.js')
const Student = require('./resolvers/Student.js')
const CourseRun = require('./resolvers/CourseRun.js')
const Degree = require('./resolvers/Degree.js')

const resolvers = {
  Query,
  Mutation,
  Post,
  StudentCourseGrade,
  OverallGrade,
  CourseDegreeWeight,
  Student,
  CourseRun,
  Degree
}

const server = new GraphQLServer({
	typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma,
  }),
})

server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))