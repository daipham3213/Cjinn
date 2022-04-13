import React from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import {
  Avatar,
  Button,
  CheckBox,
  Input,
  Layout as UILayout,
  List,
  ListItem,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { ConversationParamsList } from '@/Navigators/ConversationNavigator'
import { BackIcon, SearchIcon } from '@/Components/Icons'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import {
  addThreadAction,
  interactionsActions,
  messageActions,
  RootState,
} from '@/Store'
import { BackHandler, RefreshControl, View } from 'react-native'
import { Maybe, UserViewEdge } from '@/Services/types'

type ConversationNavigatorProps = NativeStackScreenProps<
  ConversationParamsList,
  'AddConversation'
>
const AddConversationScreen = ({
  navigation,
  route,
}: ConversationNavigatorProps) => {
  const dispatch = useAppDispatch()
  const { searchContact, isLoading } = useAppSelector(
    (state: RootState) => state.interaction,
  )
  const { connection, results } = searchContact

  const { params } = route
  const { Layout, Gutters, Images } = useTheme()
  const { t } = useTranslation()

  const [cursor, setCursor] = React.useState<string | undefined>(undefined)
  const [input, setInput] = React.useState<string | undefined>(undefined)
  const [selected, setSelected] = React.useState(new Map<string, boolean>())

  React.useEffect(() => {
    dispatch(
      messageActions.searchContactAction({
        first: 10,
        after: cursor,
        keyword: input,
      }),
    )
  }, [cursor, dispatch, input])

  const handleBackPress = () => {
    if (route.name === 'AddConversation') {
      dispatch(interactionsActions.resetState('searchContact'))
    }
    navigation.goBack()
    return true
  }

  React.useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    )
    return () => unsubscribe.remove()
  })

  const handleInputChange = (value?: string) => {
    setInput(value)
  }

  const handleRefresh = () => {
    setCursor(undefined)
    dispatch(
      messageActions.searchContactAction({
        first: 10,
        after: cursor,
        keyword: input,
      }),
    )
  }

  const handleFetchMore = () => {
    if (connection?.pageInfo && input && input.length > 0) {
      const { hasNextPage, endCursor } = connection.pageInfo
      if (hasNextPage && endCursor) {
        setCursor(endCursor)
      }
    }
  }

  const handleNavigateOrCreateThread = () => {
    const members = [...selected].flatMap(([key, value]) => (value ? key : []))
    dispatch(
      addThreadAction({
        memberIds: members,
        isEncrypted: route.params.isEncrypt,
      }),
    )
  }

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected)
      const isSelect = !selected.get(id)
      newSelected.set(id, isSelect)

      setSelected(newSelected)
    },
    [selected],
  )

  const renderBackAction = (props: any): React.ReactElement => (
    <TopNavigationAction
      onPress={navigation.goBack}
      icon={<BackIcon />}
      {...props}
    />
  )

  const renderCreateAction = (props: any) => (
    <Button
      appearance={'filled'}
      size={'small'}
      disabled={selected.size < 1}
      onPress={handleNavigateOrCreateThread}
      {...props}
    >
      {t('conversations.create') as string}
    </Button>
  )
  const renderItem = (item: Maybe<UserViewEdge>) => {
    if (item?.node) {
      const { avatar, username, firstName, lastName, pk } = item.node
      const name =
        firstName && lastName ? firstName + ' ' + lastName : 'Unknown'
      return (
        <ListItem
          title={name}
          onPress={() => onSelect(pk)}
          description={`@${username}`}
          accessoryRight={(props: any) => (
            <CheckBox
              checked={!!selected.get(pk)}
              onChange={() => onSelect(pk)}
              {...props}
            />
          )}
          accessoryLeft={props => (
            <Avatar
              source={avatar ? { uri: avatar } : Images.logo}
              {...props}
            />
          )}
        />
      )
    }
    return <React.Fragment />
  }

  const renderFooter = (props?: any) => {
    const hasNext = connection?.pageInfo.hasNextPage ?? false
    return (
      <UILayout style={[Layout.center, Gutters.regularVPadding]} {...props}>
        <Text category={'p2'} appearance={'hint'}>
          {hasNext
            ? (t('home.findContact.loadMore') as string)
            : (t('home.findContact.end') as string)}
        </Text>
      </UILayout>
    )
  }

  return (
    <UILayout style={[Layout.fill]}>
      <TopNavigation
        alignment="center"
        title={t('containers.conversations') as string}
        subtitle={
          params.isEncrypt
            ? (t('conversations.addSecret') as string)
            : (t('conversations.subtitle') as string)
        }
        accessoryLeft={renderBackAction}
        accessoryRight={renderCreateAction}
      />
      <Input
        style={[Gutters.regularVPadding, Gutters.regularHPadding]}
        placeholder={t('home.findContact.placeholder')}
        accessoryRight={SearchIcon}
        value={input}
        onChangeText={handleInputChange}
      />
      <View>
        {results && results.length > 0 ? (
          <List
            data={results}
            extraData={selected}
            keyExtractor={(item, index) => item?.node?.pk ?? index}
            renderItem={({ item }) => renderItem(item)}
            onEndReached={() => handleFetchMore()}
            ListFooterComponent={props => renderFooter(props)}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
          />
        ) : (
          renderFooter()
        )}
      </View>
    </UILayout>
  )
}

export default AddConversationScreen
