import { gql } from '@apollo/client'

export const ONLINE_STATUS = gql`
  subscription {
    friendOnline {
      event {
        userId
        status
      }
    }
  }
`
export const MESSAGE_NOTIFY = gql`
  subscription {
    incomingMessage {
      event {
        data
        type
      }
    }
  }
`
export const FRIEND_REQUEST = gql`
  subscription {
    friendRequest {
      event
    }
  }
`

export const PRIVATE_CHANNEL = gql`
  subscription joinChannel($threadId: UUID!) {
    privateChannel(threadId: $threadId) {
      event {
        data
        type
      }
    }
  }
`

export const MEETING = gql`
  subscription joinMeeting($meetingId: UUID!) {
    callSignaling(meetingId: $meetingId) {
      event
    }
  }
`
