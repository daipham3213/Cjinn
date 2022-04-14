const host = '192.168.1.19'
export const Config = {
  API_URL: 'https://jsonplaceholder.typicode.com/',
  GRAPHQL_URL: `http://${host}/graphql/`,
  GRAPHQL_WS: `ws://${host}/graphql/`,
  DEBOUNCE: 500,
  MSG_THRESHOLD: 1100,
  CHANNEL_NOTIFY: 'cjinn-notify',
}

export const ACTIVE_RECORD = 'active_record'
export const R_TOKEN = 'receivedToken'
export const R_DEVICE_AUTH = 'receivedDeviceAuth'
export const FCM_TOKEN = 'fcmToken'

export const EmailRegex =
  /^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i
export const UsernameRegex =
  /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
export const PhoneNumberRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
export const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
export const identityCardRegExp = /^([0-9]{9})(X|V)$|^([0-9]{11})/gis
export const UsernameOrEmailRegex =
  /^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$|^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i

export const storeKeyPrefix = (
  username: string,
  deviceId: string,
  separator = ':',
) => `${username}${separator}${deviceId}`

export const starterMessageBytes = Uint8Array.from([
  0xce, 0x93, 0xce, 0xb5, 0xce, 0xb9, 0xce, 0xac, 0x20, 0xcf, 0x83, 0xce, 0xbf,
  0xcf, 0x85,
])
