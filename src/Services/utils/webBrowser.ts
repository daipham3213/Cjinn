import { Linking, Platform } from 'react-native'
// @ts-ignore
import SafariView from 'react-native-safari-view'

const openBrowserAsync = (url: string) => {
  if (Platform.OS === 'ios') {
    return openInAppUrl(url).catch(() => openUrl(url))
  } else {
    return openUrl(url)
  }
}

const openUrl = (url: string) => {
  return Linking.openURL(url)
}
const openInAppUrl = (url: string) => {
  return SafariView.isAvailable().then(() => SafariView.show({ url }))
}

export const WebBrowserService = {
  openBrowserAsync,
}
