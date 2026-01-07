import { buildSchema } from "graphql";

export default buildSchema(`
  type User {
    id: ID!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    status: String!
    dueDate: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    tasks: [Task]
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    addTask(title: String!): Task
    updateTask(id: ID!, status: String!): Task
    deleteTask(id: ID!): Boolean
  }
`);
