import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import {
  ADD_KEY_BUNDLE,
  CHANGE_PASSWORD,
  GET_CURRENT_DEVICE,
  ME,
  OBTAIN_TOKEN,
  RE_SEND_OTP,
  REG_DEVICE,
  REGISTER,
  UPDATE_DEVICE_INFO,
  UPDATE_USER_INFO,
  VALID_OTP,
  VERIFY_DEVICE,
} from '@/Services/operations'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  AddKeyBundleType,
  ObtainTokenType,
  UpdateDeviceType,
  VerifyDeviceType,
} from './types'
import { showInfoAction, showMutationErrorAction } from '../errorSaga'
import { AppStorage } from '@/Hooks'
import { FCM_TOKEN, R_DEVICE_AUTH, R_TOKEN } from '@/Config'
import { DeviceRecord } from './deviceRecord'
import { modalActions } from '@/Store/ModalStore'
import {
  AccountMutation,
  AccountMutationChangePasswordArgs,
  AccountMutationRegisterArgs,
  AccountMutationResendOtpArgs,
  AccountMutationValidOtpArgs,
  DeviceAuthProps,
  MessengerMutation,
  MessengerMutationUpdateUserInfoArgs,
  MessengerQuery,
  Mutation,
  UserProps,
  UserQuery,
} from '@/Services/types'
import { EnhancedStore } from '@/Store/SignalStore'
import { KeyHelper } from '@privacyresearch/libsignal-protocol-typescript'
import { deviceSliceActions } from './slice'
import deviceActions from './actions'
import { RootState } from '@/Store'
import { ApolloClient } from '@/Services/api'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'

const {
  obtainTokenAction,
  registerDeviceAction,
  verifyDeviceAction,
  addKeyBundlesAction,
  updateDeviceInfoAction,
  whoAmIAction,
  updateUserInfoAction,
  accountRegistrationAction,
  accountVerificationAction,
  resendOtpAction,
  initialActions,
  changePasswordAction,
} = deviceActions

function* obtainToken(props: PayloadAction<ObtainTokenType>) {
  yield put(deviceSliceActions.toggleLoading())
  const response: Mutation['account'] = yield call(
    ApolloClient.mutate,
    'account',
    OBTAIN_TOKEN,
    props.payload.args,
  )
  if (response?.login) {
    const { result, success, errors } = response.login
    yield put(deviceSliceActions.toggleLoading())
    if (success) {
      yield put(deviceSliceActions.loadRecord({ userId: result.id }))
      yield put(deviceSliceActions.changeUserData(result))
      AppStorage.saveItem(R_TOKEN, result.token)
      const root: RootState = yield select()
      if (!root.device.isAuth) {
        yield put(deviceSliceActions.toggleRegistering())
        yield put(registerDeviceAction({}))
      } else {
      }
    } else {
      yield put(showMutationErrorAction({ errors: errors }))
    }
  }
}

function* registeringDevice(_: PayloadAction) {
  const registrationId = KeyHelper.generateRegistrationId()
  yield put(deviceSliceActions.toggleLoading())
  const response: Mutation['messenger'] = yield call(
    ApolloClient.mutate,
    'messenger',
    REG_DEVICE,
    { registrationId: registrationId },
  )
  if (response?.createDeviceToken) {
    yield put(deviceSliceActions.toggleLoading())
    const { errors, success } = response.createDeviceToken
    if (success) {
      const { device }: RootState = yield select()
      if (device.userData) {
        yield put(
          modalActions.toggleVerifyDevice({
            data: { registrationId },
          }),
        )
      }
    } else {
      yield put(showMutationErrorAction({ errors: errors }))
      yield put(deviceSliceActions.toggleRegistering())
    }
  }
}

