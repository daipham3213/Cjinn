/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc'
import RNCallKeep from 'react-native-callkeep'

global.MediaStream = MediaStream
global.RTCSessionDescription = RTCSessionDescription
global.RTCPeerConnection = RTCPeerConnection
global.navigator.mediaDevices = {
  ...global.navigator.mediaDevices,
  getUserMedia: mediaDevices.getUserMedia,
}
AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () =>
    ({ name, callUUID, handle }) => {
      RNCallKeep.displayIncomingCall(callUUID, handle, name)
      return Promise.resolve()
    },
)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
