import { DeviceAuthProps, UserProps } from '@/Services/types'
import { ACTIVE_RECORD, R_DEVICE_AUTH, R_TOKEN } from '@/Config'
import { AppStorage } from '@/Hooks/useAppStorage'
import { WritableDraft } from 'immer/src/types/types-external'

export class DeviceRecord {
  public user: UserProps
  public auth: DeviceAuthProps

  constructor(deviceAuth: DeviceAuthProps, user: UserProps) {
    this.user = user
    this.auth = deviceAuth
  }

  static loadActiveRecord(): DeviceRecord | null {
    const activeId = AppStorage.loadItem<string>(ACTIVE_RECORD)
    let result = null
    if (activeId) {
      result = this.loadRecord(activeId)
    }
    return result
  }

  static loadRecord(userId: string): DeviceRecord | null {
    // getting data from drive
    const data = AppStorage.loadObject<DeviceRecord>(userId)
    if (data) {
      AppStorage.saveObject<DeviceAuthProps>(R_DEVICE_AUTH, data.auth)
      AppStorage.saveItem(R_TOKEN, data.user?.token)
      return data
    }
    return null
  }

  static saveRecord(record: DeviceRecord | WritableDraft<DeviceRecord>): void {
    if (record.user !== undefined && record.user !== null) {
      AppStorage.saveObject<DeviceRecord | WritableDraft<DeviceRecord>>(
        record.user.id,
        record,
      )
      AppStorage.removeItem(R_TOKEN)
      AppStorage.removeItem(R_DEVICE_AUTH)
    }
  }
}
