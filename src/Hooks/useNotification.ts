import React from 'react'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import { requestNotificationPrem } from '@/Services/utils'
import { useSignalStorage } from '@/Hooks/useAppStorage'
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native'
import uuid from 'react-native-uuid'
import moment from 'moment'
import { useTheme } from '@ui-kitten/components'

type Notification<T> = {
  messages: T[]
  type: 'incoming_message' | 'completion_signal' | 'seen_signal'
}

type ReceivedMessage = {
  id: string
  contents: string
  createBy: string
  destinationDeviceId: string
  isSync: boolean
  threadId: string
  timestamp: string
  replyTo?: string
  sender: Sender
}

type DeliveredItem = {
  id: string
  threadId: string
}

type Sender = {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}

const useNotification = () => {
  const theme = useTheme()
  const store = useSignalStorage()

  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    try {
      if (message.data) {
        const id = uuid.v4().toString()
        const { messages, type } = message.data
        console.log(messages)
        if (type === 'incoming_message') {
          const items: ReceivedMessage[] = JSON.parse(messages)
          // Create summary
          await notifee.displayNotification({
            title: 'Incoming Messages',
            subtitle: `${items.length} Unread Messages`,
            android: {
              smallIcon: 'ic_launcher',
              // color: theme['primary-color-500'],
              channelId: type,
              groupSummary: true,
              groupId: id,
              groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
            },
          })
          items.forEach(item => {
            notifee.displayNotification({
              id: item.id + '|' + item.threadId,
              title: `New message from ${
                item.sender.firstName + ' ' + item.sender.lastName
              }`,
              subtitle: 'Unread',
              body: item.contents,
              android: {
                channelId: type,
                groupId: id,
                timestamp: moment(item.timestamp).toDate().getTime(),
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                showTimestamp: true,
                actions: [
                  {
                    title: 'View conversation',
                    pressAction: {
                      id: 'view-conversation|' + item.threadId,
                      launchActivity: 'default',
                    },
                  },
                ],
              },
            })
          })
        }
      }
    } catch (e) {
      console.log('Notification data error ', e)
    }
  }

  React.useEffect(() => {
    requestNotificationPrem().catch(e => console.log('FCM Error', e))
    messaging().onMessage(message => console.log(message))
    messaging().setBackgroundMessageHandler(onMessageReceived)
  }, [])
  return {}
}
export default useNotification
