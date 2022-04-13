import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { checkingKeyStoreAction, RootState } from '@/Store'
import { Layout as UILayout } from '@ui-kitten/components'
import {
  ContactsScreen,
  ConversationListScreen,
  FindContactScreen,
  UserInfoScreen,
} from '@/Containers/HomeContainer'

export type MainStackParamList = {
  ConversationList: undefined
  FindContact: undefined
  UserInfo: { id?: string }
  ContactsScreen: undefined
}

const Stack = createStackNavigator<MainStackParamList>()
export default () => {
  const { Layout } = useTheme()

  return (
    <UILayout style={[Layout.fill, Layout.fullWidth]}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={'ConversationList'}
      >
        <Stack.Screen
          name={'ConversationList'}
          component={ConversationListScreen}
        />
        <Stack.Screen name={'FindContact'} component={FindContactScreen} />
        <Stack.Screen
          name={'UserInfo'}
          component={UserInfoScreen}
          initialParams={{ id: undefined }}
        />
        <Stack.Screen name={'ContactsScreen'} component={ContactsScreen} />
      </Stack.Navigator>
    </UILayout>
  )
}
