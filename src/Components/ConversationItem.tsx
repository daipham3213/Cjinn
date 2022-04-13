import React from 'react'
import { TouchableOpacity, Animated } from 'react-native'
import {
  default as Reanimated,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import {
  useAppDispatch,
  useAppSelector,
  useSignalStorage,
  useTheme,
} from '@/Hooks'
import {
  Avatar,
  Button,
  Divider,
  Layout as View,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import moment from 'moment'
import { ThreadTypeConnectionsEdge } from '@/Services/types'
import { addThreadLocalAction, RootState } from '@/Store'
import { Thread } from '@/Store/SignalStore/type'
import { Swipeable } from 'react-native-gesture-handler'
import { TrashCanIcon } from '@/Components/Icons'
import { getIconUrl, getName } from '@/Services/utils'

interface Props {
  onPress: () => void
  onDelete: (id: string) => void
  thread: ThreadTypeConnectionsEdge
}

const ConversationItem = ({ thread, onPress, onDelete }: Props) => {
  const dispatch = useAppDispatch()
  const { activeRecord } = useAppSelector((state: RootState) => state.device)
  const store = useSignalStorage()

  const [name, setName] = React.useState<string>('')
  const [lastMsg, setLastMsg] = React.useState<string>('')
  const [count, setCount] = React.useState<string>('')
  const [icon, setIcon] = React.useState<string | undefined>()
  const [local, setLocal] = React.useState<Thread>()
  const { Fonts, Gutters, Layout, Images } = useTheme()
  // <editor-fold desc="Get name and icon of thread">
  React.useEffect(() => {
    const getLocalThread = () => {
      if (activeRecord && thread.node && store) {
        const { user } = activeRecord
        const { pk, members, isEncrypted } = thread.node
        const t = store.messages.getThreadById(pk)
        if (!t && members) {
          const lst = members
            .filter(value => value?.info?.username !== user.username)
            .flatMap(value => (value?.info ? value.info.pk : []))
          lst.length > 0 &&
            dispatch(
              addThreadLocalAction({
                threadId: pk,
                isEncrypted: isEncrypted,
                members: lst,
                navigate: false,
              }),
            )
        }
        setLocal(t)
      }
    }
    setName(getName(thread.node, activeRecord))
    setIcon(getIconUrl(thread.node, activeRecord))
    getLocalThread()
  }, [activeRecord, dispatch, store, thread])
  // </editor-fold>

  React.useEffect(() => {
    const lastMessage = () => {
      if (local?.lastMessage && thread.node?.members) {
        const { createdBy, contents } = local.lastMessage
        const { members } = thread.node
        if (members && members.length > 0) {
          const member = members.find(value => value?.pk === createdBy)
          if (member?.info?.pk === activeRecord?.user.id) {
            return `@you: ${contents}`
          }
          if (member?.info) {
            return `@${member.info.username}: ${contents}`
          }
        }
        return contents
      }
      return ''
    }
    const newMsgCount = (): string => {
      if (local?.newMessageCount) {
        return local.newMessageCount > 9 ? '9+' : `${local.newMessageCount}`
      }
      return ''
    }
    setLastMsg(lastMessage())
    setCount(newMsgCount())
  }, [local?.lastMessage, thread.node])

  const renderSwipeDelete = (
    progress: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
    return (
      <View style={[Layout.center]}>
        <Text category={'s2'} status={'danger'}>
          Are you sure?
        </Text>
        <Animated.View style={[{ opacity }, Gutters.smallTMargin]}>
          <Button
            accessoryLeft={TrashCanIcon}
            status={'danger'}
            appearance={'filled'}
            onPress={() => onDelete(thread.node?.pk)}
          />
        </Animated.View>
      </View>
    )
  }
  return (
    <Swipeable renderRightActions={renderSwipeDelete}>
      <TouchableOpacity onPress={() => onPress()} style={[Layout.center]}>
        <View
          style={[
            Gutters.smallVPadding,
            Layout.row,
            Layout.fullWidth,
            { height: 80 },
          ]}
        >
          <View style={{ width: '14%' }}>
            <Avatar
              shape={'rounded'}
              source={icon ? { uri: icon } : Images.logo}
            />
            {thread.node?.isEncrypted && <Text>Encrypt</Text>}
          </View>
          <View style={[Gutters.smallHPadding, { width: '76%' }]}>
            <Text numberOfLines={1} style={Fonts.titleSmaller}>
              {name}
            </Text>
            <Text numberOfLines={1} style={Fonts.textSmaller}>
              {lastMsg}
            </Text>
            <Text style={[Fonts.textSmaller, Fonts.textRight]}>
              {moment(
                local?.lastMessage?.timeStamp ?? thread.node?.dateCreated,
              ).fromNow()}
            </Text>
          </View>
          {local?.newMessageCount && (
            <NewMessageCount count={local?.newMessageCount} />
          )}
        </View>
        <Divider />
      </TouchableOpacity>
    </Swipeable>
  )
}

const NewMessageCount = ({ count }: any) => {
  const ANGLE: number = 25
  const styles = useStyleSheet(styleSheet)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      rotation: withSequence(
        withTiming(-10, { duration: 50 }),
        withRepeat(withTiming(ANGLE, { duration: 100 }), 6, true),
        withTiming(0, { duration: 50 }),
      ),
    }
  })

  return (
    <Reanimated.View style={[styles.counter, animatedStyle]}>
      <Text
        adjustsFontSizeToFit={true}
        ellipsizeMode={'tail'}
        category={'c1'}
        appearance={'alternative'}
      >
        {count}
      </Text>
    </Reanimated.View>
  )
}

const styleSheet = StyleService.create({
  counter: {
    backgroundColor: 'color-danger-500',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
})

export default ConversationItem
