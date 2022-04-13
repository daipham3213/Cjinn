import React from 'react'
import { BackHandler, View } from 'react-native'
import { Text } from '@ui-kitten/components'
import { useAuthContext } from '@/Containers/AuthContainer/AuthContext'

const ForgotPasswordScreen = () => {
  const { state, goBack } = useAuthContext()

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      if (state !== 'login') {
        goBack()
        return true
      }
      return false
    })
  })
  return (
    <View>
      <Text>This is Forgot password screen</Text>
    </View>
  )
}

export default ForgotPasswordScreen
