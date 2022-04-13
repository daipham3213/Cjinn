import { PayloadAction } from '@reduxjs/toolkit'
import {
  all,
  call,
  debounce,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import {
  GET_THREAD,
  GET_THREAD_LIST,
  SEARCH_CONTACT,
  GET_FRIEND_REQUEST,
} from '@/Services/operations/queries/messenger'
import {
  MessageInput,
  MessengerMutation,
  MessengerMutationProcessFriendRequestArgs,
  MessengerMutationSendFriendRequestArgs,
  MessengerQuery,
  MessengerQueryFriendRequestArgs,
  MessengerQuerySearchContactsArgs,
  MessengerQueryThreadListArgs,
  Query,
  UserQuery,
  UserQueryFindUserArgs,
  UserQueryUserInfoArgs,
} from '@/Services/types'
import { modalActions } from '../ModalStore'
import { showInfoAction, showMutationErrorAction } from '../errorSaga'
import messageActions from './actions'
import { interactionsActions } from './slice'
import {
  FIND_USER,
  GET_USER,
  PROCESS_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  SEND_MESSAGE,
} from '@/Services/operations'
import { Config } from '@/Config'
import { ApolloClient } from '@/Services/api'
import { EnhancedStore, RootState } from '@/Store'
import { Message } from '@/Store/SignalStore/type'
import { navigate } from '@/Navigators/utils'
import moment from 'moment'
import { ReactNativeFile } from 'apollo-upload-client'

const {
  getThreadsAction,
  findUserAction,
  sendFriendRequestAction,
  getUserInfoAction,
  searchContactAction,
  getThreadAction,
  sendMessageAction,
  processFriendRequestAction,
  getFriendRequestAction,
} = messageActions

function* getThreadList({
  payload,
}: PayloadAction<MessengerQueryThreadListArgs & { isAppend?: boolean }>) {
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_THREAD_LIST,
    payload,
  )
  if (!payload.after && !payload.before && !payload.isAppend) {
    yield put(interactionsActions.resetState('threads'))
  }
  if (response.threadList) {
    yield put(interactionsActions.loadThreadList(response.threadList))
  }
}

function* findUser(action: PayloadAction<UserQueryFindUserArgs>) {
  yield put(interactionsActions.toggleLoading())
  const response: Query['user'] = yield call(
    ApolloClient.query,
    'user',
    FIND_USER,
    action.payload,
  )
  yield put(interactionsActions.toggleLoading())
  if (response) {
    yield put(interactionsActions.loadFindUser(response.findUser))
  }
}

function* sendFriendRequest(
  action: PayloadAction<MessengerMutationSendFriendRequestArgs>,
) {
  yield put(interactionsActions.toggleLoading())
  const response: MessengerMutation = yield call(
    ApolloClient.mutate,
    'messenger',
    SEND_FRIEND_REQUEST,
    action.payload,
  )
  yield put(interactionsActions.toggleLoading())
  if (response.sendFriendRequest) {
    const { success, result, errors } = response.sendFriendRequest
    if (success) {
      yield put(showInfoAction({ type: 'success', result: result }))
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* getUserInfo(action: PayloadAction<UserQueryUserInfoArgs>) {
  yield put(modalActions.toggleLoading({ isShow: true }))
  const response: UserQuery = yield call(
    ApolloClient.query,
    'user',
    GET_USER,
    action.payload,
  )
  yield put(modalActions.toggleLoading({ isShow: false }))
  if (response.userInfo) {
    yield put(interactionsActions.loadUserInfo(response.userInfo))
  }
}

function* searchContact(
  action: PayloadAction<MessengerQuerySearchContactsArgs>,
) {
  yield put(interactionsActions.toggleLoading())
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    SEARCH_CONTACT,
    action.payload,
  )
  yield put(interactionsActions.toggleLoading())
  if (!action.payload.before && !action.payload.after) {
    yield put(interactionsActions.resetState('searchContact'))
  }
  if (response?.searchContacts) {
    yield put(interactionsActions.loadSearchContacts(response.searchContacts))
  }
}

function* getThread({ payload }: PayloadAction<{ id: string }>) {
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_THREAD,
    payload,
  )
  if (response.thread) {
    yield put(interactionsActions.loadActiveThread(response.thread))
  }
}

function* sendMessage({
  payload,
}: PayloadAction<
  { message: Omit<MessageInput, 'destinationDeviceId'> } & {
    files?: ReactNativeFile[]
  }
>) {
  // getting devices list
  const root: RootState = yield select()
  const { activeRecord } = root.device
  if (activeRecord) {
    const { auth, user } = activeRecord
    const store = new EnhancedStore({
      username: user.username,
      deviceId: auth.deviceId,
    })
    const { message, files } = payload
    const thread = store.messages.getThreadById(message.threadId)
    if (thread) {
      const devices = thread.devices.filter(
        value => value.deviceId !== auth.deviceId,
      )
      const messages: MessageInput[] = devices.flatMap(value => ({
        ...message,
        destinationDeviceId: value.deviceId,
      }))

      async function persistMessage() {
        const persistMsg: Message = {
          ...message,
          timeStamp: moment().toISOString(),
          replyTo: message.replyTo,
          extras: {
            status: 'sending',
          },
        }
        await store.messages.addMessage(persistMsg)
      }

      yield call(persistMessage)
      // console.log(messages)
      const response: MessengerMutation = yield call(
        ApolloClient.mutate,
        'messenger',
        SEND_MESSAGE,
        { messages: messages, files },
      )
      if (response.sendMessage) {
        const { errors, success } = response.sendMessage
        if (!success) {
          yield put(showMutationErrorAction({ errors }))
        }
      }
    }
  }
}

function* processFriendRequest({
  payload,
}: PayloadAction<MessengerMutationProcessFriendRequestArgs>) {
  const response: MessengerMutation = yield call(
    ApolloClient.mutate,
    'messenger',
    PROCESS_FRIEND_REQUEST,
    payload,
  )
  if (response.processFriendRequest) {
    const { errors, success, result } = response.processFriendRequest
    if (success) {
      yield put(showInfoAction({ type: 'success', result }))
      navigate('Main', { screen: 'UserInfo', params: { id: payload.senderId } })
    } else {
      yield showMutationErrorAction({ errors })
    }
  }
}

// function* sendCipherMessage({
//   payload,
// }: PayloadAction<Omit<MessageInput, 'destinationDeviceId'>>) {
//   const root: RootState = yield select()
//   const { activeRecord } = root.device
//   if (activeRecord) {
//     const { auth, user } = activeRecord
//     const store = new EnhancedStore({
//       username: user.username,
//       deviceId: auth.deviceId,
//     })
//   }
// }

function* getFriendRequest({
  payload,
}: PayloadAction<MessengerQueryFriendRequestArgs>) {
  const request: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_FRIEND_REQUEST,
    payload,
  )

  if (request.friendRequest) {
    yield put(interactionsActions.loadFriendRequest(request.friendRequest))
  }
}

export default function* messengerWatcher() {
  yield all([
    takeLatest(getThreadsAction.type, getThreadList),
    takeLatest(sendFriendRequestAction.type, sendFriendRequest),
    takeLatest(getUserInfoAction.type, getUserInfo),
    takeLatest(getThreadAction.type, getThread),
    takeLatest(processFriendRequestAction.type, processFriendRequest),
    takeLatest(getFriendRequestAction.type, getFriendRequest),
    takeEvery(sendMessageAction.type, sendMessage),
    debounce(Config.DEBOUNCE, findUserAction.type, findUser),
    debounce(Config.DEBOUNCE, searchContactAction.type, searchContact),
  ])
}
