import { createAction } from '@reduxjs/toolkit'
import {
  MessageInput,
  MessengerMutationProcessFriendRequestArgs,
  MessengerMutationRemoveContactArgs,
  MessengerMutationSendFriendRequestArgs,
  MessengerQueryContactsArgs,
  MessengerQueryFriendRequestArgs,
  MessengerQuerySearchContactsArgs,
  MessengerQueryThreadListArgs,
  UserQueryFindUserArgs,
  UserQueryUserInfoArgs,
} from '@/Services/types'
import { ReactNativeFile } from 'apollo-upload-client'

const getThreadsAction = createAction<
  MessengerQueryThreadListArgs & { isAppend?: boolean }
>('query/getThreadList')
const findUserAction = createAction<UserQueryFindUserArgs>('query/findUser')
const getContactsAction =
  createAction<MessengerQueryContactsArgs>('query/getContacts')
const getFriendRequestAction = createAction<MessengerQueryFriendRequestArgs>(
  'query/getFriendRequest',
)
const getUserInfoAction =
  createAction<UserQueryUserInfoArgs>('query/getUserInfo')
const searchContactAction = createAction<MessengerQuerySearchContactsArgs>(
  'query/searchContact',
)
const getThreadAction = createAction<{ id: string }>('query/getThreadById')
const getOnlineListAction = createAction('query/getOnlineFriendList')

// Mutations
const sendMessageAction = createAction<
  { message: Omit<MessageInput, 'destinationDeviceId'> } & {
    files?: ReactNativeFile[]
  }
>('mutation/sendMessage')
const sendFriendRequestAction =
  createAction<MessengerMutationSendFriendRequestArgs>(
    'mutation/sendFriendRequest',
  )
const processFriendRequestAction =
  createAction<MessengerMutationProcessFriendRequestArgs>(
    'mutation/processFriendRequest',
  )
const removeContactAction = createAction<MessengerMutationRemoveContactArgs>(
  'mutation/removeContact',
)

const messageActions = {
  getThreadsAction,
  findUserAction,
  getContactsAction,
  getUserInfoAction,
  getFriendRequestAction,
  sendFriendRequestAction,
  processFriendRequestAction,
  removeContactAction,
  sendMessageAction,
  searchContactAction,
  getThreadAction,
  getOnlineListAction,
}
export default messageActions
