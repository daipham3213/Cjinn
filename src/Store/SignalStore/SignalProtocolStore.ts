import {
  Direction,
  SessionRecordType,
  SignalProtocolAddress,
  StorageType,
} from '@privacyresearch/libsignal-protocol-typescript'
import { arrayBufferToString, isKeyPairType } from './utils'
import { SIGNAL_CONST } from '@/Store/SignalStore/consts'

interface KeyPairType {
  pubKey: ArrayBuffer
  privKey: ArrayBuffer
}

interface PreKeyType {
  keyId: number
  keyPair: KeyPairType
}
interface SignedPreKeyType extends PreKeyType {
  signature: ArrayBuffer
}

function isArrayBuffer(thing: StoreValue): boolean {
  const t = typeof thing
  return (
    !!thing &&
    t !== 'string' &&
    t !== 'number' &&
    'byteLength' in (thing as any)
  )
}

type StoreValue =
  | KeyPairType
  | string
  | number
  | PreKeyType
  | SignedPreKeyType
  | ArrayBuffer
  | undefined

export class SignalProtocolStore implements StorageType {
  private _store: Record<string, StoreValue>

  constructor() {
    this._store = {}
  }
  //
  get(key: string, defaultValue: StoreValue): StoreValue {
    if (key === null || key === undefined) {
      throw new Error('Tried to get value for undefined/null key')
    }
    if (key in this._store) {
      return this._store[key]
    } else {
      return defaultValue
    }
  }
  remove(key: string): void {
    if (key === null || key === undefined) {
      throw new Error('Tried to remove value for undefined/null key')
    }
    delete this._store[key]
  }
  put(key: string, value: StoreValue): void {
    if (
      key === undefined ||
      value === undefined ||
      key === null ||
      value === null
    ) {
      throw new Error('Tried to store undefined/null')
    }
    this._store[key] = value
  }

  async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
    const kp = this.get(SIGNAL_CONST.identityKey, undefined)
    if (isKeyPairType(kp) || typeof kp === 'undefined') {
      return kp as KeyPairType
    }
    throw new Error('Item stored as identity key of unknown type.')
  }

  async getLocalRegistrationId(): Promise<number | undefined> {
    const rid = this.get(SIGNAL_CONST.registrationId, undefined)
    if (typeof rid === 'number' || typeof rid === 'undefined') {
      return rid
    }
    throw new Error('Stored Registration ID is not a number')
  }
  isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    _direction: Direction,
  ): Promise<boolean> {
    if (identifier === null || identifier === undefined) {
      throw new Error('tried to check identity key for undefined/null key')
    }
    const trusted = this.get(SIGNAL_CONST.identityKey + identifier, undefined)

    // TODO: Is this right? If the ID is NOT in our store we trust it?
    if (trusted === undefined) {
      return Promise.resolve(true)
    }
    return Promise.resolve(
      arrayBufferToString(identityKey) ===
        arrayBufferToString(trusted as ArrayBuffer),
    )
  }
  async loadPreKey(keyId: string | number): Promise<KeyPairType | undefined> {
    let res: KeyPairType = this.get(
      SIGNAL_CONST.preKey + keyId,
      undefined,
    ) as KeyPairType
    if (isKeyPairType(res)) {
      res = { pubKey: res.pubKey, privKey: res.privKey }
      return res
    } else if (typeof res === 'undefined') {
      return res
    }
    throw new Error('stored key has wrong type')
  }
  async loadSession(
    identifier: string,
  ): Promise<SessionRecordType | undefined> {
    const rec = this.get(SIGNAL_CONST.session + identifier, undefined)
    if (typeof rec === 'string') {
      return rec as string
    } else if (typeof rec === 'undefined') {
      return rec
    }
    throw new Error('session record is not an ArrayBuffer')
  }

  async loadSignedPreKey(
    keyId: number | string,
  ): Promise<KeyPairType | undefined> {
    const res = this.get(
      SIGNAL_CONST.signedKey + keyId,
      undefined,
    ) as KeyPairType
    if (isKeyPairType(res)) {
      return { pubKey: res.pubKey, privKey: res.privKey }
    } else if (typeof res === 'undefined') {
      return res
    }
    throw new Error('stored key has wrong type')
  }
  async removePreKey(keyId: number | string): Promise<void> {
    this.remove(SIGNAL_CONST.preKey + keyId)
  }
  async saveIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
  ): Promise<boolean> {
    if (identifier === null || identifier === undefined) {
      throw new Error('Tried to put identity key for undefined/null key')
    }

    const address = SignalProtocolAddress.fromString(identifier)

    const existing = this.get(
      SIGNAL_CONST.identityKey + address.getName(),
      undefined,
    )
    this.put(SIGNAL_CONST.identityKey + address.getName(), identityKey)
    if (existing && !isArrayBuffer(existing)) {
      throw new Error('Identity Key is incorrect type')
    }

    return !!(
      existing &&
      arrayBufferToString(identityKey) !==
        arrayBufferToString(existing as ArrayBuffer)
    )
  }
  async storeSession(
    identifier: string,
    record: SessionRecordType,
  ): Promise<void> {
    return this.put(SIGNAL_CONST.session + identifier, record)
  }
  async loadIdentityKey(identifier: string): Promise<ArrayBuffer | undefined> {
    if (identifier === null || identifier === undefined) {
      throw new Error('Tried to get identity key for undefined/null key')
    }

    const key = this.get(SIGNAL_CONST.identityKey + identifier, undefined)
    if (isArrayBuffer(key)) {
      return key as ArrayBuffer
    } else if (typeof key === 'undefined') {
      return key
    }
    throw new Error('Identity key has wrong type')
  }
  async storePreKey(
    keyId: number | string,
    keyPair: KeyPairType,
  ): Promise<void> {
    return this.put(SIGNAL_CONST.preKey + keyId, keyPair)
  }

  // TODO: Why is this keyId a number where others are strings?
  async storeRegistrationId(registrationId: number) {
    return this.put(SIGNAL_CONST.registrationId, registrationId)
  }
  async storeSignedPreKey(
    keyId: number | string,
    keyPair: KeyPairType,
  ): Promise<void> {
    return this.put(SIGNAL_CONST.signedKey + keyId, keyPair)
  }
  async removeSignedPreKey(keyId: number | string): Promise<void> {
    return this.remove(SIGNAL_CONST.signedKey + keyId)
  }
  async removeSession(identifier: string): Promise<void> {
    return this.remove(SIGNAL_CONST.session + identifier)
  }
  async removeAllSessions(identifier: string): Promise<void> {
    for (const id in this._store) {
      if (id.startsWith(SIGNAL_CONST.session + identifier)) {
        delete this._store[id]
      }
    }
  }
}
