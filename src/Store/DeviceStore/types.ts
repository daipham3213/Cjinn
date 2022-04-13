import {
  AccountMutationLoginArgs,
  MessengerMutationCreateDeviceTokenArgs,
  MessengerMutationVerifyDeviceTokenArgs,
} from '@/Services/types'
import {
  PreKeyType,
  SignedPublicPreKeyType,
} from '@privacyresearch/libsignal-protocol-typescript'

export interface SerializedKeyBundle {
  registrationId: number
  identityKey: string
  signedPreKey: SignedPublicPreKeyType<string>
  preKeys: PreKeyType<string>[]
}
export type RegisteringDeviceType = {
  args?: MessengerMutationCreateDeviceTokenArgs
}
export type ObtainTokenType = {
  args: AccountMutationLoginArgs
}

export type VerifyDeviceType = {
  args: MessengerMutationVerifyDeviceTokenArgs
}

export type AddKeyBundleType = {
  args: SerializedKeyBundle
}

export type UpdateDeviceType = {
  gcmId?: string
  apnId?: string
  voidApnId?: string
}
