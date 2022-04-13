import React from 'react'
import { useSubscription } from '@apollo/client'
import { MEETING } from '@/Services/operations'
import { Subscription } from '@/Services/types'
import { useAppDispatch } from '@/Hooks/useReduxStore'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store'
import { meetingSliceActions, callSignalingAction } from '@/Store/MeetingStore'
import { MainContext } from '@/Containers/MainContext'
import { RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc'
import { navigateAndSimpleReset } from '@/Navigators/utils'

interface Props {
  meetingId: string
}
const { reset } = meetingSliceActions

const useCallSignaling = ({ meetingId }: Props) => {
  const dispatch = useAppDispatch()
  const { meeting } = useSelector((state: RootState) => state.meeting)
  const { localStream, remoteStream, peerConnection, ...rest } =
    React.useContext(MainContext)
  const { data, error } = useSubscription<Subscription, Props>(MEETING, {
    variables: { meetingId },
  })

  React.useEffect(() => {
    if (error) {
      console.log('SOCKET ERROR', error)
    }
  }, [error])

  React.useEffect(() => {
    if (data?.callSignaling) {
      const { event } = data.callSignaling
      console.log(event)
      const payload = event.data
      switch (payload.signalType) {
        case 'addAnswerCandidate':
          const { answerCandidate } = payload
          const ac = JSON.parse(answerCandidate)
          peerConnection?.current?.addIceCandidate(new RTCIceCandidate(ac))
          break
        case 'addOfferCandidate':
          const { offerCandidate } = payload
          const oc = JSON.parse(offerCandidate)
          peerConnection?.current?.addIceCandidate(new RTCIceCandidate(oc))
          break
        case 'answer':
          const { data: answer } = payload
          const answerDescription = new RTCSessionDescription(answer)
          peerConnection?.current?.setRemoteDescription(answerDescription)
          break
        case 'offer':
          const { data: offer } = payload
          const offerDescription = new RTCSessionDescription(offer)
          peerConnection?.current?.setRemoteDescription(offerDescription)
          break
        case 'denied':
          // leave meeting
          rest.onHangUp()
          navigateAndSimpleReset('Main')
          break
        case 'busy':
          rest.onHangUp()
          navigateAndSimpleReset('Main')
          break
      }
    }
  }, [data, dispatch])

  return {
    meeting,
    localStream,
    remoteStream,
    ...rest,
  }
}

export default useCallSignaling
export type CallSignalingPayloadType = {
  signalType: string
  from: {
    id: string
    firstName?: string
    lastName?: string
    avatar?: string
    username: string
  }
  data: any
}
