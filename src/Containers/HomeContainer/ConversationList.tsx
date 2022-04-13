import React from 'react'
import { BackHandler, RefreshControl, View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import {
  Divider,
  Layout as UILayout,
  List,
  Text,
  useTheme as useUITheme,
} from '@ui-kitten/components'
import {
  ConversationItem,
  SearchBar,
  useDoubleBackPressExit,
} from '@/Components'
import {
  useAppDispatch,
  useAppSelector,
  useSignalStorage,
  useTheme,
} from '@/Hooks'
import { deviceActions, messageActions, RootState } from '@/Store'
import { MainStackParamList } from '@/Navigators/HomeNavigator'
import { useTranslation } from 'react-i18next'
import { navigate } from '@/Navigators/utils'
import messaging from '@react-native-firebase/messaging'
import requestUserPermission from '@/Services/utils/requestNotificationPerm'

const MemorizedConversationItem = React.memo(ConversationItem)

type MainNavigatorProps = NativeStackScreenProps<MainStackParamList>
const ConversationList = ({ navigation }: MainNavigatorProps) => {
  //<editor-fold desc="State && Hooks">
  const dispatch = useAppDispatch()
  const store = useSignalStorage()
  const { threads, isLoading } = useAppSelector(
    (state: RootState) => state.interaction,
  )
  const [loading, setLoading] = React.useState<boolean>(false)
  const [cursor, setCursor] = React.useState<string | undefined>()
  const [next, setNext] = React.useState<string | undefined>()
  const theme = useUITheme()
  const { connection, results } = threads
  const { Gutters, Layout } = useTheme()
  const { t } = useTranslation()
  useDoubleBackPressExit(
    () => BackHandler.exitApp(),
    () => navigation.goBack(),
  )
  //</editor-fold>
  //<editor-fold desc="Registration FCM Token with the server">
  React.useEffect(() => {
    const handleUpdateToken = (token: string) => {
      dispatch(deviceActions.updateDeviceInfoAction(token))
    }
    requestUserPermission().catch()
    messaging().onTokenRefresh(token => handleUpdateToken(token))
  }, [dispatch])
  //</editor-fold>

  React.useEffect(() => {
    const handleGetThreadList = async (): Promise<string[] | undefined> => {
      if (store) {
        const conversations = await store.messages.getThreadList(10, cursor)
        return conversations && conversations.flatMap(value => value.id)
      }
    }
    const fetchData = async () => {
      const threadIds = await handleGetThreadList()
      if (threadIds) {
        setNext(threadIds[threadIds.length - 1])
        dispatch(messageActions.getThreadsAction({ ids: threadIds }))
      }
    }
    fetchData()
      .then(() => setLoading(false))
      .catch(e => console.error(e))
  }, [cursor, dispatch, loading])

  //<editor-fold desc="Handlers and renderers">
  const handleSwitchToFindContact = () => {
    navigation.navigate('FindContact')
  }

  const handleSwitchToContact = () => {
    navigation.navigate('ContactsScreen')
  }

  const handleRefresh = () => {
    setCursor(undefined)
    setLoading(true)
  }

  const handleFetchMore = () => {
    if (next && next !== cursor) {
      setCursor(next)
    }
  }

  const handleFindMessage = (value: string) => {
    console.log(value)
  }

  const renderItem = ({ item }: any) => {
    const handlePress = () => {
      navigate('Conversation', {
        screen: 'InConversation',
        params: { threadId: item.node.pk },
      })
    }
    const handleDelete = (id: string) => {
      if (store) {
        setLoading(true)
        store.messages.removeThread(id).then(() => setLoading(false))
      }
    }
    return (
      <MemorizedConversationItem
        thread={item}
        onDelete={handleDelete}
        onPress={handlePress}
      />
    )
  }
  const renderFooter = () => {
    const hasNext = connection?.pageInfo.hasNextPage ?? false
    return (
      <View style={[Layout.center]}>
        <Text category={'p2'} appearance={'hint'}>
          {hasNext
            ? (t('home.findContact.loadMore') as string)
            : (t('home.findContact.end') as string)}
        </Text>
      </View>
    )
  }
  //</editor-fold>
  return (
    <UILayout style={[Layout.fill]}>
      <View style={[Gutters.smallHPadding, Gutters.regularTPadding]}>
        <SearchBar
          onInputChange={handleFindMessage}
          onAddContactPress={handleSwitchToFindContact}
          onContactsPress={handleSwitchToContact}
        />
      </View>
      <UILayout style={[Layout.fullSize]}>
        <UILayout
          style={[
            Gutters.regularHPadding,
            Gutters.smallTMargin,
            { marginBottom: 200, height: '100%' },
          ]}
        >
          {results.length === 0 && renderFooter()}
          <List
            data={results}
            extraData={{ cursor, loading, isLoading }}
            contentContainerStyle={{
              backgroundColor: theme['background-basic-color-1'],
              height: '100%',
            }}
            keyExtractor={(item, index) => item?.node?.id ?? index + ''}
            renderItem={renderItem}
            onEndReached={handleFetchMore}
            ItemSeparatorComponent={Divider}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
          />
        </UILayout>
      </UILayout>
    </UILayout>
  )
}

export default ConversationList
