import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AddConversationScreen, ConversationScreen } from '@/Containers'

export type ConversationParamsList = {
  AddConversation: {
    isEncrypt: boolean
  }
  InConversation: {
    threadId: string
  }
}
const Stack = createStackNavigator<ConversationParamsList>()

const ConversationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'AddConversation'}
    >
      <Stack.Screen
        name={'AddConversation'}
        component={AddConversationScreen}
      />
      <Stack.Screen name={'InConversation'} component={ConversationScreen} />
    </Stack.Navigator>
  )
}
export default ConversationNavigator
