import DeviceInfo from 'react-native-device-info'

const getVersion = (): string => {
  return DeviceInfo.getVersion()
}

const getBuildNumber = (): string => {
  return DeviceInfo.getBuildNumber()
}

const getDeviceName = (): string => {
  return DeviceInfo.getDeviceNameSync() + ' - ' + DeviceInfo.getModel()
}
export const AppInfoService = {
  getVersion,
  getBuildNumber,
  getDeviceName,
}
