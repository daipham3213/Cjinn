import React from 'react'
import * as eva from '@eva-design/eva'
import { SafeAreaView, StatusBar } from 'react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { AuthNavigator, StartupContainer } from '@/Containers'
import {
  useAppDispatch,
  useAppSelector,
  useSignalStorage,
  useTheme,
  useToastConfig,
} from '@/Hooks'
import { navigationRef } from './utils'
import BottomTabNavigator from '@/Navigators/BottomTab'
import { RootState } from '@/Store'
import LoadingOverlay from '@/Components/Modals/LoadingOverlay'
import ConversationNavigator from '@/Navigators/ConversationNavigator'
import CallNavigator from '@/Navigators/CallNavigator'
import Notification from '@/Components/Notification'
import MainContextProvider from '@/Containers/MainContext'

const Stack = createStackNavigator()

// @refresh reset
const ApplicationNavigator = () => {
  const store = useSignalStorage()
  const dispatch = useAppDispatch()
  const { isAuth } = useAppSelector((state: RootState) => state.device)

  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme
  const toastConfig = useToastConfig()

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={darkMode ? eva.dark : eva.light}>
        <MainContextProvider>
          <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
            <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
              {isAuth && store ? (
                <Notification store={store} dispatch={dispatch} />
              ) : null}
              <StatusBar
                barStyle={darkMode ? 'light-content' : 'dark-content'}
              />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Startup" component={StartupContainer} />
                {isAuth ? (
                  <Stack.Group>
                    <Stack.Screen name="Main" component={BottomTabNavigator} />
                    <Stack.Screen
                      name="Conversation"
                      component={ConversationNavigator}
                    />
                    <Stack.Screen name="Call" component={CallNavigator} />
                  </Stack.Group>
                ) : (
                  <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
            <LoadingOverlay />
            <Toast topOffset={100} config={toastConfig} autoHide />
          </SafeAreaView>
        </MainContextProvider>
      </ApplicationProvider>
    </React.Fragment>
  )
}

export default ApplicationNavigator
