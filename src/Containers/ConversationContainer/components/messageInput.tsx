import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import {
  Button,
  Input,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import { Layout as View } from '@ui-kitten/components'
import { CameraIcon, ImageIcon, PaperPlaneIcon } from '@/Components'

interface InputProps {
  onSendPress: (input: string | undefined) => void
  onCameraPress: () => void
  onGalleryPress: () => void
  renderCarousel: () => React.ReactElement | undefined | null
}

const MessageInput = ({
  onSendPress,
  onCameraPress,
  onGalleryPress,
  renderCarousel,
}: InputProps) => {
  const { t } = useTranslation()
  const { Layout } = useTheme()
  const styles = useStyleSheet(styleSheet)

  const [input, setInput] = React.useState<string | undefined>()

  const handleChangeInput = React.useCallback(
    (value?: string) => setInput(value),
    [],
  )

  return (
    <View style={[styles.inputWrapper]}>
      {renderCarousel && renderCarousel() ? (
        <View style={styles.carousel}>{renderCarousel()}</View>
      ) : null}
      <View style={[Layout.rowCenter]}>
        <Button
          appearance={'ghost'}
          size={'small'}
          accessoryLeft={CameraIcon}
          onPress={onCameraPress}
        />
        <Button
          appearance={'ghost'}
          size={'small'}
          accessoryLeft={ImageIcon}
          onPress={onGalleryPress}
        />
        <Input
          style={Layout.fill}
          value={input}
          onChangeText={handleChangeInput}
          multiline={true}
          placeholder={t('conversations.placeholder')}
        />
        <Button
          appearance={'ghost'}
          accessoryLeft={PaperPlaneIcon}
          onPress={() => {
            let value = input
            handleChangeInput(undefined)
            onSendPress(value)
          }}
        />
      </View>
    </View>
  )
}
const styleSheet = StyleService.create({
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    width: '100%',
  },
  carousel: {
    padding: 10,
  },
})

export default MessageInput
