import React from 'react'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { BottomTabBar } from '@/Components'
import HomeNavigator from './HomeNavigator'
import SettingNavigator from './SettingNavigator'

const EXCLUDE_ROUTES: string[] = ['Conversation']

const TabBarVisibilityOptions = ({
  route,
}: any): BottomTabNavigationOptions => {
  const isNestedRoute: boolean = route.state?.index > 0
  const isExcludedRoute: boolean = EXCLUDE_ROUTES.includes(route.name)
  return !isNestedRoute && !isExcludedRoute
    ? {}
    : { tabBarStyle: { display: 'none' } }
}
const { Navigator, Screen } = createBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Screen
        name="Chat"
        component={HomeNavigator}
        options={TabBarVisibilityOptions}
      />
      <Screen
        name="Setting"
        component={SettingNavigator}
        options={TabBarVisibilityOptions}
      />
    </Navigator>
  )
}

export default BottomTabNavigator
