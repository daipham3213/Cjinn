import MMKVStorage from 'react-native-mmkv-storage'
import { storeKeyPrefix } from '@/Config'

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

export class SignalStorage {
  private loader = new MMKVStorage.Loader()
  private storage: MMKVStorage.API
  public isCreated = false

  constructor({ username, deviceId, address }: Address | Prefix) {
    let addr = ''
    if (!address && username && deviceId) {
      addr = storeKeyPrefix(username, deviceId)
    } else if (address) {
      addr = address
    } else {
      throw new Error('Invalid arguments')
    }
    this.storage = this.loader.withInstanceID(addr).initialize()
    this.isCreated = !this.storage.getString('address')
    if (this.isCreated) {
      this.storage.setString('address', addr)
    }
  }

  get indexer() {
    return this.storage.indexer
  }

  getObject<T extends object>(key: string): T | undefined {
    return this.storage.getMap<T>(key) ?? undefined
  }

  getValue<T extends string | number | boolean>(key: string): T | undefined {
    const result = this.storage.getString(key)
    return result ? (result as T) : undefined
  }

  setObject<T extends object>(key: string, object: T) {
    return this.storage.setMap(key, object)
  }

  setValue(key: string, object: string | number | boolean) {
    switch (typeof object) {
      case 'string':
        return this.storage.setString(key, object)
      case 'number':
        return this.storage.setInt(key, object)
      case 'boolean':
        return this.storage.setBool(key, object)
    }
  }

  removeObject(key: string) {
    return this.storage.removeItem(key)
  }

  removeInstance() {
    return this.storage.clearStore() && this.storage.clearMemoryCache()
  }
}
