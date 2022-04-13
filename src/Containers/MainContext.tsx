import React, { useRef, useState } from 'react'
import {
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc'
import {
  firebase,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { RTCUtils } from '@/Services/utils'
import { useAppDispatch, useAppSelector, useInComingMessage } from '@/Hooks'
import { DeliveredItem, ReceivedMessage } from '@/Store/SignalStore/type'
import { meetingSliceActions, MeetingType } from '@/Store/MeetingStore'
import uuid from 'react-native-uuid'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { CallKeep } from '@/Components/CallKeep'
import RNCallKeep from 'react-native-callkeep'

export interface MainContextType {
  localStream: MediaStream | null
  setLocalStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>
  remoteStream: MediaStream | null
  setRemoteStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>
  peerConnection: React.MutableRefObject<RTCPeerConnection | undefined> | null
  createOffer: () => Promise<string | undefined>
  joinMeeting: (meetingId: string) => Promise<void>
  onHangUp: () => Promise<void>
  onToggleMic: () => void
  onToggleCamera: () => void
  onSwitchCamera: () => void
  isMuted: boolean
  isOffCamera: boolean
  meeting?: MeetingType
  received: ReceivedMessage[]
  delivered: DeliveredItem[]
}
const initialValues: MainContextType = {
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isOffCamera: false,
  peerConnection: null,
  createOffer: () => Promise.reject<string>(),
  joinMeeting: () => Promise.reject<void>(),
  onHangUp: () => Promise.reject<void>(),
  onToggleCamera: () => {},
  onToggleMic: () => {},
  onSwitchCamera: () => {},
  received: [],
  delivered: [],
}

export const MainContext = React.createContext(initialValues)

interface Props {}

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] }
const MainContextProvider: React.FC<Props> = ({ children }) => {
  const { meeting } = useAppSelector(state => state.meeting)
  const dispatch = useAppDispatch()

  const [localStream, setLocalStream] = useState<MediaStream | null>(
    initialValues.localStream,
  )
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    initialValues.remoteStream,
  )
  const [isMuted, setIsMuted] = useState(initialValues.isMuted)
  const [isOffCamera, setOffCamera] = useState(initialValues.isOffCamera)
  const peerConnection = useRef<RTCPeerConnection>()

  const { received, delivered } = useInComingMessage()

  React.useEffect(() => {
    const cRef = meeting
      ? firebase.firestore().collection('meeting').doc(meeting.id)
      : null
    if (cRef) {
      const subscribe = cRef.onSnapshot(snapshot => {
        const data = snapshot.data()
        if (
          peerConnection.current &&
          !peerConnection.current.remoteDescription &&
          data &&
          data.answer
        ) {
          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          )
        }

        if (data && data.offer && !meeting) {
          console.log('New offer')
        }
      })
      const subscribeOnDelete = cRef
        .collection('callee')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
              onHangUp()
            }
          })
        })
      return () => {
        subscribe()
        subscribeOnDelete()
      }
    }
  }, [meeting])

  const setupWebRtc = async () => {
    peerConnection.current = new RTCPeerConnection(configuration)
    // Getting audio and video stream for the call
    const stream = await RTCUtils.getStream()
    if (stream) {
      setLocalStream(stream)
      peerConnection.current.addStream(stream)
    }
    // Get remote stream one it available
    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream)
    }
  }

  const collectIceCandidates = (
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    localName: string,
    remoteName: string,
  ) => {
    const candidateCollection = cRef.collection(localName)
    if (peerConnection.current) {
      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          candidateCollection.add(event.candidate)
        }
      }
    }

    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        try {
          if (change.type === 'added' && peerConnection.current) {
            const value = change.doc.data()
            const candidate = {
              candidate: value.candidate,
              sdpMLineIndex: value.sdpMLineIndex,
              sdpMid: value.sdpMid,
            }
            peerConnection.current.addIceCandidate(candidate)
          }
        } catch (e: any) {}
      })
    })
  }

  const createOffer = async (): Promise<string | undefined> => {
    await setupWebRtc()
    const chatId = meeting ? meeting.id : uuid.v4().toString()
    const cRef = firebase.firestore().collection('meeting').doc(chatId)
    collectIceCandidates(cRef, 'caller', 'callee')
    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      await peerConnection.current.setLocalDescription(offer)
      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      }
      await cRef.set(cWithOffer)
      dispatch(
        meetingSliceActions.setMeeting({
          id: chatId,
          type: 'out_going',
          hasVideo: true,
        }),
      )
      return chatId
    }
  }

  const joinMeeting = async (meetingId: string): Promise<void> => {
    try {
      dispatch(
        meetingSliceActions.setMeeting({
          id: meetingId,
          type: 'in_coming',
          hasVideo: true,
        }),
      )
      const cRef = firebase.firestore().collection('meeting').doc(meetingId)
      const call = await cRef.get()
      const offer = call.data()?.offer
      if (offer) {
        await setupWebRtc()
        collectIceCandidates(cRef, 'callee', 'caller')

        if (peerConnection.current) {
          const session = new RTCSessionDescription(offer)
          peerConnection.current.setRemoteDescription(session)

          const answer = await peerConnection.current.createAnswer()
          peerConnection.current.setLocalDescription(answer)
          const cWithAnswer = {
            answer: {
              type: answer.type,
              sdp: answer.sdp,
            },
          }
          await cRef.update(cWithAnswer)
        }
      }
    } catch (e: any) {
      console.log('Error while joining meeting', e?.message ?? e)
    }
  }

  const onToggleMic = () => {
    if (localStream) {
      setIsMuted(!isMuted)
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
  }

  const onToggleCamera = () => {
    if (localStream) {
      setOffCamera(!isOffCamera)
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
  }

  const onHangUp = async () => {
    peerConnection?.current?.close()
    localStream?.getTracks().forEach(track => track.stop())
    localStream?.release()
    setLocalStream(null)
    setRemoteStream(null)
    RNCallKeep.endAllCalls()
    fireStoreCleanUp()
    dispatch(meetingSliceActions.reset())
    navigateAndSimpleReset('Main')
  }

  const fireStoreCleanUp = async () => {
    if (meeting) {
      const cRef = firebase.firestore().collection('meeting').doc(meeting.id)
      if (cRef) {
        const calleeCandidate = await cRef.collection('callee').get()
        calleeCandidate.forEach(candidate => {
          candidate.ref.delete()
        })
        const callerCandidate = await cRef.collection('caller').get()
        callerCandidate.forEach(candidate => {
          candidate.ref.delete()
        })
        await cRef.delete()
      }
    }
  }

  const onSwitchCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        // @ts-ignore
        track._switchCamera()
      })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = {
    localStream,
    setLocalStream,
    remoteStream,
    setRemoteStream,
    isMuted,
    createOffer,
    peerConnection,
    joinMeeting,
    onToggleCamera,
    onToggleMic,
    onHangUp,
    isOffCamera,
    onSwitchCamera,
    meeting,
    received,
    delivered,
  }

  React.useEffect(() => {
    const initCall = new CallKeep({ dispatch, context: value })
    return initCall.setup()
  }, [dispatch, value])

  return (
    <MainContext.Provider value={value}>
      <React.Fragment>
        <CallKeep dispatch={dispatch} context={value} />
        {children}
      </React.Fragment>
    </MainContext.Provider>
  )
}
export default MainContextProvider
