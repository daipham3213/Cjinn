import 'react-native-gesture-handler'
import './Translations'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ApplicationNavigator from '@/Navigators/Application'
import { ActivityIndicator, LogBox } from 'react-native'
import { persistor, store } from '@/Store'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/Services/api'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
LogBox.ignoreLogs(['EventEmitter.removeListener', 'new NativeEventEmitter()'])

const App = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate
          loading={<ActivityIndicator size={'large'} />}
          persistor={persistor}
        >
          <ApplicationNavigator />
        </PersistGate>
      </ApolloProvider>
    </Provider>
  )
}

export default App
