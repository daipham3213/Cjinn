import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  verifyDevice: VerifyModalProps
  loading: LoadingProps
  changePassword: ChangePasswordProps
  imageViewer: {
    isShow: boolean
  }
}

const initialState: ModalState = {
  verifyDevice: {
    data: undefined,
    isShow: false,
  },
  loading: {
    isShow: false,
    message: '',
  },
  changePassword: {
    isShow: false,
    data: {},
  },
  imageViewer: {
    isShow: false,
  },
}

const slice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    toggleVerifyDevice: (
      state,
      action: PayloadAction<Omit<VerifyModalProps, 'isShow'> | undefined>,
    ) => {
      state.verifyDevice.isShow = !state.verifyDevice.isShow
      if (action.payload?.data) {
        state.verifyDevice.data = action.payload.data
      }
    },
    toggleLoading: (state, action: PayloadAction<Partial<LoadingProps>>) => {
      const { isShow, message } = action.payload
      state.loading.isShow = isShow ? isShow : !state.loading.isShow
      state.loading.message = message ?? ''
    },
    toggleChangePassword: (
      state,
      action: PayloadAction<Omit<ChangePasswordProps, 'isShow'>>,
    ) => {
      const { data } = action.payload
      state.changePassword.isShow = !state.changePassword.isShow
      state.changePassword.data = data
    },
    toggleImageViewer: state => {
      state.imageViewer.isShow = !state.imageViewer.isShow
    },
    reset: () => initialState,
  },
})

export default slice.reducer
export const modalActions = slice.actions

export interface VerifyModalProps {
  data?: {
    registrationId: number
  }
  isShow: boolean
}

export interface LoadingProps {
  isShow: boolean
  message?: string
}
export interface ChangePasswordProps {
  isShow: boolean
  data: {
    currentPassword?: string
  }
}
