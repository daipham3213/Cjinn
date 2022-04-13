import {
  Direction,
  PreKeyType,
  SessionRecordType,
  SignedPublicPreKeyType,
  StorageType,
  KeyPairType as KPType,
  SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import {
  arrayBufferToString,
  base64ToArrayBuffer,
} from '@/Store/SignalStore/utils'
import { SignalStorage } from '@/Store/SignalStore/SignalStorage'
import { SIGNAL_CONST } from '@/Store/SignalStore/consts'
import { MessageStore } from '@/Store/SignalStore/MessageStore'

interface KeyPairType {
  pubKey: ArrayBuffer
  privKey: ArrayBuffer
}

export interface FullDirectoryEntry {
  registrationId: number
  identityPubKey: ArrayBuffer
  signedPreKey: SignedPublicPreKeyType
  preKeys: PreKeyType[]
}

interface SignedPreKeyType extends PreKeyType<number> {
  signature: ArrayBuffer
}

type StoreValue =
  | KeyPairType
  | string
  | number
  | PreKeyType
  | SignedPreKeyType
  | ArrayBuffer
  | undefined

interface Address {
  address: string
  username?: never
  deviceId?: never
}

interface Prefix {
  address?: never
  username: string
  deviceId: string
}

interface PreKeyStoreType {
  keyId: number
  keyPair: KeyPairType
}

export class EnhancedStore implements StorageType {
  private readonly store: SignalStorage
  public messages: MessageStore

  constructor(props: Address | Prefix) {
    this.store = new SignalStorage(props)
    this.messages = new MessageStore(this.store)
  }
  private static serializeKeyPair(keyPair: KeyPairType): KPType<string> {
    return {
      pubKey: arrayBufferToString(keyPair.pubKey),
      privKey: arrayBufferToString(keyPair.privKey),
    }
  }
  private static deSerializeKeyPair(keyPair: KPType<string>): KeyPairType {
    return {
      pubKey: base64ToArrayBuffer(keyPair.pubKey),
      privKey: base64ToArrayBuffer(keyPair.privKey),
    }
  }

  async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
    return new Promise<KeyPairType | undefined>(resolve => {
      const result = this.store.getObject<KPType<string>>(
        SIGNAL_CONST.identifyKey_me,
      )
      return resolve(result && EnhancedStore.deSerializeKeyPair(result))
    })
  }

  storeIdentityKeyPair(keyPair: KeyPairType) {
    return this.store.setObject<KPType<string>>(
      SIGNAL_CONST.identifyKey_me,
      EnhancedStore.serializeKeyPair(keyPair),
    )
  }

  async getLocalRegistrationId(): Promise<number | undefined> {
    return new Promise<number | undefined>(resolve => {
      const result = this.store.getValue<number>(SIGNAL_CONST.registrationId)
      return resolve(result)
    })
  }

  storeRegistrationId(registrationId: string) {
    return this.store.setValue(SIGNAL_CONST.registrationId, registrationId)
  }

  async isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    _direction: Direction,
  ): Promise<boolean> {
    const trusted = this.store.getValue<string>(
      SIGNAL_CONST.identityKey + identifier,
    )
    if (!trusted) {
      return Promise.resolve(true)
    }
    return Promise.resolve(arrayBufferToString(identityKey) === trusted)
  }

  async loadPreKey(keyId: string | number): Promise<KeyPairType | undefined> {
    return new Promise<KeyPairType | undefined>((resolve, reject) => {
      const result = this.store.getObject<KPType<string>>(
        SIGNAL_CONST.preKey + keyId,
      )
      return result
        ? resolve(EnhancedStore.deSerializeKeyPair(result))
        : reject('No pre key found')
    })
  }

  async loadSession(
    identifier: string,
  ): Promise<SessionRecordType | undefined> {
    return new Promise<SessionRecordType | undefined>((resolve, reject) => {
      let result: SessionRecordType | undefined | null
      result = this.store.getValue<SessionRecordType>(
        SIGNAL_CONST.session + identifier,
      )
      return result ? resolve(result) : reject('No session found')
    })
  }

  async loadSignedPreKey(
    keyId: number | string,
  ): Promise<KeyPairType | undefined> {
    return new Promise<KeyPairType | undefined>(resolve => {
      const result = this.store.getObject<KPType<string>>(
        SIGNAL_CONST.signedKey + keyId,
      )
      return resolve(result && EnhancedStore.deSerializeKeyPair(result))
    })
  }

  async removePreKey(keyId: number | string): Promise<void> {
    return new Promise(resolve => {
      this.store.removeObject(SIGNAL_CONST.preKey + keyId)
      return resolve()
    })
  }

  async removeSignedPreKey(keyId: number | string): Promise<void> {
    return new Promise(resolve => {
      this.store.removeObject(SIGNAL_CONST.signedKey + keyId)
      return resolve()
    })
  }

  async saveIdentity(
    identifier: string,
    publicKey: ArrayBuffer,
    _nonblockingApproval: boolean | undefined,
  ): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const address = SignalProtocolAddress.fromString(identifier)
      const existing = this.store.getValue<string>(
        SIGNAL_CONST.identityKey + address.getName(),
      )
      if (!existing) {
        this.store.setValue(
          SIGNAL_CONST.identityKey + address.getName(),
          arrayBufferToString(publicKey),
        )
      }
      return resolve(
        !!(existing && existing !== arrayBufferToString(publicKey)),
      )
    })
  }

  async storePreKey(
    keyId: number | string,
    keyPair: KeyPairType,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = this.store.setObject<KPType<string>>(
        SIGNAL_CONST.preKey + keyId,
        EnhancedStore.serializeKeyPair(keyPair),
      )
      return result ? resolve() : reject('Not enough storage')
    })
  }

  async storeSession(
    identifier: string,
    record: SessionRecordType,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = this.store.setValue(
        SIGNAL_CONST.session + identifier,
        record,
      )
      return result ? resolve() : reject('Not enough storage')
    })
  }

  async storeSignedPreKey(
    keyId: number | string,
    keyPair: KeyPairType,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = this.store.setObject<KPType<string>>(
        SIGNAL_CONST.signedKey + keyId,
        EnhancedStore.serializeKeyPair(keyPair),
      )
      return result ? resolve() : reject('Not enough storage')
    })
  }

  removeStore() {
    this.store.removeInstance()
  }
  get indexer() {
    return this.store.indexer
  }
}
