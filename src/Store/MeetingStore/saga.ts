import { createAction, PayloadAction } from '@reduxjs/toolkit'
import {
  MessengerMutation,
  MessengerMutationCallSignalingArgs,
  MessengerQuery,
} from '@/Services/types'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { ApolloClient } from '@/Services/api'
import { CALL_SIGNALING, GET_MEETING } from '@/Services/operations'
import { showMutationErrorAction } from '@/Store/errorSaga'
import { navigate } from '@/Navigators/utils'
import { meetingSliceActions } from '@/Containers/CallContainer/components/slice'
import { RootState } from '@/Store'

export const callSignalingAction =
  createAction<MessengerMutationCallSignalingArgs>('mutation/callSignaling')
export const getMeetingAction = createAction<string>('query/getMeeting')

function* callSignaling({
  payload,
}: PayloadAction<MessengerMutationCallSignalingArgs>) {
  const response: MessengerMutation = yield call(
    ApolloClient.mutate,
    'messenger',
    CALL_SIGNALING,
    payload,
  )
  if (response.callSignaling) {
    const { errors, result, success } = response.callSignaling
    if (success) {
      const { device }: RootState = yield select()
      const { callId } = result
      if (payload.signalType === 'offer') {
        if (device.activeRecord) {
          const { user } = device.activeRecord
          yield put(
            meetingSliceActions.setCaller({
              id: user.id,
              avatar: user.avatar,
              firstName: user.firstName as any,
              lastName: user.lastName as any,
              username: user.username,
            }),
          )
        }
        navigate('Call', {
          screen: 'InCall',
          params: { meetingId: callId },
        })
      }
      if (payload.signalType === 'answer') {
        if (device.activeRecord) {
          const { user } = device.activeRecord
          console.log('call id', callId)
          yield put(
            meetingSliceActions.setCallee({
              id: user.id,
              avatar: user.avatar,
              firstName: user.firstName as any,
              lastName: user.lastName as any,
              username: user.username,
            }),
          )
        }
      }
      if (
        payload.signalType === 'add_offer_candidate' ||
        payload.signalType === 'add_answer_candidate'
      ) {
        yield put(
          meetingSliceActions.setMeeting({
            id: result.callId,
            type:
              payload.signalType === 'add_offer_candidate'
                ? 'out_going'
                : 'in_coming',
            hasVideo: true,
          }),
        )
      }
    } else {
      if (errors) {
        yield put(showMutationErrorAction({ errors }))
      }
    }
  }
}

function* getMeeting({ payload }: PayloadAction<string>) {
  const response: MessengerQuery = yield call(
    ApolloClient.query,
    'messenger',
    GET_MEETING,
    { meetingId: payload },
  )
  if (response.getMeeting) {
    yield put(meetingSliceActions.setData(response.getMeeting))
  }
}

export function* callSignalingWatcher() {
  yield all([
    takeEvery(callSignalingAction.type, callSignaling),
    takeEvery(getMeetingAction.type, getMeeting),
  ])
}
