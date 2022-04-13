import { createAction, PayloadAction } from '@reduxjs/toolkit'
import {
  deserializeKeyBundle,
  deviceActions,
  EnhancedStore,
  messageDecrypting,
  modalActions,
  RootState,
  SerializedKeyBundle,
} from '@/Store'
import {
  call,
  put,
  select,
  take,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects'
import { addKeyBundles, checkKeyCount } from '@/Containers'
import {
  MessageInput,
  MessengerMutation,
  MessengerQuery,
  MessengerQueryThreadArgs,
} from '@/Services/types'
import { ApolloClient } from '@/Services/api'
import {
  ADD_THREAD,
  GET_DEVICE_BY_ID,
  GET_DEVICE_KEY,
  GET_KEY_STATUS,
  GET_THREAD,
  SEND_MESSAGE,
} from '@/Services/operations'
import { showInfoAction, showMutationErrorAction } from '@/Store/errorSaga'
import { Message, ReceivedMessage, Thread } from '@/Store/SignalStore/type'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import {
  MessageType,
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import uuid from 'react-native-uuid'
import {
  mapMessageInputToMessage,
  mapReceivedMessageToMessage,
} from '@/Services/utils'
import { starterMessageBytes } from '@/Config'

type CheckKeyType = {
  username: string
  deviceId: string
}

type AddLocalThreadType = {
  threadId: string
  members: string[]
  isEncrypted: boolean
  navigate?: boolean
}

type AddThreadType = {
  memberIds: string[]
  isEncrypted: boolean
  name?: string
}

export const checkingKeyStoreAction = createAction<CheckKeyType>(
  'signal/checkingKeyStore',
)

export const addThreadLocalAction = createAction<AddLocalThreadType>(
  'message/createThreadLocal',
)
const addThreadLocalDone = createAction('message/createThreadLocalDone')
export const addThreadAction = createAction<AddThreadType>('mutation/addThread')
export const syncThreadAction = createAction<
  MessengerQueryThreadArgs & { message: ReceivedMessage }
>('sync/syncLocalThreads')
export const persistMessageAction = createAction<Message>('sync/message')
export const createSessionAction = createAction<{ threadId: string }>(
  'signal/createSession',
)

function* checkKeyStore({ payload }: PayloadAction<CheckKeyType>) {
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_KEY_STATUS,
    { deviceId: payload.deviceId },
  )
  if (response.getStatus) {
    const { count } = response.getStatus
    const store = new EnhancedStore({
      username: payload.username,
      deviceId: payload.deviceId,
    })
    const isGood: boolean = yield call(checkKeyCount, store)
    if (!isGood || !count || count < 1) {
      console.log('generating key store')
      const result: SerializedKeyBundle = yield call(addKeyBundles, store)
      if (result) {
        yield put(deviceActions.addKeyBundlesAction({ args: result }))
      }
    }
    navigateAndSimpleReset('Main')
  }
}

function* addThreadLocal({ payload }: PayloadAction<AddLocalThreadType>) {
  const { device }: RootState = yield select()
  const { activeRecord } = device

  if (activeRecord) {
    const { auth, user } = activeRecord
    const store = new EnhancedStore({
      username: user.username,
      deviceId: auth.deviceId,
    })
    const thread = store.messages.getThreadById(payload.threadId)
    if (!thread && payload.members.length > 0) {
      // Getting devices list per user
      let devices: { deviceId: string; userId: string }[] = []
      for (let i = 0; i < payload.members.length; i++) {
        const memberId = payload.members[i]
        const response: MessengerQuery = yield call(
          ApolloClient.query,
          'messenger',
          GET_DEVICE_BY_ID,
          { userId: memberId },
        )
        if (
          response.getDeviceByUserId &&
          response.getDeviceByUserId.length > 0
        ) {
          response.getDeviceByUserId.forEach(value => {
            value && devices.push({ deviceId: value.pk, userId: memberId })
          })
        } else {
          yield put(
            showInfoAction({
              type: 'error',
              result: 'A member does not have any device ' + memberId,
            }),
          )
        }
      }
      // Creating thread on local
      if (devices.length > 0) {
        const item: Thread = {
          id: payload.threadId,
          createDate: new Date(),
          members: payload.members,
          devices: devices,
          isEncrypted: payload.isEncrypted,
        }
        store.messages.addOrEditThread(item)
        yield put(addThreadLocalDone())
        payload.navigate &&
          navigate('Conversation', {
            screen: 'InConversation',
            params: { threadId: item.id },
          })
        if (item.isEncrypted) {
          yield put(createSessionAction({ threadId: item.id }))
        }
      }
    } else {
      if (thread) {
        payload.navigate &&
          navigate('Conversation', {
            screen: 'InConversation',
            params: { threadId: thread.id },
          })
        if (thread.isEncrypted) {
          yield put(createSessionAction({ threadId: thread.id }))
        }
      }
      yield put(addThreadLocalDone())
    }
  }
}

function* addThread({ payload }: PayloadAction<AddThreadType>) {
  yield put(modalActions.toggleLoading({ isShow: true, message: '' }))
  const response: MessengerMutation = yield call(
    ApolloClient.mutate,
    'messenger',
    ADD_THREAD,
    payload,
  )

  yield put(modalActions.toggleLoading({ isShow: false, message: '' }))
  if (response.addThread) {
    const { success, result, errors } = response.addThread
    if (success) {
      const values: AddLocalThreadType = {
        threadId: result.threadId,
        members: payload.memberIds,
        isEncrypted: result.isEncrypted,
        navigate: true,
      }
      yield put(addThreadLocalAction(values))
    } else {
      if (errors) {
        yield put(showMutationErrorAction({ errors }))
      }
    }
  }
}

function* removeThread({ payload }: PayloadAction<string>) {
  const { device }: RootState = yield select()
  const { activeRecord } = device

  if (activeRecord) {
    const { auth, user } = activeRecord
    const store = new EnhancedStore({
      username: user.username,
      deviceId: auth.deviceId,
    })
    const removing = async () => {
      return await store.messages.removeThread(payload)
    }
    yield call(removing)
  }
}

function* syncThreadById({
  payload,
}: PayloadAction<
  MessengerQueryThreadArgs & { message: ReceivedMessage; notify?: boolean }
>) {
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_THREAD,
    { id: payload.id },
  )
  if (response.thread && response.thread.members) {
    const { members, isEncrypted } = response.thread
    const member_ids = members.flatMap(value =>
      value?.info ? value.info.pk : [],
    )
    yield put(
      addThreadLocalAction({
        threadId: payload.id,
        members: member_ids,
        isEncrypted,
      }),
    )
    yield take(addThreadLocalDone)
    let message = payload.message
    if (isEncrypted) {
      const { device }: RootState = yield select()
      const { activeRecord } = device
      const decrypting = async () => {
        const { auth, user } = activeRecord!
        const store = new EnhancedStore({
          username: user.username,
          deviceId: auth.deviceId,
        })
        return await messageDecrypting(
          message.contents,
          message.sender.id,
          message.registrationId,
          store,
        )
      }
      message.contents = yield call(decrypting)
    }
    const mapped = mapReceivedMessageToMessage(message)
    console.log('mapped data', mapped)
    yield put(persistMessageAction(mapped))
  }
}

