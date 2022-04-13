import { gql } from '@apollo/client'

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($recipientId: String!) {
    messenger {
      sendFriendRequest(recipientId: $recipientId) {
        errors
        result
        success
      }
    }
  }
`
export const ADD_KEY_BUNDLE = gql`
  mutation AddKeyBundles(
    $identityKey: String!
    $preKeys: [PreKeyInput]
    $registrationId: String!
    $signedPreKey: SignedPreKeyInput!
  ) {
    messenger {
      addKeyBundles(
        identityKey: $identityKey
        preKeys: $preKeys
        registrationId: $registrationId
        signedPreKey: $signedPreKey
      ) {
        errors
        success
        result
      }
    }
  }
`

export const REG_DEVICE = gql`
  mutation RegisterDevice($registrationId: String!) {
    messenger {
      createDeviceToken(registrationId: $registrationId) {
        success
        errors
        result
      }
    }
  }
`
export const REMOVE_DEVICE = gql`
  mutation RemoveDevice($registrationId: String!) {
    messenger {
      removeDevice(registrationId: $registrationId) {
        success
        errors
        result
      }
    }
  }
`
export const UPDATE_DEVICE_INFO = gql`
  mutation UpdateDeviceInfo(
    $gcmId: String
    $apnId: String
    $voidApnId: String
  ) {
    messenger {
      updateDeviceInfo(apnId: $apnId, gcmId: $gcmId, voidApnId: $voidApnId) {
        errors
        result
        success
      }
    }
  }
`
export const VERIFY_DEVICE = gql`
  mutation VerifyDevice(
    $password: String!
    $registrationId: String!
    $otp: String!
    $deviceName: String!
  ) {
    messenger {
      verifyDeviceToken(
        password: $password
        registrationId: $registrationId
        otp: $otp
        deviceName: $deviceName
      ) {
        success
        errors
        result
      }
    }
  }
`
export const SEND_MESSAGE = gql`
  mutation SendMessage($messages: [MessageInput]!, $files: [Upload]) {
    messenger {
      sendMessage(messages: $messages, files: $files) {
        errors
        result
        success
      }
    }
  }
`
export const PROCESS_FRIEND_REQUEST = gql`
  mutation ProcessFriendRequest($senderId: String!, $isAccept: String!) {
    messenger {
      processFriendRequest(senderId: $senderId, isAccept: $isAccept) {
        errors
        success
        result
      }
    }
  }
`
export const REMOVE_CONTACT = gql`
  mutation RemoveContact($userId: String!) {
    messenger {
      removeContact(userId: $userId) {
        errors
        success
        result
      }
    }
  }
`

export const ADD_THREAD = gql`
  mutation AddThread(
    $name: String
    $memberIds: [UUID]!
    $isEncrypted: Boolean!
  ) {
    messenger {
      addThread(name: $name, memberIds: $memberIds, isEncrypt: $isEncrypted) {
        success
        errors
        result
      }
    }
  }
`
export const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo(
    $fistName: String
    $lastName: String
    $dob: Date
    $language: LANG
    $gender: GENDER
    $discoverableByPhoneNumber: Boolean
    $phone: String
  ) {
    messenger {
      updateUserInfo(
        fistName: $fistName
        lastName: $lastName
        dob: $dob
        gender: $gender
        language: $language
        discoverableByPhoneNumber: $discoverableByPhoneNumber
        phone: $phone
      ) {
        errors
        result
        success
      }
    }
  }
`

export const CALL_SIGNALING = gql`
  mutation callSignaling(
    $meetingId: UUID
    $hasVideo: Boolean
    $userId: UUID
    $signalType: String!
  ) {
    messenger {
      callSignaling(
        hasVideo: $hasVideo
        signalType: $signalType
        meetingId: $meetingId
        userId: $userId
      ) {
        errors
        result
        success
      }
    }
  }
`
