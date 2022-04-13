import React, { Component } from 'react'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import notifee, {
  AndroidCategory,
  AndroidImportance,
  EventType,
} from '@notifee/react-native'
import { Config } from '@/Config'
import { getCurrentRoute, navigate } from '@/Navigators/utils'
import { EnhancedStore, store, syncThreadAction } from '@/Store'
import { Dispatch } from 'redux'
import RNCallKeep from 'react-native-callkeep'
import { meetingSliceActions } from '@/Containers/CallContainer/components/slice'
import { callSignalingAction, getMeetingAction } from '@/Store/MeetingStore'
import { mapPortDeliveredType, mapPortReceivedType, mapReceivedMessageToMessage } from "@/Services/utils";
import { DeliveredItem, PortDelivered, PortReceived, ReceivedMessage } from "@/Store/SignalStore/type";

type NotificationType<T> = {
  messages: T[]
  type: 'incoming_message' | 'completion_signal' | 'seen_signal'
}
type Props = {
  store: EnhancedStore
  dispatch: Dispatch
}

const notificationSound =
  'https://proxy.notificationsounds.com/sound-effects/hollow-582/download/file-sounds-1129-hollow.ogg'
class Notification extends Component<Props, Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      store: props.store,
      dispatch: props.dispatch,
    }
    this.checkNotify = this.checkNotify.bind(this)
    this.persistMessage = this.persistMessage.bind(this)
    this.onNewNotification = this.onNewNotification.bind(this)
  }

  componentDidMount = async () => {
    this.checkNotificationPermission()
    await messaging().requestPermission({ provisional: true })
    await messaging().registerDeviceForRemoteMessages()

    if (Platform.OS === 'android') {
      await this.createAndroidNotificationChannel().catch(e => console.log(e))
    }

    this.backgroundState()
    this.foregroundState()
  }
  checkNotificationPermission = () => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (!enabled) {
          this.promptForNotificationPermission()
        }
      })
  }

  promptForNotificationPermission = () => {
    messaging()
      .requestPermission({ provisional: true })
      .then(() => {
        console.log('Permission granted.')
      })
      .catch(() => {
        console.log('Permission rejected.')
      })
  }

  persistMessage = async (message: ReceivedMessage) => {
    const { store: disk, dispatch } = this.state
    // Checking thread exist
    const thread = disk.messages.getThreadById(message.threadId)
    if (!thread) {
      dispatch(syncThreadAction({ id: message.threadId, message: message }))
    } else {
      const mapped = mapReceivedMessageToMessage(message)
      console.log('mapped msg', mapped)
      await disk.messages.addMessage(mapped)
    }
  }

  showAlertNotification = (data: any) => {
    const threadId = data?.threadId
    if (threadId) {
      navigate('Conversation', {
        screen: 'InConversation',
        params: { threadId },
      })
    }
  }
  cancelNotification = (data: any) => {
    notifee.cancelNotification(data)
  }

  async createAndroidNotificationChannel() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification } = detail
      console.log(type === EventType.PRESS)
      if (type === EventType.PRESS) {
        this.showAlertNotification(notification?.data)
      }
      this.cancelNotification(notification?.id)
    })

    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          this.cancelNotification(detail.notification?.id)
          break
        case EventType.PRESS:
          this.showAlertNotification(detail.notification?.data)
          this.cancelNotification(detail.notification?.id)
          break
      }
    })
    return await notifee.createChannel({
      id: Config.CHANNEL_NOTIFY,
      name: 'Cjinn - Chat App',
      importance: AndroidImportance.HIGH,
      soundURI: notificationSound,
      vibration: true,
    })
  }

  checkNotify = (message: any): boolean => {
    try {
      const route = getCurrentRoute()
      if (route === undefined || route === null) {
        return true
      }
      const { name, params }: any = route
      const notBlacklist = name !== 'ConversationList'
      const notCurrentThread =
        name === 'InConversation' && params?.threadId !== message.threadId
      return notBlacklist && notCurrentThread
    } catch (e) {
      console.log('Check notify error', e)
      return true
    }
  }

  async onNewNotification(notification: FirebaseMessagingTypes.RemoteMessage) {
    console.log('Handle by FCM!')
    if (notification.data) {
      const { data } = notification
      switch (data.type) {
        // <editor-fold desc="Incoming message handler">
        case 'incoming_message':
          const portR: PortReceived[] = JSON.parse(data.messages)
          let messages = portR.map(item => mapPortReceivedType(item))
          for (let i = 0; i < messages.length; i++) {
            const message = messages[i]
            const { avatar, firstName, lastName } = message.sender
            const isNotify = this.checkNotify(message)
            if (isNotify) {
              await notifee
                .displayNotification({
                  data: { messageId: message.id, threadId: message.threadId },
                  body: message.contents,
                  title: `New message from ${firstName} ${lastName}`,
                  android: {
                    autoCancel: true,
                    category: AndroidCategory.MESSAGE,
                    channelId: Config.CHANNEL_NOTIFY,
                    largeIcon: avatar
                      ? avatar
                      : require('@/Assets/Images/app-logo.png'),
                  },
                })
                .catch(e => console.log('Notifee error', e))
            }
            await this.persistMessage(message).catch(e =>
              console.log('Persist error', e),
            )
          }
          break
        // </editor-fold >
        // <editor-fold desc="Message delivery status">
        case 'completion_signal':
          const portD: PortDelivered[] = JSON.parse(data.messages)
          let deliveredItems = portD.map(item => mapPortDeliveredType(item))
          const success = data.success
          deliveredItems.forEach((item: DeliveredItem) => {
            this.state.store.messages.editMessage(item.id, item.threadId, {
              status: success ? 'delivered' : 'error',
              media: item.media,
            })
          })
          break
        // </editor-fold >
        // <editor-fold desc="Seen Signal Handler">
        case 'seen_signal':
          break
        // </editor-fold >
        // <editor-fold desc="Meeting Signal Handler">
        case 'meeting':
          const { signalType, meetingId, from } = JSON.parse(data.payload)
          if (signalType === 'calling') {
            const isBusy = !store.getState().meeting.available
            if (!isBusy) {
              console.log(from.username)
              this.state.dispatch(
                meetingSliceActions.setCaller({
                  firstName: from.firstName,
                  lastName: from.lastName,
                  id: from.id,
                  username: from.username,
                }),
              )
              const callerName = `${from?.firstName} ${from?.lastName}`
              RNCallKeep.backToForeground()
              RNCallKeep.displayIncomingCall(
                meetingId ?? 'id',
                from.username ?? 'username',
                callerName ?? 'unknown',
                'generic',
                true,
              )
            } else {
              // dispatch busy
              this.state.dispatch(
                callSignalingAction({
                  signalType: 'busy',
                  meetingId,
                  userId: undefined,
                }),
              )
            }
          }
          break
        // </editor-fold >
      }
    }
  }

  foregroundState = () => {
    messaging().onMessage(this.onNewNotification)
  }

  backgroundState = () => {
    messaging().setBackgroundMessageHandler(this.onNewNotification)
  }
  render() {
    return <></>
  }
}

export default Notification
