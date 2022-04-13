import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SettingMenuScreen } from '@/Containers/SettingContainer'

export type SettingParamList = {
  SettingMenu: undefined
}

const Stack = createStackNavigator<SettingParamList>()

const SettingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'SettingMenu'}
    >
      <Stack.Screen name={'SettingMenu'} component={SettingMenuScreen} />
    </Stack.Navigator>
  )
}

export default SettingNavigator
