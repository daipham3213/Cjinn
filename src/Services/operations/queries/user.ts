import { gql } from '@apollo/client'

export const FIND_USER = gql`
  query FindUser(
    $offset: Int
    $before: String
    $after: String
    $first: Int
    $last: Int
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $phone: String
  ) {
    user {
      findUser(
        offset: $offset
        before: $before
        after: $after
        first: $first
        last: $last
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        phone: $phone
      ) {
        pageInfo {
          startCursor
          endCursor
        }
        edges {
          node {
            pk
            username
            firstName
            lastName
            language
            dob
            gender
            dateJoined
            avatar
            isActive
          }
        }
      }
    }
  }
`
export const GET_USER = gql`
  query GetUser($id: UUID!) {
    user {
      userInfo(id: $id) {
        username
        firstName
        lastName
        email
        phone
        dob
        gender
        avatar
        isPhone
        isEmail
        isActive
        dateJoined
        language
        pk
        status
        contactStatus
      }
    }
  }
`
export const ME = gql`
  {
    user {
      me {
        avatar
        dateJoined
        dob
        email
        firstName
        gender
        id
        isActive
        isEmail
        isPhone
        language
        lastName
        phone
        username
      }
    }
  }
`
