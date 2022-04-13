import React, { useContext } from 'react'
import { Divider, Layout as View } from '@ui-kitten/components'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import uuid from 'react-native-uuid'
import { ConversationParamsList } from '@/Navigators/ConversationNavigator'
import {
  useAppDispatch,
  useAppSelector,
  useSignalStorage,
  useTheme,
} from '@/Hooks'
import { BackHandler } from 'react-native'
import { messageActions } from '@/Store'
import { getIconUrl, getName, mapMessageInputToMessage } from '@/Services/utils'
import { ConversationHeader, MessageInput, useMessageList } from './components'
import { callSignalingAction, meetingSliceActions } from '@/Store/MeetingStore'
import { MainContext } from '@/Containers/MainContext'
import { navigate } from '@/Navigators/utils'
import { ReactNativeFile } from 'apollo-upload-client'
import ImageCarousel from '@/Containers/ConversationContainer/components/ImageCarousel'
import { Message } from '@/Store/SignalStore/type'

type ConversationNavigatorProps = NativeStackScreenProps<
  ConversationParamsList,
  'InConversation'
>

const InputMemorized = React.memo(MessageInput)

const ConversationScreen = ({
  navigation,
  route,
}: ConversationNavigatorProps) => {
  // <editor-fold desc="States && Hooks">
  const { activeRecord } = useAppSelector(state => state.device)
  const { activeThread } = useAppSelector(state => state.interaction)
  const dispatch = useAppDispatch()
  const store = useSignalStorage()
  const { createOffer } = useContext(MainContext)

  const { Layout, Gutters } = useTheme()
  const { setMessages, renderListMessage } = useMessageList({
    thread: activeThread,
  })

  const [threadId, setThreadId] = React.useState<string>('')
  const [name, setName] = React.useState<string>('')
  const [icon, setIcon] = React.useState<string | undefined>()
  const [media, setMedia] = React.useState<ReactNativeFile[]>([])

  React.useEffect(() => {
    const backHandler = (): boolean => {
      navigation.goBack()
      return true
    }
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      backHandler,
    )
    return () => unsubscribe.remove()
  })

  React.useEffect(() => {
    const { params } = route
    setThreadId(params.threadId)
    if (activeRecord && store) {
      console.log('rendering')
      dispatch(messageActions.getThreadAction({ id: params.threadId }))
      setIcon(getIconUrl(activeThread, activeRecord))
      setName(getName(activeThread, activeRecord).toString())
    }
  }, [dispatch, route, store, threadId])
  // </editor-fold>

  const handleSendMessage = async (input?: string) => {
    new Promise<void>(() => {
      if (activeRecord && activeThread.members && input && input.length > 0) {
        const id = uuid.v4().toString()
        const member = activeThread.members.find(
          value => value?.info?.username === activeRecord.user.username,
        )
        if (member) {
          const message = {
            id,
            contents: input,
            createdBy: member.pk,
            threadId,
          }
          dispatch(messageActions.sendMessageAction({ message, files: media }))
          const mapped = mapMessageInputToMessage(message)
          const data: Message = {
            ...mapped,
            extras: {
              ...mapped.extras,
              media: media.flatMap(value => ({
                uri: value.uri,
                name: value.name,
                isVideo: (value.type?.indexOf('image') ?? 1) < 0,
              })),
            },
          }
          setMessages(prevState => [data, ...prevState])
          setMedia([])
        }
      }
    }).catch()
  }

  const handleCreateOffer = async () => {
    const offer = await createOffer()
    handlePostOffer(offer)
  }

  const handlePostOffer = React.useCallback(
    (offer: any) => {
      console.log('post offer')
      if (offer && activeThread.members && activeRecord) {
        const { id } = activeRecord.user
        const infos = activeThread.members.filter(
          value => value?.info?.pk !== id,
        )
        if (infos[0]?.info) {
          const { pk, firstName, lastName, username, avatar } = infos[0].info
          dispatch(
            meetingSliceActions.setCallee({
              id: pk,
              username: username,
              lastName: lastName as any,
              firstName: firstName as any,
              avatar: avatar,
            }),
          )
          navigate('Call', { screen: 'InCall', params: { meetingId: offer } })
          dispatch(
            callSignalingAction({
              userId: infos[0].info.pk,
              meetingId: offer,
              signalType: 'calling',
            }),
          )
        }
      }
    },
    [activeRecord, activeThread.members, dispatch],
  )

  const handleCameraPress = () => {
    launchCamera({
      cameraType: 'front',
      mediaType: 'mixed',
      videoQuality: 'medium',
      maxWidth: 1920,
      maxHeight: 1080,
      saveToPhotos: true,
    }).then(({ assets, errorCode, errorMessage }) => {
      console.log(assets?.length, errorCode, errorMessage)
    })
  }

  const handleGalleryPress = () => {
    launchImageLibrary({
      mediaType: 'mixed',
      videoQuality: 'medium',
      maxWidth: 1920,
      maxHeight: 1080,
      selectionLimit: 5,
    }).then(({ assets, didCancel }) => {
      if (assets && !didCancel) {
        assets.forEach(asset => {
          const file = new ReactNativeFile({
            name: asset.fileName,
            type: asset.type,
            uri: asset.uri as any,
          })
          setMedia(prevState => [...prevState, file])
        })
      } else {
        setMedia([])
      }
    })
  }

  const renderCarousel = () => {
    const handleCancel = () => setMedia([])
    const handleRemove = (index: number) => {
      setMedia(prevState => [...prevState.filter((_, i) => i !== index)])
    }
    const links = media.flatMap(value => (value?.uri ? value.uri : []))
    return (
      <React.Fragment>
        {links.length > 0 ? (
          <ImageCarousel
            data={links}
            onCancel={handleCancel}
            onItemRemove={handleRemove}
          />
        ) : null}
      </React.Fragment>
    )
  }

  return (
    <View style={[Layout.fullSize]}>
      <ConversationHeader
        name={name}
        icon={icon}
        onBackPress={navigation.goBack}
        onVideoCallPress={handleCreateOffer}
      />
      <Divider style={Gutters.smallBMargin} />
      <View style={Layout.fullSize}>{renderListMessage()}</View>
      <InputMemorized
        renderCarousel={() => (media.length > 0 ? renderCarousel() : undefined)}
        onSendPress={handleSendMessage}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
      />
    </View>
  )
}

export default ConversationScreen