function* persistMessage({ payload }: PayloadAction<Message>) {
  const { device }: RootState = yield select()
  const { activeRecord } = device

  if (activeRecord) {
    const { auth, user } = activeRecord
    const store = new EnhancedStore({
      username: user.username,
      deviceId: auth.deviceId,
    })
    store.messages
      .addMessage(payload)
      .then(() => console.log('new message sync '))
      .catch(e => console.log('error while sync message ', e))
  }
}

function* createSession({ payload }: PayloadAction<{ threadId: string }>) {
  const { device }: RootState = yield select()
  const { activeRecord } = device
  const getThread: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_THREAD,
    {
      id: payload.threadId,
    },
  )

  if (activeRecord && getThread.thread) {
    const { auth, user } = activeRecord
    const activeThread = getThread.thread
    const store = new EnhancedStore({
      username: user.username,
      deviceId: auth.deviceId,
    })
    if (activeThread.members) {
      const { members } = activeThread
      const currentMember = members.find(value => value?.info?.pk === user.id)
      for (let i = 0; i < (members.length ?? 0); i++) {
        const member = members[i]
        if (member?.info && member.info.pk !== activeRecord.user.id) {
          const response: MessengerQuery = yield call(
            ApolloClient.query,
            'messenger',
            GET_DEVICE_KEY,
            { userId: member.info.pk },
          )
          if (response.getDeviceKeys) {
            let messages: MessageInput[] = []
            const { identityKey, devices } = response.getDeviceKeys
            if (devices && identityKey && currentMember) {
              for (let j = 0; j < (devices?.length ?? 0); j++) {
                if (devices[j]?.preKey && devices[j]?.signedPreKey) {
                  const item = devices[j]
                  const address = new SignalProtocolAddress(
                    member.info.pk,
                    item?.registrationId as any,
                  )
                  // initialize new session
                  const session = new SessionBuilder(store, address)
                  const keyBundle = deserializeKeyBundle({
                    preKey: {
                      keyId: item?.preKey?.id,
                      publicKey: item?.preKey?.publicKey,
                    },
                    signedPreKey: {
                      keyId: item?.signedPreKey?.id,
                      publicKey: item?.signedPreKey?.publicKey,
                      signature: item?.signedPreKey?.signature,
                    },
                    identityKey,
                  } as any)
                  const keyProcessing = async (): Promise<MessageType> => {
                    await session.processPreKey(keyBundle)
                    const cipher = new SessionCipher(store, address)
                    return await cipher.encrypt(starterMessageBytes.buffer)
                  }
                  const cipherText: MessageType = yield call(keyProcessing)

                  // create initial message
                  const mapped = mapMessageInputToMessage({
                    id: uuid.v4().toString(),
                    threadId: activeThread.pk,
                    createdBy: currentMember.pk,
                    extras: { status: 'sending' },
                    contents: JSON.stringify(cipherText),
                  })
                  messages.push({
                    ...mapped,
                    destinationDeviceId: item?.deviceId as any,
                  })
                  console.log(messages)
                }
              } // sending initial messages
              const sending: MessengerMutation = yield call(
                ApolloClient.mutate,
                'messenger',
                SEND_MESSAGE,
                { messages: messages },
              )
              if (sending.sendMessage) {
                const { errors, success } = sending.sendMessage
                if (!success) {
                  yield put(showMutationErrorAction({ errors }))
                }
              }
            }
          }
        }
      }
    }
  }
}

export function* keyStoreWatcher() {
  yield takeLeading(checkingKeyStoreAction.type, checkKeyStore)
  yield takeLeading(addThreadAction.type, addThread)
  yield takeLeading(addThreadLocalAction.type, addThreadLocal)
  yield takeEvery(syncThreadAction.type, syncThreadById)
  yield takeEvery(persistMessageAction.type, persistMessage)
  yield takeEvery(createSessionAction.type, createSession)
}
