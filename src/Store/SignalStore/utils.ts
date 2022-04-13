import {
  DeviceType,
  KeyPairType,
  MessageType,
  PreKeyPairType,
  PreKeyType,
  SessionCipher,
  SignalProtocolAddress,
  SignedPreKeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript'
import {
  EnhancedStore,
  FullDirectoryEntry,
} from '@/Store/SignalStore/EnhancedStore'
import { SerializedKeyBundle } from '@/Store/DeviceStore'
import { Base64 } from 'js-base64'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256)
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i
}
export function arrayBufferToString(arr: ArrayBuffer): string {
  // let bytes = new Uint8Array(arr)
  //   i,
  //   len = bytes.length,
  //   base64 = ''
  //
  // for (i = 0; i < len; i += 3) {
  //   base64 += chars[bytes[i] >> 2]
  //   base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
  //   base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
  //   base64 += chars[bytes[i + 2] & 63]
  // }
  //
  // if (len % 3 === 2) {
  //   base64 = base64.substring(0, base64.length - 1) + '='
  // } else if (len % 3 === 1) {
  //   base64 = base64.substring(0, base64.length - 2) + '=='
  // }
  return Base64.fromUint8Array(new Uint8Array(arr))
}

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  // let bufferLength = base64.length * 0.75,
  //   len = base64.length,
  //   i,
  //   p = 0,
  //   encoded1,
  //   encoded2,
  //   encoded3,
  //   encoded4
  //
  // if (base64[base64.length - 1] === '=') {
  //   bufferLength--
  //   if (base64[base64.length - 2] === '=') {
  //     bufferLength--
  //   }
  // }
  //
  // const arraybuffer = new ArrayBuffer(bufferLength),
  //   bytes = new Uint8Array(arraybuffer)
  //
  // for (i = 0; i < len; i += 4) {
  //   encoded1 = lookup[base64.charCodeAt(i)]
  //   encoded2 = lookup[base64.charCodeAt(i + 1)]
  //   encoded3 = lookup[base64.charCodeAt(i + 2)]
  //   encoded4 = lookup[base64.charCodeAt(i + 3)]
  //
  //   bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
  //   bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
  //   bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
  // }
  return Base64.toUint8Array(base64)
}

// Type guards
export function isKeyPairType(kp: any): kp is KeyPairType {
  return !!(kp?.privateKey && kp?.publicKey)
}

export function isPreKeyType(pk: any): pk is PreKeyPairType {
  return typeof pk?.keyId === 'number' && isKeyPairType(pk?.keyPair)
}

export function isSignedPreKeyType(spk: any): spk is SignedPreKeyPairType {
  return spk?.signature && isPreKeyType(spk)
}

export function isArrayBuffer(thing: any): boolean {
  const t = typeof thing
  return (
    !!thing &&
    t !== 'string' &&
    t !== 'number' &&
    'byteLength' in (thing as any)
  )
}
export const serializeKeyBundle = (
  bundle: FullDirectoryEntry,
): SerializedKeyBundle => {
  const { registrationId, signedPreKey, preKeys, identityPubKey } = bundle

  let array: PreKeyType<string>[] = []
  Array.from(preKeys).forEach(value => {
    array.push({
      keyId: value.keyId,
      publicKey: arrayBufferToString(value.publicKey),
    })
  })

  return {
    registrationId,
    signedPreKey: {
      ...signedPreKey,
      publicKey: arrayBufferToString(signedPreKey.publicKey),
      signature: arrayBufferToString(signedPreKey.signature),
    },
    identityKey: arrayBufferToString(identityPubKey),
    preKeys: array,
  }
}

export function deserializeKeyBundle(device: DeviceType<string>): DeviceType {
  return {
    registrationId: device.registrationId,
    signedPreKey: {
      keyId: device.signedPreKey.keyId,
      publicKey: base64ToArrayBuffer(device.signedPreKey.publicKey),
      signature: base64ToArrayBuffer(device.signedPreKey.signature),
    },
    identityKey: base64ToArrayBuffer(device.identityKey),
    ...(device.preKey && {
      preKey: {
        keyId: device.preKey.keyId,
        publicKey: base64ToArrayBuffer(device.preKey.publicKey),
      },
    }),
  }
}

export const messageDecrypting = async (
  payload: string,
  senderId: string,
  registrationId: number,
  store: EnhancedStore,
): Promise<string> => {
  const message: MessageType = JSON.parse(payload)
  const address = new SignalProtocolAddress(senderId, registrationId)
  const sessionCipher = new SessionCipher(store!, address)
  let plaintext: ArrayBuffer = new Uint8Array().buffer
  switch (message.type) {
    case 1:
      console.log('received ciphertext', message)
      plaintext = await sessionCipher.decryptWhisperMessage(
        message.body!,
        'binary',
      )
      break
    case 3:
      // decrypting initial message and also create new session
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(
        message.body!,
        'binary',
      )
      break
  }
  return arrayBufferToString(plaintext)
}
