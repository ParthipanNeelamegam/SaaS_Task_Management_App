import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      status
    }
  }
`;

export const ADD_TASK = gql`
  mutation($title: String!) {
    addTask(title: $title) {
      id
      title
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation ($id: ID!, $status: String!) {
    updateTask(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation ($id: ID!) {
    deleteTask(id: $id)
  }
`;
