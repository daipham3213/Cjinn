import { onError } from '@apollo/client/link/error'
import Toast from 'react-native-toast-message'

const errorLink = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        )
        Toast.show({
          type: 'error',
          text1: '[GraphQL error',
          text2: `Message: ${message}, Location: ${locations}, Path: ${path}`,
        })
      })
    }

    if (networkError) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: `${networkError}`,
      })
    }
  })
}
export default errorLink
