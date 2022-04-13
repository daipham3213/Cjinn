import { combineReducers } from 'redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import MMKVStorage from 'react-native-mmkv-storage'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import theme from './Theme'
import toastWatcher from '@/Store/errorSaga'
import { modals } from './ModalStore'
import { device, deviceStoreWatcher } from './DeviceStore'
import { interaction, messengerWatcher } from './InteractionStore'
import { meeting, callSignalingWatcher } from './MeetingStore'
import { all } from 'redux-saga/effects'
import { keyStoreWatcher } from '@/Store/SignalStore'
import { R_DEVICE_AUTH, R_TOKEN } from '@/Config'
import Toast from 'react-native-toast-message'

const sagaMiddleware = createSagaMiddleware({
  onError(error: Error, _) {
    Toast.show({
      type: 'error',
      text1: error.name,
      text2: error.message,
    })
  },
})

const reducers = combineReducers({
  theme,
  device,
  modals,
  interaction,
  meeting,
})

export const storageInstance = new MMKVStorage.Loader()
  .withInstanceID('cjin-redux')
  .initialize()

const persistConfig = {
  key: 'root',
  storage: storageInstance,
  whitelist: ['theme', 'device', 'interaction'],
}

export default function* rootSaga() {
  yield all([
    deviceStoreWatcher(),
    toastWatcher(),
    messengerWatcher(),
    keyStoreWatcher(),
    callSignalingWatcher(),
  ])
}
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'mutation/sendMessage',
        ],
      },
      thunk: false,
    }).concat(sagaMiddleware)
    // storageInstance.clearStore()
    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }
    return middlewares
  },
})

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

setupListeners(store.dispatch)

export const clearReduxStore = () => {
  const token = storageInstance.getString(R_TOKEN)
  const device_ = storageInstance.getMap(R_DEVICE_AUTH)
  storageInstance.clearStore()
  if (token && device_) {
    storageInstance.setString(R_TOKEN, token)
    storageInstance.setMap(R_DEVICE_AUTH, device_)
  }
}

export { store, persistor }
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export * from './ModalStore'
export * from './DeviceStore'
export * from './SignalStore'
export * from './InteractionStore'
