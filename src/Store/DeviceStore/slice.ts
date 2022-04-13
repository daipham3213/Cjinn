import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProps } from '@/Services/types'
import { DeviceRecord } from './deviceRecord'
import { AppStorage } from '@/Hooks'
import { R_DEVICE_AUTH, R_TOKEN } from '@/Config'

interface DeviceRecordState {
  isLoading: boolean
  isAuth: boolean
  isRegistering: boolean
  userData?: UserProps
  activeRecord?: DeviceRecord
  loadingState?: string
}

const slice = createSlice({
  name: 'deviceRecord',
  initialState: {
    isAuth: false,
    isLoading: false,
    isRegistering: false,
  } as DeviceRecordState,
  reducers: {
    toggleLoading: state => {
      state.isLoading = !state.isLoading
    },
    toggleAuth: state => {
      state.isAuth = !state.isAuth
    },
    toggleRegistering: state => {
      state.isRegistering = !state.isRegistering
    },
    changeUserData: (
      state,
      { payload }: PayloadAction<UserProps | undefined>,
    ) => {
      if (payload) {
        state.userData = payload
      }
    },
    loadRecord: (state, { payload }: PayloadAction<{ userId: string }>) => {
      const record = DeviceRecord.loadRecord(payload.userId)
      if (record) {
        state.isAuth = true
        state.activeRecord = record
      }
    },
    logout: state => {
      state.activeRecord && DeviceRecord.saveRecord(state.activeRecord)
      state.isAuth = false
      delete state.userData
      delete state.activeRecord
      AppStorage.removeItem(R_TOKEN)
      AppStorage.removeItem(R_DEVICE_AUTH)
    },
    changeLoadingState: (state, action: PayloadAction<string>) => {
      state.loadingState = action.payload
    },
  },
})

export default slice.reducer
export const deviceSliceActions = slice.actions
