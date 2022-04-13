import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  FriendOnlineConnection,
  FriendOnlineEdge,
  FriendRequestConnection,
  FriendRequestEdge,
  Maybe,
  MessengerQuery,
  ThreadType,
  ThreadTypeConnectionsConnection,
  ThreadTypeConnectionsEdge,
  UserNodeConnection,
  UserNodeEdge,
  UserQuery,
  UserViewConnection,
  UserViewEdge,
} from '@/Services/types'

interface MessageStoreProps {
  isLoading: boolean
  threads: {
    results: Array<Maybe<ThreadTypeConnectionsEdge>>
    connection: Maybe<ThreadTypeConnectionsConnection>
  }
  findUser: {
    results: Array<Maybe<UserNodeEdge>>
    connection: Maybe<UserNodeConnection>
  }
  contacts: {
    connection: Maybe<UserViewConnection>
    results: Array<Maybe<any>>
  }
  searchContact: {
    connection: Maybe<UserViewConnection>
    results: Array<Maybe<UserViewEdge>>
  }
  onlineList: {
    connection: Maybe<FriendOnlineConnection>
    results: Array<Maybe<FriendOnlineEdge>>
  }
  friendRequest: {
    connection: Maybe<FriendRequestConnection>
    results: Array<Maybe<FriendRequestEdge>>
  }
  activeThread: ThreadType
  userInfo: UserQuery['userInfo']
}
const paginate = {
  results: [],
  connection: {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      endCursor: null,
      startCursor: null,
    },
    edges: [],
  },
}
const initialState: MessageStoreProps = {
  isLoading: false,
  threads: paginate,
  findUser: paginate,
  contacts: paginate,
  searchContact: paginate,
  onlineList: paginate,
  friendRequest: paginate,
  activeThread: {
    id: '',
    pk: '',
    dateCreated: '',
    extras: {},
    isEncrypted: false,
  },
  userInfo: {
    dateJoined: '',
    isActive: false,
    isEmail: false,
    isPhone: false,
    username: '',
  },
}

const slice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    toggleLoading: state => {
      state.isLoading = !state.isLoading
    },
    loadThreadList: (
      { threads },
      { payload }: PayloadAction<MessengerQuery['threadList']>,
    ) => {
      if (payload && payload.edges) {
        threads.connection = payload
        payload.edges.forEach(item => {
          const index = threads.results.findIndex(
            value => value?.node?.pk === item?.node?.pk,
          )
          index > -1
            ? (threads.results[index] = item)
            : threads.results.push(item)
        })
      }
    },
    loadFriendRequest: (
      { friendRequest },
      { payload }: PayloadAction<MessengerQuery['friendRequest']>,
    ) => {
      if (payload && payload.edges) {
        friendRequest.connection = payload
        payload.edges.forEach(item => {
          const index = friendRequest.results.findIndex(
            value => value?.node?.pk === item?.node?.pk,
          )
          index > -1
            ? (friendRequest.results[index] = item)
            : friendRequest.results.push(item)
        })
      }
    },
    loadFindUser: (
      { findUser },
      { payload }: PayloadAction<UserQuery['findUser']>,
    ) => {
      if (payload) {
        findUser.connection = payload
        if (payload.edges && payload.edges.length > 0) {
          payload.edges.forEach(item => {
            const index = findUser.results.findIndex(
              value => value?.node?.pk === item?.node?.pk,
            )
            if (index > -1) {
              findUser.results[index] = item
            } else {
              findUser.results.push(item)
            }
          })
        }
      }
    },
    loadContacts: (
      { contacts },
      { payload }: PayloadAction<MessengerQuery['contacts']>,
    ) => {
      if (payload && payload.edges && payload.edges.length > 0) {
        contacts.connection = payload
        payload.edges.forEach(item => {
          const index = contacts.results.findIndex(
            value => value?.node?.pk === item?.node?.pk,
          )
          if (index > -1) {
            contacts.results[index] = item
          } else {
            contacts.results.push(item)
          }
        })
      }
    },
    loadSearchContacts: (
      state,
      { payload }: PayloadAction<UserViewConnection>,
    ) => {
      if (payload && payload.edges && payload.edges.length > 0) {
        state.searchContact.connection = payload
        state.searchContact.results = [
          ...new Set(state.searchContact.results.concat(payload.edges)),
        ]
      }
    },
    loadUserInfo: (
      state,
      { payload }: PayloadAction<UserQuery['userInfo']>,
    ) => {
      state.userInfo = payload
    },
    loadActiveThread: (state, { payload }: PayloadAction<ThreadType>) => {
      state.activeThread = payload
    },
    loadOnlineList: (
      { onlineList },
      { payload }: PayloadAction<FriendOnlineConnection>,
    ) => {
      if (payload && payload.edges && payload.edges.length > 0) {
        onlineList.connection = payload
        payload.edges.forEach(item => {
          const index = onlineList.results.findIndex(
            value => value?.node?.userId === item?.node?.userId,
          )
          index > -1
            ? (onlineList.results[index] = item)
            : onlineList.results.push(item)
        })
      }
    },
    resetState: (
      state,
      action: PayloadAction<keyof MessageStoreProps | undefined>,
    ) => {
      state.isLoading = false
      const {
        threads,
        contacts,
        searchContact,
        findUser,
        userInfo,
        activeThread,
        onlineList,
        friendRequest,
      } = initialState
      switch (action.payload) {
        case undefined:
          return initialState
        case 'threads':
          state.threads = threads
          break
        case 'searchContact':
          state.searchContact = searchContact
          break
        case 'contacts':
          state.contacts = contacts
          break
        case 'findUser':
          state.findUser = findUser
          break
        case 'userInfo':
          state.userInfo = userInfo
          break
        case 'activeThread':
          state.activeThread = activeThread
          break
        case 'onlineList':
          state.onlineList = onlineList
          break
        case 'friendRequest':
          state.friendRequest = friendRequest
          break
      }
    },
  },
})

export default slice.reducer
export const interactionsActions = slice.actions
