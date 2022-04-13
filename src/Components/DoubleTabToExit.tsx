import { BackHandler, Platform, ToastAndroid } from 'react-native'
import { getCurrentRoute } from '@/Navigators/utils'

let currentCount = 0
const useDoubleBackPressExit = (
  exitHandler: () => void,
  goBackHandler: () => void,
) => {
  if (Platform.OS === 'ios') {
    return
  }
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    if (currentCount === 1) {
      exitHandler()
      subscription.remove()
      return true
    }
    backPressHandler(goBackHandler)
    return true
  })
}

const backPressHandler = (goBackHandler: () => void) => {
  const route = getCurrentRoute()
  if (route?.name === 'ConversationList' || route?.name === 'Auth') {
    if (currentCount < 1) {
      currentCount += 1
      ToastAndroid.show('Press again to close!', 2000)
    }
    setTimeout(() => {
      currentCount = 0
    }, 2000)
  } else {
    goBackHandler()
  }
}
export default useDoubleBackPressExit
