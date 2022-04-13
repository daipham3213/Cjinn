import { createAction, PayloadAction } from '@reduxjs/toolkit'
import Toast from 'react-native-toast-message'
import { call, takeLatest } from 'redux-saga/effects'

export interface ErrorProps {
  errors: any
}
export const showMutationErrorAction = createAction<ErrorProps>(
  'toast/mutationErrorMessage',
)

function* showError(action: PayloadAction<ErrorProps>) {
  const errors = action.payload.errors
  let codes: string[] = []
  let messages: string[] = []

  console.log(errors, 'Error from server')
  Object.keys(errors).forEach(value => {
    let c,
      m = ''
    c = errors[value].code
    m = errors[value].message
    if (!c && !m) {
      c = errors[value][0].code
      m = errors[value][0].message
      if (!c && !m) {
        c = errors.code
        m = errors.message
      }
    }
    codes = codes.concat(c)
    messages = messages.concat(m)
  })
  let code = ''
  codes.forEach(object => {
    if (object) {
      let result = object.replace('_', ' ')
      code += result.charAt(0).toUpperCase() + result.slice(1) + ' '
    }
  })
  let message = ''
  messages.forEach(object => {
    if (object) {
      message += object.charAt(0).toUpperCase() + object.slice(1) + '\n'
    }
  })
  yield call(Toast.show, {
    type: 'error',
    text1: code.length > 0 ? code : 'Internal Server Error',
    text2: message.length > 0 ? message : 'Some thing went wrong',
  })
}

export interface InfoProps {
  result: string | { [key: string]: string }
  type: 'info' | 'error' | 'waring' | 'success'
}

export const showInfoAction = createAction<InfoProps>('toast/showInfoMessage')

function* showInfo(action: PayloadAction<InfoProps>) {
  const result = action.payload.result
  const type = action.payload.type
  const text1 = type.charAt(0).toUpperCase() + type.slice(1)

  if (typeof result === 'string') {
    yield call(Toast.show, { type, text1, text2: result })
  } else {
    let message = ''
    Object.keys(result).forEach(value => {
      message +=
        result[value].charAt(0).toUpperCase() + result[value].slice(1) + '\n'
    })
    yield call(Toast.show, { type, text1, text2: message })
  }
}

export default function* toastWatcher() {
  yield takeLatest(showMutationErrorAction.type, showError)
  yield takeLatest(showInfoAction.type, showInfo)
}
