import React, { useContext } from 'react'
import moment from 'moment'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import {
  List,
  StyleService,
  Text,
  useStyleSheet,
  Layout as View,
} from '@ui-kitten/components'
import { Message } from '@/Store/SignalStore/type'
import { useSignalStorage, useTheme } from '@/Hooks'
import ChatMessage from '@/Components/ChatMessage'
import { ThreadType } from '@/Services/types'
import { Swipeable } from 'react-native-gesture-handler'
import { MainContext } from '@/Containers/MainContext'
interface Props {
  thread: ThreadType
  onMessageSwipe?: (id: string) => void
}

export default ({ thread }: Props) => {
  const store = useSignalStorage()
  const { Layout, Gutters } = useTheme()

  const styles = useStyleSheet(styleSheet)
  const { received, delivered } = useContext(MainContext)

  const [messages, setMessages] = React.useState<Message[]>([])
  const [cursor, setCursor] = React.useState<string | undefined>()
  const [selected, setSelected] = React.useState<string>()

  // function checkDifference(start: Message, end: Message): boolean {
  //   // return true if sender is difference
  //   if (start.createdBy !== end.createdBy) {
  //     return true
  //   }
  //   const startTime = moment(start.timeStamp)
  //   const endTime = moment(end.timeStamp)
  //   const duration = moment.duration(endTime.diff(startTime)).asMinutes()
  //   console.log(duration)
  //   return duration > 10
  // }

  const handlePressMsg = React.useCallback((pk: string) => {
    setSelected(prevState => (prevState !== pk ? pk : undefined))
  }, [])

  const handleLoadMore = React.useCallback(() => {
    if (store) {
      store.messages.messageKeys(thread.pk).then(value => {
        console.log('mgs', value.length)
        if (value.length > messages.length) {
          setCursor(messages[messages.length - 1].id)
          console.log('cursor changed', messages[messages.length - 1].id)
        }
      })
    }
  }, [messages, thread.pk])

  React.useEffect(() => {
    async function loadMsg() {
      if (store) {
        const value = await store.messages.getThreadMessages(
          thread.pk,
          20,
          cursor,
        )
        setMessages(prevState => {
          const arr = [...new Set(prevState.concat(value))]
          return [...new Map(arr.map(item => [item.id, item])).values()]
        })
      }
    }
    loadMsg()
  }, [cursor, thread, delivered, store])

  React.useEffect(() => {
    if (received.length > 0) {
      received.forEach(item => {
        const index = messages.findIndex(value => value.id === item.id)
        const mapped: Message = {
          ...item,
          extras: {
            status: !item.isSync ? 'received' : 'delivered',
            media: item.media,
          },
          timeStamp: item.timestamp,
        }
        item.threadId === thread.pk && index < 0
          ? setMessages(prevState => [mapped, ...prevState])
          : setMessages(prevState => {
              prevState[index] = mapped
              return prevState
            })
      })
    }
  }, [messages, received, thread])

  const renderChatMessage = (props: Message, index: number) => {
    // TODO: Reply message component
    if (thread.members) {
      const owner = thread.members.find(
        member => member && member.pk === props.createdBy,
      )
      const showAvatar =
        index === messages.length - 1 ||
        (index < messages.length - 1 &&
          props.createdBy !== messages[index + 1].createdBy)
      const showOther = selected === props.id
      return (
        <TouchableOpacity
          style={[styles.item, showAvatar && Gutters.smallTMargin]}
          onPress={() => handlePressMsg(props.id)}
        >
          {showOther && (
            <View style={[Layout.center, Gutters.smallVMargin]}>
              <Text appearance={'hint'} category={'c2'}>
                {moment(props.timeStamp).fromNow()}
              </Text>
            </View>
          )}
          <ChatMessage
            message={props}
            owner={owner}
            showAvatar={showAvatar}
            showOther={showOther}
          />
        </TouchableOpacity>
      )
    }
    return <React.Fragment />
  }

  const renderListMessage = () => (
    <KeyboardAvoidingView>
      <List
        contentContainerStyle={styles.list}
        data={messages}
        extraData={cursor}
        inverted={true}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => renderChatMessage(item, index)}
        onEndReached={handleLoadMore}
      />
    </KeyboardAvoidingView>
  )
  return { renderListMessage, setMessages }
}
const styleSheet = StyleService.create({
  list: {
    paddingTop: 150,
    backgroundColor: 'background-basic-color-1',
    width: '100%',
  },
  item: {
    width: '100%',
    marginBottom: 10,
  },
})
