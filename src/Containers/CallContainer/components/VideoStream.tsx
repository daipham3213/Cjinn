import React from 'react'
import { MediaStream, RTCView } from 'react-native-webrtc'
import { Layout as View } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

export interface Props {
  localStream?: MediaStream
  remoteStream?: MediaStream
}

const VideoStream = ({ localStream, remoteStream }: Props) => {
  if (!remoteStream && localStream) {
    return (
      <View style={styles.container}>
        <RTCView
          style={styles.video}
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          mirror={true}
        />
      </View>
    )
  }
  if (remoteStream && localStream) {
    return (
      <View style={styles.container}>
        <RTCView
          style={styles.video}
          streamURL={remoteStream.toURL()}
          objectFit={'cover'}
        />
        <RTCView
          style={styles.localVideo}
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          mirror={true}
        />
      </View>
    )
  }
  return <View />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  localVideo: {
    position: 'absolute',
    width: '20%',
    height: '25%',
    top: 10,
    right: 10,
    elevation: 10,
  },
})

export default VideoStream
