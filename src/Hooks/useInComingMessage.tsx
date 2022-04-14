import React from 'react'
import { useSubscription } from '@apollo/client'
import { MESSAGE_NOTIFY } from '@/Services/operations'
import { useAppDispatch } from '@/Hooks/useReduxStore'
import { showInfoAction } from '@/Store/errorSaga'
import { Event_Type, Subscription } from '@/Services/types'
import { useSignalStorage } from '@/Hooks/useAppStorage'
import { getCurrentRoute } from '@/Navigators/utils'
import { messageActions, messageDecrypting, syncThreadAction } from '@/Store'
import notifee from '@notifee/react-native'
import { Config } from '@/Config'
import { DeliveredItem, ReceivedMessage } from '@/Store/SignalStore/type'
import {
  mapPortDeliveredType,
  mapPortReceivedType,
  mapReceivedMessageToMessage,
} from '@/Services/utils'

const BLACK_LIST = ['ConversationList']
// const WHITE_LIST = ['InConversation']

const useInComingMessage = () => {
  const dispatch = useAppDispatch()
  const store = useSignalStorage()
  const { data, error } = useSubscription<Subscription>(MESSAGE_NOTIFY, {
    fetchPolicy: 'cache-first',
  })
  const [received, setReceived] = React.useState<ReceivedMessage[]>([])
  const [seen, setSeen] = React.useState([])
  const [delivered, setDelivered] = React.useState<DeliveredItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  // Handle errors
  if (error) {
    setTimeout(
      () => dispatch(showInfoAction({ type: 'error', result: error.message })),
      10,
    )
  }
  const checkNotify = React.useCallback((message: any): boolean => {
    setLoading(false)
    const route = getCurrentRoute()
    const isNoRoute = route === undefined || route === null
    if (isNoRoute) {
      return true
    }
    const { name, params }: any = route
    const notBlacklist = !BLACK_LIST.includes(name)
    const notCurrentThread = params?.threadId !== message.threadId
    return notBlacklist && notCurrentThread
  }, [])

  const handleNotify = React.useCallback(
    async (message: any) => {
      const { firstName, lastName, avatar } = message.sender
      const isNotify = checkNotify(message)
      if (isNotify) {
        await notifee.displayNotification({
          data: { messageId: message.id, threadId: message.threadId },
          body: message.contents,
          title: `New message from ${firstName} ${lastName}`,
          android: {
            autoCancel: true,
            channelId: Config.CHANNEL_NOTIFY,
            largeIcon: avatar
              ? avatar
              : require('@/Assets/Images/app-logo.png'),
            pressAction: {
              id: 'launching',
              launchActivity: 'default',
            },
          },
        })
      }
    },
    [checkNotify],
  )

  React.useEffect(() => {
    async function flowDriver() {
      if (data && data.incomingMessage?.event && store) {
        setLoading(true)
        const { data: port, type } = data.incomingMessage.event
        console.log('data', port)
        switch (type) {
          case Event_Type.NewMessage:
            const receivedMessages = port?.map(item =>
              mapPortReceivedType(item),
            )
            setReceived([...new Set(receivedMessages)])
            let threadIds: string[] = []
            for (const item of receivedMessages as any) {
              threadIds.push(item.threadId)
              let message = item
              const thread = store.messages.getThreadById(item.threadId)
              if (!thread) {
                dispatch(syncThreadAction({ id: item.threadId, message: item }))
              } else {
                if (thread.isEncrypted) {
                  message.contents = await messageDecrypting(
                    item.contents,
                    item.sender.id,
                    item.registrationId,
                    store,
                  )
                }
                await store.messages.addMessage(
                  mapReceivedMessageToMessage(message),
                )
              }
              await handleNotify(message)
            }
            dispatch(messageActions.getThreadsAction({ ids: threadIds }))
            break
          case Event_Type.MessageDelivered:
            const deliveredItems = port?.map(item => mapPortDeliveredType(item))
            console.log(deliveredItems)
            setDelivered([...new Set(deliveredItems)])
            deliveredItems?.forEach((item: DeliveredItem) => {
              store.messages.editMessage(item.id, item.threadId, {
                status: 'delivered',
                media: item.media,
              })
            })
            setLoading(false)
            break
          case Event_Type.SeenMessage:
            // messages.forEach((item))
            break
        }
      }
    }

    flowDriver().catch(e => console.log(e))
  }, [data, dispatch, handleNotify, store])

  return {
    received,
    delivered,
    seen,
    loading,
  }
}
export default useInComingMessage
