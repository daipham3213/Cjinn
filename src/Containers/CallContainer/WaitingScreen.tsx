import React, { useContext } from 'react'
import {
  Button,
  Layout as View,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import { DenyIcon, PhoneIcon } from '@/Components'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { CallNavigatorProps } from '@/Navigators/CallNavigator'
import RNCallKeep from 'react-native-callkeep'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { MainContext } from '@/Containers/MainContext'
import { ImageBackground, Vibration } from 'react-native'

export type InCallScreenProps = NativeStackScreenProps<
  CallNavigatorProps,
  'Waiting'
>

const WaitingScreen = ({ navigation, route }: InCallScreenProps) => {
  const styles = useStyleSheet(styleSheet)
  const { username, localizedName, meetingId } = route.params

  React.useEffect(() => {
    Vibration.vibrate([400, 200, 100, 100], true)
  }, [])
  const { joinMeeting, onHangUp } = useContext(MainContext)

  const handleDeny = () => {
    onHangUp()
    Vibration.cancel()
    RNCallKeep.rejectCall(meetingId)
    navigateAndSimpleReset('Main')
  }

  const handleAccept = async () => {
    // do something first
    Vibration.cancel()
    RNCallKeep.answerIncomingCall(meetingId)
    await joinMeeting(meetingId)
    // navigate to video screen
    // navigation.navigate('InCall', { meetingId })
  }

  React.useEffect(() => {
    return () => Vibration.cancel()
  }, [])

  const background = require('@/Assets/Images/background.jpg')

  return (
    <ImageBackground source={background} style={styles.container}>
      <View style={styles.info}>
        <Text category={'h6'}>
          In coming call from {localizedName ?? 'stranger'}
        </Text>
        <Text category={'s1'} appearance={'hint'}>
          @{username}
        </Text>
      </View>
      <View style={styles.controls}>
        <Button
          style={styles.button}
          status={'danger'}
          size={'giant'}
          onPress={handleDeny}
          accessoryLeft={DenyIcon}
        />
        <Button
          style={styles.button}
          status={'success'}
          size={'giant'}
          onPress={handleAccept}
          accessoryLeft={PhoneIcon}
        />
      </View>
    </ImageBackground>
  )
}

const styleSheet = StyleService.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  info: {
    backgroundColor: 'color-basic-transparent-200',
    alignItems: 'center',

    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    backgroundColor: 'color-basic-transparent-200',
    padding: 20,
    width: '100%',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
})
export default WaitingScreen
