import React from 'react'
import RNCallKeep from 'react-native-callkeep'
import { PermissionsAndroid } from 'react-native'
import uuid from 'react-native-uuid'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { Dispatch } from 'redux'
import { MainContextType } from '@/Containers/MainContext'

export type CallKeepProps = {
  error: string
  callUUID: string
  handle: string
  localizedCallerName: string
  hasVideo: string
  fromPushKit: string
  payload: string
}

interface Props {
  dispatch: Dispatch
  context: MainContextType
}
export class CallKeep extends React.Component<Props, Props> {
  private currentCallId: string | undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      dispatch: props.dispatch,
      context: props.context,
    }
    RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction)
    RNCallKeep.addEventListener('endCall', this.onEndCallAction)
    RNCallKeep.addEventListener('showIncomingCallUi', this.showIncomingCallUi)
  }
  // Initialise RNCallKeep
  setup = () => {
    const options = {
      ios: {
        appName: 'Cjinn',
        imageName: 'sim_icon',
        supportsVideo: false,
        maximumCallGroups: '1',
        maximumCallsPerCallGroup: '1',
      },
      android: {
        alertTitle: 'Permissions Required',
        alertDescription:
          'This application needs to access your phone calling accounts to make calls',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'sim_icon',
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
        selfManaged: true,
      },
    }

    try {
      RNCallKeep.setup(options)
      RNCallKeep.setAvailable(true) // Only used for Android, see doc above.
    } catch (err: any) {
      console.error('initializeCallKeep error:', err?.message ?? err)
    }
  }

  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  startCall = ({ handle, localizedCallerName }: CallKeepProps) => {
    // Your normal start call action
    RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName)
  }

  reportEndCallWithUUID = (callUUID: string, reason: number) => {
    RNCallKeep.reportEndCallWithUUID(callUUID, reason)
  }

  onAnswerCallAction = async (data: CallKeepProps) => {
    let { callUUID } = data
    navigate('Call', { screen: 'InCall', params: { meetingId: callUUID } })
    this.startCall(data)
    // navigate to video screen
    // RNCallKeep.backToForeground()
  }

  onEndCallAction = (_: any) => {
    RNCallKeep.endCall(this.getCurrentCallId())
    this.currentCallId = undefined
    this.state.context.onHangUp()
    navigateAndSimpleReset('Main')
  }

  getCurrentCallId = () => {
    if (!this.currentCallId) {
      this.currentCallId = uuid.v4().toString()
    }
    return this.currentCallId
  }

  showIncomingCallUi = ({ handle, callUUID, name }: any) => {
    // meetingId: string; localizedName?: string; username: string
    navigate('Call', {
      screen: 'Waiting',
      params: { meetingId: callUUID, localizedName: name, username: handle },
    })
  }

  render() {
    return <React.Fragment />
  }
}
