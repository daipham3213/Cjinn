import { PermissionsAndroid } from 'react-native'

async function requestUserPermission() {
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    )
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    )
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    )
  } catch (e) {
    console.log('Permission error', e)
  }
}

export default requestUserPermission
