import { mediaDevices } from 'react-native-webrtc'

class RtcUtils {
  private static isFront = true
  private static sourceId: any

  static async getStream() {
    const sourceInfos = await mediaDevices.enumerateDevices()
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i]
      if (
        sourceInfo.kind === 'videoinput' &&
        sourceInfo.facing === (this.isFront ? 'front' : 'environment')
      ) {
        this.sourceId = sourceInfo.deviceId
      }
    }
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        mandatory: {
          minWidth: 600, // Provide your own width, height and frame rate here
          minHeight: 700,
          minFrameRate: 30,
        },
        facingMode: this.isFront ? 'user' : 'environment',
        optional: this.sourceId ? [{ sourceId: this.sourceId }] : [],
      },
    })
    if (typeof stream !== 'boolean') {
      return stream
    }
    return null
  }
}

export default RtcUtils
