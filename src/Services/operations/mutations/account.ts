import { gql } from '@apollo/client'

export const VALID_OTP = gql`
  mutation ValidOTP($pk: String!, $otp: String!) {
    account {
      validOTP(pk: $pk, otp: $otp) {
        success
        errors
        result
      }
    }
  }
`
export const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    account {
      register(
        username: $username
        email: $email
        firstName: $firstName
        lastName: $lastName
      ) {
        success
        errors
        result
      }
    }
  }
`
export const RE_SEND_OTP = gql`
  mutation ResendOtp($pk: String!) {
    account {
      resendOTP(pk: $pk) {
        errors
        result
        success
      }
    }
  }
`
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($passwordOld: String!, $passwordNew: String!) {
    account {
      changePassword(passwordNew: $passwordNew, passwordOld: $passwordOld) {
        errors
        success
        result
      }
    }
  }
`
export const OBTAIN_TOKEN = gql`
  # Login
  mutation ObtainToken($username: String!, $password: String!) {
    account {
      login(username: $username, password: $password) {
        success
        errors
        result
      }
    }
  }
`
