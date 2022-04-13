import {
  EnhancedStore,
  isKeyPairType,
  serializeKeyBundle,
  SIGNAL_CONST,
} from '@/Store/SignalStore'
import {
  KeyHelper,
  PreKeyPairType,
  PreKeyType,
  SignedPublicPreKeyType,
} from '@privacyresearch/libsignal-protocol-typescript'
import { SerializedKeyBundle } from '@/Store'

export const addKeyBundles = async (store: EnhancedStore) => {
  try {
    // Check if store has identity key
    let identityKeyPair = await store.getIdentityKeyPair()
    if (!identityKeyPair || !isKeyPairType(identityKeyPair)) {
      // Generate identity key pair (long term key pair)
      identityKeyPair = await KeyHelper.generateIdentityKeyPair()
      // Save key to store
      store.storeIdentityKeyPair(identityKeyPair)
    }
    // Generate pre keys
    let preKeys: PreKeyPairType[] = []
    for (let i = 0; i < 20; i++) {
      const baseId = KeyHelper.generateRegistrationId()
      const preKey: PreKeyPairType = await KeyHelper.generatePreKey(baseId)
      preKeys.push(preKey)
      await store.storePreKey(`${baseId}`, preKey.keyPair)
    }
    // Generate signed pre key
    const signedPreKeyId = KeyHelper.generateRegistrationId()
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      signedPreKeyId,
    )
    await store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
    // Generate new public signed key and public pre keys
    const publicSignedKey: SignedPublicPreKeyType = {
      keyId: signedPreKey.keyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    }

    let publicPreKeys: PreKeyType[] = []
    preKeys.forEach(key => {
      publicPreKeys.push({
        keyId: key.keyId,
        publicKey: key.keyPair.pubKey,
      })
    })
    // Serialize key bundle
    const registrationId = await store.getLocalRegistrationId()
    if (registrationId) {
      return await new Promise<SerializedKeyBundle>(resolve =>
        resolve(
          serializeKeyBundle({
            identityPubKey: identityKeyPair?.pubKey as any,
            preKeys: publicPreKeys,
            signedPreKey: publicSignedKey,
            registrationId: registrationId,
          }),
        ),
      )
    }
  } catch (e) {
    console.log(e)
  }
}

export async function checkKeyCount(store: EnhancedStore) {
  // Check if store has identity keys
  const identityKey = await store.getIdentityKeyPair()
  if (!identityKey) {
    return false
  }

  //Check if store has signed key
  const keys = await store.indexer.getKeys()
  const signedPreKey = keys.filter(value =>
    value.startsWith(SIGNAL_CONST.signedKey),
  ).length
  console.log(signedPreKey, ' counted signed key')
  if (signedPreKey === 0) {
    return false
  }

  // Check pre keys store
  const preKeyCount = keys.filter(value =>
    value.startsWith(SIGNAL_CONST.preKey),
  ).length
  console.log(preKeyCount, ' counted prekey')
  return preKeyCount > 0
}
