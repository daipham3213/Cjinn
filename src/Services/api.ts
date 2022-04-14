import {
  ApolloClient as Apollo,
  DocumentNode,
  from,
  InMemoryCache,
  split,
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition, Observable } from '@apollo/client/utilities'
import { FetchResult } from '@apollo/client/link/core'
import { setContext } from '@apollo/client/link/context'
import { Platform } from 'react-native'
import { AppStorage } from '@/Hooks'
import { Config, R_DEVICE_AUTH, R_TOKEN } from '@/Config'
import { DeviceAuthProps } from '@/Services/types'
import { WebSocketLink } from '@apollo/client/link/ws'
import { errorLink } from '@/Services/utils'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { navigateAndSimpleReset } from '@/Navigators/utils'

type Query = <QV, RT>(
  name: string,
  query: DocumentNode,
  variables?: QV,
) => Promise<RT>

type Mutate = <MV, RT>(
  name: string,
  mutation: DocumentNode,
  variables?: MV,
) => Promise<RT>

type Subscribe = <SV, RT>(
  query: DocumentNode,
  variable?: SV,
) => Observable<FetchResult<RT>>

export const authLink = setContext((_, { headers }) => {
  const token = AppStorage.loadItem<string>(R_TOKEN)
  const deviceAuth = AppStorage.loadObject<DeviceAuthProps>(R_DEVICE_AUTH)
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
      ...(deviceAuth?.deviceToken && {
        deviceToken: `Bearer ${deviceAuth?.deviceToken}`,
      }),
      useragent: Platform.OS,
      credentials: 'same-origin',
    },
  }
})

export const httpLink = createUploadLink({
  uri: Config.GRAPHQL_URL,
})

const wsLink = () => {
  const wsClient = new SubscriptionClient(Config.GRAPHQL_WS, {
    reconnect: true,
    connectionParams: () => ({
      authorization: `Bearer ${AppStorage.loadItem<string>(R_TOKEN)}`,
      deviceToken: `Bearer ${
        AppStorage.loadObject<DeviceAuthProps>(R_DEVICE_AUTH)?.deviceToken
      }`,
    }),
  })
  wsClient.onReconnected(() => navigateAndSimpleReset('Main'))
  return new WebSocketLink(wsClient)
}

const splitLink = () => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink(),
    authLink.concat(httpLink),
  )
}

const token = () => AppStorage.loadItem<string>(R_TOKEN)
export const client = new Apollo({
  link: token()
    ? from([errorLink(), splitLink()])
    : from([errorLink(), authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
})

export class ApolloClient {
  public static query: Query = (name, query, variables) => {
    return client
      .query({ query, variables, fetchPolicy: 'no-cache' })
      .then(({ data }) => data[name])
  }
  public static mutate: Mutate = (name, mutation, variables) => {
    return client.mutate({ mutation, variables }).then(({ data }) => data[name])
  }
  public static subscribe: Subscribe = (subscription, variables) => {
    return client.subscribe({
      query: subscription,
      variables,
      fetchPolicy: 'no-cache',
    })
  }
}
