import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { InCallScreen, WaitingScreen } from '@/Containers/CallContainer'

export type CallNavigatorProps = {
  InCall: { meetingId: string }
  Waiting: { meetingId: string; localizedName?: string; username: string }
}
const Stack = createStackNavigator<CallNavigatorProps>()
const CallNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'InCall'} component={InCallScreen} />
      <Stack.Screen name={'Waiting'} component={WaitingScreen} />
    </Stack.Navigator>
  )
}

export default CallNavigator