function* verifyDevice(props: PayloadAction<VerifyDeviceType>) {
  yield put(deviceSliceActions.toggleLoading())
  const { payload } = props
  const response: Mutation['messenger'] = yield call(
    ApolloClient.mutate,
    'messenger',
    VERIFY_DEVICE,
    payload.args,
  )
  if (response?.verifyDeviceToken) {
    const { result, errors, success } = response.verifyDeviceToken
    if (success) {
      yield all([
        put(deviceSliceActions.toggleRegistering()),
        put(deviceSliceActions.toggleLoading()),
      ])

      AppStorage.saveObject(R_DEVICE_AUTH, result)
      // Add new record
      const state: RootState = yield select()
      const { device } = state
      if (device.userData) {
        const auth: DeviceAuthProps = {
          deviceId: result.deviceId,
          deviceToken: result.deviceToken,
          registrationId: parseInt(result.registrationId, 10),
        }
        const record = new DeviceRecord(auth, device.userData)
        yield call(DeviceRecord.saveRecord, record)
        const store = new EnhancedStore({
          username: device.userData.username,
          deviceId: result.deviceId,
        })
        store.storeRegistrationId(result.registrationId)
        yield all([
          put(deviceSliceActions.loadRecord({ userId: device.userData.id })),
          put(modalActions.toggleVerifyDevice()),
        ])
      }
    } else {
      yield put(showMutationErrorAction({ errors: errors }))
    }
  }
}

