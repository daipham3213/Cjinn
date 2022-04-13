import { gql } from '@apollo/client'

export const GET_DEVICE_BY_ID = gql`
  query GetDeviceByUserId($userId: UUID) {
    messenger {
      getDeviceByUserId(userId: $userId) {
        pk
        registrationId
        lastSeen
      }
    }
  }
`

export const GET_ALL_DEVICE = gql`
  query GetAllDevice($before: String, $after: String, $first: Int, $last: Int) {
    messenger {
      getAllDevice(before: $before, after: $after, first: $first, last: $last) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          cursor
          node {
            name
            token
            salt
            gcmId
            apnId
            voidApnId
            pushTimeStamp
            fetchesMessages
            registrationId
            signedPreKey
            isStale
            lastSeen
            createdDate
          }
        }
      }
    }
  }
`

export const GET_CURRENT_DEVICE = gql`
  query GetCurrentDevice {
    messenger {
      getCurrentDevice {
        id
        name
        token
        salt
        gcmId
        apnId
        voidApnId
        pushTimeStamp
        fetchesMessages
        registrationId
        signedPreKey {
          id
          publicKey
          signature
        }
        lastSeen
        createdDate
      }
    }
  }
`

export const GET_KEY_STATUS = gql`
  query GetKeyStatus($deviceId: UUID) {
    messenger {
      getStatus(deviceId: $deviceId) {
        count
      }
    }
  }
`

export const GET_DEVICE_KEY = gql`
  query GetDeviceKey($userId: UUID) {
    messenger {
      getDeviceKeys(userId: $userId) {
        identityKey
        devices {
          deviceId
          registrationId
          preKey {
            id
            publicKey
          }
          signedPreKey {
            id
            publicKey
            signature
          }
        }
      }
    }
  }
`

export const GET_SIGNED_PRE_KEY = gql`
  query GetSignedPreKey($deviceId: UUID) {
    messenger {
      getSignedPreKey(deviceId: $deviceId) {
        id
        publicKey
        signature
      }
    }
  }
`

export const GET_FRIEND_REQUEST = gql`
  query getFriendRequest {
    messenger {
      friendRequest {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            pk
            avatar
            firstName
            lastName
            timestamp
            type
          }
        }
      }
    }
  }
`

export const GET_THREAD_LIST = gql`
  query getThreadList($ids: [UUID]!) {
    messenger {
      threadList(ids: $ids) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            pk
            leader {
              username
              firstName
              lastName
              avatar
              pk
            }
            name
            icon
            dateCreated
            extras
            members {
              pk
              info {
                firstName
                lastName
                dob
                username
                avatar
                pk
              }
              joinedDate
              isBlocked
              isMuted
            }
          }
        }
      }
    }
  }
`
export const SEARCH_CONTACT = gql`
  query SearchContacts(
    $keyword: String
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    messenger {
      searchContacts(
        keyword: $keyword
        before: $before
        after: $after
        first: $first
        last: $last
      ) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          cursor
          node {
            pk
            username
            firstName
            lastName
            dateJoined
            dob
            gender
          }
        }
      }
    }
  }
`
export const GET_THREAD = gql`
  query getThread($id: UUID!) {
    messenger {
      thread(id: $id) {
        pk
        name
        icon
        isEncrypted
        extras
        dateCreated
        leader {
          pk
          username
          lastName
          firstName
          dob
          gender
          avatar
        }
        members {
          pk
          info {
            firstName
            lastName
            dob
            username
            avatar
            pk
          }
          joinedDate
          isBlocked
          isMuted
        }
      }
    }
  }
`

export const FRIEND_ONLINE_LIST = gql`
  query getOnlineList {
    messenger {
      friendsOnline {
        edges {
          node {
            status
            userId
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`

export const GET_MEETING = gql`
  query getMeeting($meetingId: UUID!) {
    messenger {
      getMeeting(meetingId: $meetingId) {
        callee
        caller
        pk
      }
    }
  }
`
