import { createAction } from '@reduxjs/toolkit'
import {
  AddKeyBundleType,
  ObtainTokenType,
  RegisteringDeviceType,
  VerifyDeviceType,
} from './types'
import {
  AccountMutationChangePasswordArgs,
  AccountMutationRegisterArgs,
  AccountMutationResendOtpArgs,
  AccountMutationValidOtpArgs,
  MessengerMutationUpdateUserInfoArgs,
} from '@/Services/types'

const initialActions = createAction('initial')
const obtainTokenAction = createAction<ObtainTokenType>('mutation/obtainToken')

const registerDeviceAction = createAction<RegisteringDeviceType>(
  'mutation/registeringDevice',
)

const accountRegistrationAction = createAction<AccountMutationRegisterArgs>(
  'mutation/accountRegistration',
)

const accountVerificationAction = createAction<AccountMutationValidOtpArgs>(
  'mutation/accountVerification',
)

const changePasswordAction = createAction<AccountMutationChangePasswordArgs>(
  'mutation/changePassword',
)

const resendOtpAction =
  createAction<AccountMutationResendOtpArgs>('mutation/resendOtp')

const verifyDeviceAction = createAction<VerifyDeviceType>(
  'mutation/verifyDevice',
)

const addKeyBundlesAction = createAction<AddKeyBundleType>(
  'mutation/addKeyBundles',
)

const updateDeviceInfoAction = createAction<string>('mutation/updateDeviceInfo')

const whoAmIAction = createAction('query/whoAmI')
const updateUserInfoAction = createAction<MessengerMutationUpdateUserInfoArgs>(
  'mutation/updateUserInfo',
)

const deviceActions = {
  obtainTokenAction,
  registerDeviceAction,
  verifyDeviceAction,
  addKeyBundlesAction,
  updateDeviceInfoAction,
  whoAmIAction,
  updateUserInfoAction,
  changePasswordAction,
  accountRegistrationAction,
  accountVerificationAction,
  resendOtpAction,
  initialActions,
}

export default deviceActions