function* addKeyBundle(action: PayloadAction<AddKeyBundleType>) {
  // Registering data with the server
  const { args } = action.payload
  yield put(deviceSliceActions.toggleLoading())
  const response: Mutation['messenger'] = yield call(
    ApolloClient.mutate,
    'messenger',
    ADD_KEY_BUNDLE,
    args,
  )
  yield put(deviceSliceActions.toggleLoading())
  if (response?.addKeyBundles) {
    const { errors, success, result } = response.addKeyBundles
    const { device }: RootState = yield select()
    if (success && device.activeRecord?.user) {
      yield all([
        put(showInfoAction({ type: 'success', result })),
        put(
          deviceSliceActions.loadRecord({
            userId: device.activeRecord.user.id,
          }),
        ),
      ])
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* updateDeviceInfo({ payload }: PayloadAction<string>) {
  const platform = Platform.OS
  const args: UpdateDeviceType = {
    ...(platform === 'android'
      ? { gcmId: payload }
      : platform === 'ios'
      ? { apnId: payload }
      : { voidApnId: payload }),
  }
  const response: Mutation['messenger'] = yield call(
    ApolloClient.mutate,
    'messenger',
    UPDATE_DEVICE_INFO,
    args,
  )

  if (response?.updateDeviceInfo) {
    const { errors, success } = response.updateDeviceInfo
    if (success) {
      AppStorage.saveItem(FCM_TOKEN, payload)
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* whoAmI(_: PayloadAction) {
  const response: UserQuery = yield call(
    ApolloClient.query,
    'user',
    ME,
    undefined,
  )
  if (response.me) {
    const {
      id,
      avatar,
      firstName,
      lastName,
      email,
      phone,
      language,
      username,
    } = response.me
    const record = DeviceRecord.loadRecord(id)
    const others = record?.user.others ?? {}
    const isFirstLogin = record?.user.isFirstLogin ?? false
    const lastLogin = record?.user.lastLogin ?? new Date()
    const token = record?.user.token ?? ''
    // Mapping to UserProps
    if (record) {
      const data: UserProps = {
        id,
        username,
        firstName,
        lastName,
        email: email as any,
        phone,
        language: language ?? 'en',
        others,
        avatar,
        lastLogin,
        isFirstLogin,
        token,
      }
      yield put(deviceSliceActions.changeUserData(data))
    }
  }
}

function* updateUserInfo({
  payload,
}: PayloadAction<MessengerMutationUpdateUserInfoArgs>) {
  const response: MessengerMutation = yield call(
    ApolloClient.mutate,
    'messenger',
    UPDATE_USER_INFO,
    payload,
  )
  if (response.updateUserInfo) {
    const { success, errors } = response.updateUserInfo
    if (success) {
      yield put(whoAmIAction())
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* registration({
  payload,
}: PayloadAction<AccountMutationRegisterArgs>) {
  const response: AccountMutation = yield call(
    ApolloClient.mutate,
    'account',
    REGISTER,
    payload,
  )
  if (response.register) {
    const { result, errors, success } = response.register
    if (success) {
      navigate('Auth', { state: 'verify', tokenId: result.verifyId })
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* verifyAccount({
  payload,
}: PayloadAction<AccountMutationValidOtpArgs>) {
  const response: AccountMutation = yield call(
    ApolloClient.mutate,
    'account',
    VALID_OTP,
    payload,
  )
  if (response.validOTP) {
    const { errors, success, result } = response.validOTP
    if (success) {
      yield put(
        showInfoAction({ type: 'success', result: 'Verification success' }),
      )
      yield put(deviceSliceActions.changeUserData(result))
      AppStorage.saveItem(R_TOKEN, result.token)

      yield put(
        modalActions.toggleChangePassword({
          data: { currentPassword: payload.otp as string },
        }),
      )
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* changePassword({
  payload,
}: PayloadAction<AccountMutationChangePasswordArgs>) {
  const response: AccountMutation = yield call(
    ApolloClient.mutate,
    'account',
    CHANGE_PASSWORD,
    payload,
  )
  if (response.changePassword) {
    const { success, errors } = response.changePassword
    if (success) {
      yield put(modalActions.toggleChangePassword({ data: {} }))
      // password length < 7 which means user is registering
      if (payload.passwordOld.length < 7) {
        yield put(deviceSliceActions.toggleRegistering())
        yield put(registerDeviceAction({}))
      }
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* resendOtp({ payload }: PayloadAction<AccountMutationResendOtpArgs>) {
  const response: AccountMutation = yield call(
    ApolloClient.mutate,
    'account',
    RE_SEND_OTP,
    payload,
  )
  if (response.resendOTP) {
    const { result, errors, success } = response.resendOTP
    if (success) {
      navigate('Auth', { state: 'verify', tokenId: result.verifyId })
    } else {
      yield put(showMutationErrorAction({ errors }))
    }
  }
}

function* initial(_: PayloadAction) {
  yield put(deviceSliceActions.changeLoadingState('checkFcm'))
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_CURRENT_DEVICE,
    undefined,
  )
  if (response.getCurrentDevice) {
    const { apnId, gcmId } = response.getCurrentDevice

    async function getFcmToken() {
      return await messaging().getToken()
    }
    let newToken: string = yield call(getFcmToken)
    let token = Platform.OS === 'android' ? gcmId : apnId
    if (token !== newToken) {
      yield put(updateDeviceInfoAction(newToken))
    }
    // }
    // yield put(deviceSliceActions.changeLoadingState('checkKeyStore'))
    // const { device }: RootState = yield select()
    // const { activeRecord } = device
    // if (activeRecord) {
    //   const { auth, user } = activeRecord
    //   yield put(
    //     checkingKeyStoreAction({
    //       username: user.username,
    //       deviceId: auth.deviceId,
    //     }),
    //   )
    // }
    navigateAndSimpleReset('Main')
    yield put(deviceSliceActions.changeLoadingState('welcome'))
  }
}

function* obtainTokenWatcher() {
  yield takeLatest(obtainTokenAction.type, obtainToken)
  yield takeLatest(registerDeviceAction.type, registeringDevice)
  yield takeLatest(verifyDeviceAction.type, verifyDevice)
}

export default function* deviceStoreWatcher() {
  yield all([
    fork(obtainTokenWatcher),
    takeLatest(addKeyBundlesAction.type, addKeyBundle),
    takeLatest(updateDeviceInfoAction.type, updateDeviceInfo),
    takeLatest(updateUserInfoAction.type, updateUserInfo),
    takeLatest(whoAmIAction.type, whoAmI),
    takeLatest(changePasswordAction.type, changePassword),
    takeLatest(accountVerificationAction.type, verifyAccount),
    takeLatest(accountRegistrationAction.type, registration),
    takeLatest(resendOtpAction.type, resendOtp),
    takeLatest(initialActions.type, initial),
  ])
}
