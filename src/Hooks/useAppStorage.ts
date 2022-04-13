import MMKVStorage from 'react-native-mmkv-storage'
import { useAppSelector } from '@/Hooks/useReduxStore'
import { EnhancedStore, RootState } from '@/Store'
import { useEffect, useState } from 'react'

export const useSignalStorage = () => {
  const { activeRecord } = useAppSelector((state: RootState) => state.device)
  const [store, setStore] = useState<EnhancedStore>()
  useEffect(() => {
    if (activeRecord) {
      const { user, auth } = activeRecord
      setStore(
        new EnhancedStore({ username: user.username, deviceId: auth.deviceId }),
      )
    }
  }, [activeRecord])

  return store
}

export class AppStorage {
  private static storageInstance = new MMKVStorage.Loader()
    .withInstanceID('cjin-record')
    .initialize()
  private static result: any

  static loadObject<T extends object>(key: string): T | null | undefined {
    return this.storageInstance.getMap<T>(key)
  }

  static loadItem<T>(key: string): T | undefined {
    const item = this.storageInstance.getString(key)
    if (item) {
      try {
        const parsed = JSON.parse(item) as T
        return parsed as T
      } catch (e) {
        return item as unknown as T
      }
    }
    return undefined
  }

  static loadItemASync<T>(key: string) {
    this.storageInstance.getItem(key).then(value => {
      if (value) {
        this.result = JSON.parse(value) as T
      }
    })
  }

  static saveObject<T extends object>(key: string, object: T) {
    return this.storageInstance.setMap(key, object)
  }

  static saveItem(key: string, object: any) {
    const item = typeof object === 'string' ? object : JSON.stringify(object)
    return this.storageInstance.setString(key, item)
  }

  static removeItem(key: string) {
    return this.storageInstance.removeItem(key)
  }
}
