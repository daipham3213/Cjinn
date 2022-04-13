import React from 'react'
import {
  Layout as View,
  StyleService,
  useStyleSheet,
  Text,
  Avatar,
} from '@ui-kitten/components'
import { useTheme } from '@/Hooks'
import { Message } from '@/Store/SignalStore/type'
import { Maybe, MemberViewType } from '@/Services/types'
import EmojiText from './EmojiText'
import ImageGrid from './ImageGrid'
import { ImageViewerModal } from './Modals'

interface Props {
  message: Message
  owner: Maybe<MemberViewType> | undefined
  showAvatar: boolean
  showOther: boolean
}

const ChatMessage = ({ message, owner, showAvatar }: Props) => {
  const [name, setName] = React.useState<string>('unknown')
  const [position, setPosition] = React.useState<number>(0)
  const [isShow, setShow] = React.useState<boolean>(false)

  const isReceived = message?.extras?.status === 'received'
  const { Gutters, Images, Layout } = useTheme()
  const styles = useStyleSheet(styleSheet(isReceived))

  const handleToggleImageViewer = React.useCallback(
    (pos: number) => {
      setPosition(pos)
      setShow(!isShow)
    },
    [isShow],
  )

  const handleChangeShow = React.useCallback((value: boolean) => {
    setShow(value)
  }, [])

  React.useEffect(() => {
    if (owner && owner.info) {
      setName(`${owner.info.firstName} ${owner.info.lastName}`)
    }
  }, [owner])

  const renderModal = React.useCallback(() => {
    if (message.extras.media && message.extras.media.length > 0) {
      return (
        <ImageViewerModal
          setShow={handleChangeShow}
          isShow={isShow}
          data={message.extras.media}
          startPosition={position}
        />
      )
    }
  }, [isShow, message.extras.media, position])

  return (
    <View style={[isReceived ? Layout.row : Layout.rowReverse]}>
      {renderModal()}
      <View style={styles.container}>
        <View style={Layout.row}>
          <Avatar
            style={showAvatar && isReceived && Gutters.largeTMargin}
            size={'medium'}
            source={
              showAvatar && isReceived
                ? owner?.info?.avatar
                  ? { uri: owner.info.avatar }
                  : Images.logo
                : null
            }
          />
          <View style={{ maxWidth: '89%' }}>
            <View>
              {showAvatar && isReceived && (
                <Text appearance={'hint'} category={'s2'}>
                  {name}
                </Text>
              )}
            </View>
            <View style={styles.contents}>
              <View style={[styles.wrapper]}>
                <EmojiText appearance={isReceived ? 'default' : 'alternative'}>
                  {message.contents}
                </EmojiText>
              </View>
              {message.extras.media && message.extras.media.length > 0 && (
                <ImageGrid
                  style={{ marginTop: 10 }}
                  media={message.extras.media}
                  imagePerRow={message.extras.media.length > 1 ? 3 : 1}
                  onItemPress={handleToggleImageViewer}
                />
              )}
            </View>
            <View style={{ flexDirection: isReceived ? 'row' : 'row-reverse' }}>
              {message.extras.status === 'sending' && (
                <View
                  style={[
                    Gutters.regularRMargin,
                    Gutters.smallVMargin,
                    isReceived && Gutters.smallLMargin,
                  ]}
                >
                  <Text appearance={'hint'} category={'c2'}>
                    Sending
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
const styleSheet = (isReceived: boolean) =>
  StyleService.create({
    wrapper: {
      flexDirection: 'row-reverse',
      alignSelf: 'baseline',
      backgroundColor: isReceived ? 'color-basic-500' : 'color-primary-500',
    },
    container: {
      marginHorizontal: 10,
      ...(isReceived ? { paddingRight: '10%' } : { paddingLeft: '10%' }),
    },
    contents: {
      borderRadius: 10,
      padding: 10,
      backgroundColor: isReceived ? 'color-basic-500' : 'color-primary-500',
      flexDirection: 'column',
    },
  })
export default ChatMessage
