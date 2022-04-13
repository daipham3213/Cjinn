import React from 'react'
import {
  Button,
  Layout as View,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import {
  CameraIcon,
  CameraOffIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  SyncIcon,
} from '@/Components/Icons'
import { TouchableWithoutFeedback } from 'react-native'
import VideoStream from '@/Containers/CallContainer/components/VideoStream'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { CallNavigatorProps } from '@/Navigators/CallNavigator'
import { MainContext } from '@/Containers/MainContext'

export type InCallScreenProps = NativeStackScreenProps<
  CallNavigatorProps,
  'InCall'
>
const InCallScreen = ({}: InCallScreenProps) => {
  // <editor-fold desc="UI States">
  const [focus, setFocus] = React.useState<boolean>(false)
  const toggleFocus = () => setFocus(prevState => !prevState)
  const [name, setName] = React.useState('')
  const [username, setUsername] = React.useState('')
  // </editor-fold >
  const {
    localStream,
    remoteStream,
    onHangUp,
    onSwitchCamera,
    onToggleCamera,
    onToggleMic,
    isMuted,
    isOffCamera,
    meeting,
  } = React.useContext(MainContext)

  const styles = useStyleSheet(styleSheet)

  const handleHangup = () => {
    onHangUp()
  }

  const handleToggleMic = () => {
    onToggleMic()
  }

  const handleToggleCamera = () => {
    onToggleCamera()
  }

  React.useEffect(() => {
    setName(
      meeting?.type === 'in_coming'
        ? `${meeting.caller?.firstName} ${meeting.caller?.lastName}`
        : `${meeting?.callee?.firstName} ${meeting?.callee?.lastName}`,
    )
    setUsername(
      (meeting?.type === 'in_coming'
        ? meeting.caller?.username
        : meeting?.callee?.username) as any,
    )
  }, [meeting, localStream, remoteStream])

  return (
    <View style={[styles.container]}>
      {!focus && (
        <View style={[styles.info]}>
          <Text appearance={'default'}>{name}</Text>
          <Text appearance={'hint'}>@{username as any}</Text>
        </View>
      )}
      <TouchableWithoutFeedback onPress={toggleFocus}>
        <View style={styles.camera}>
          <VideoStream
            localStream={localStream as any}
            remoteStream={remoteStream as any}
          />
        </View>
      </TouchableWithoutFeedback>
      {!focus && (
        <View style={[styles.control]}>
          <Button
            style={styles.button}
            size={'giant'}
            onPress={onSwitchCamera}
            accessoryLeft={SyncIcon}
          />
          <Button
            style={styles.button}
            size={'giant'}
            status={!isOffCamera ? 'info' : 'control'}
            onPress={handleToggleCamera}
            accessoryLeft={style =>
              !isOffCamera ? CameraIcon(style) : CameraOffIcon(style)
            }
          />
          <Button
            style={styles.button}
            size={'giant'}
            status={!isMuted ? 'info' : 'control'}
            onPress={handleToggleMic}
            accessoryLeft={style =>
              !isMuted ? MicIcon(style) : MicOffIcon(style)
            }
          />
          <Button
            status={'danger'}
            style={styles.button}
            size={'giant'}
            onPress={handleHangup}
            accessoryLeft={PhoneOffIcon}
          />
        </View>
      )}
    </View>
  )
}

const styleSheet = StyleService.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  info: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'color-basic-transparent-200',
    padding: 10,
  },
  control: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'color-basic-transparent-200',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  camera: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})

export default InCallScreen
