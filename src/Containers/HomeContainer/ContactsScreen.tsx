import React from 'react'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { interactionsActions, messageActions, RootState } from '@/Store'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Divider,
  Input,
  Layout as UILayout,
  List,
  ListItem,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components'
import { BackHandler, RefreshControl, View } from 'react-native'
import { BackIcon, MoreIcon, SearchIcon } from '@/Components/Icons'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { MainStackParamList } from '@/Navigators/HomeNavigator'

const styler = StyleService.create({
  list: {
    backgroundColor: 'background-basic-color-1',
  },
  border: {
    borderColor: 'border-basic-color-2',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  },
})
type MainNavigatorProps = NativeStackScreenProps<MainStackParamList>
const ContactsScreen = ({ navigation }: MainNavigatorProps) => {
  const [input, setInput] = React.useState<string | undefined>(undefined)
  const [cursor, setCursor] = React.useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()
  const { searchContact, isLoading } = useAppSelector(
    (states: RootState) => states.interaction,
  )
  const { connection, results } = searchContact

  const { t } = useTranslation()
  const styles = useStyleSheet(styler)
  const { Layout, Gutters, Images } = useTheme()

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch(interactionsActions.resetState('findUser'))
      navigation.goBack()
      return true
    })
  })
  React.useEffect(() => {
    dispatch(
      messageActions.searchContactAction({
        first: 10,
        after: cursor,
        keyword: input,
      }),
    )
  }, [cursor, dispatch, input])

  const handleInputChange = (value?: string) => {
    dispatch(interactionsActions.resetState('searchContact'))
    setInput(value)
  }

  const handleRefresh = () => {
    setCursor(undefined)
  }

  const handleEndReach = () => {
    if (connection?.pageInfo && input && input.length > 0) {
      const { hasNextPage, endCursor } = connection.pageInfo
      if (hasNextPage && endCursor) {
        setCursor(endCursor)
      }
    }
  }

  const handleSwitchToUserInfo = (id: string) => {
    navigation.navigate('UserInfo', { id })
  }

  const renderItem = (object: any) => {
    if (object?.node) {
      const { avatar, firstName, lastName, pk, username } = object.node
      const name = firstName && lastName ? firstName + ' ' + lastName : username
      return (
        <ListItem
          title={name}
          description={<Text>@{username}</Text>}
          accessoryLeft={
            <Avatar source={avatar ? { uri: avatar } : Images.logo} />
          }
          accessoryRight={MoreIcon}
          onPress={() => handleSwitchToUserInfo(pk)}
        />
      )
    }
    return <React.Fragment />
  }
  const renderBackAction = (props: any): React.ReactElement => (
    <TopNavigationAction
      onPress={navigation.goBack}
      icon={<BackIcon />}
      {...props}
    />
  )

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

  return (
    <UILayout style={[Layout.fullWidth, Layout.fill, { paddingBottom: 150 }]}>
      <TopNavigation
        alignment={'center'}
        accessoryLeft={renderBackAction}
        title={t('home.contacts.title') as string}
      />
      <Input
        style={[Gutters.regularVPadding, Gutters.regularHPadding]}
        placeholder={t('home.findContact.placeholder')}
        accessoryRight={SearchIcon}
        onChangeText={text => handleInputChange(text)}
      />
      <View style={[Gutters.smallHPadding, Layout.rowVCenter]}>
        <View style={[Layout.fill]}>
          <Text style={[Gutters.smallVMargin]} appearance={'hint'}>
            {t('home.findContact.results') as string}
          </Text>
          <Divider />
          {results ? (
            <List
              style={[styles.list]}
              data={results}
              extraData={connection}
              renderItem={({ item }) => renderItem(item)}
              ListFooterComponent={
                results?.length > 5 ? renderFooter() : <React.Fragment />
              }
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={handleRefresh}
                />
              }
              onEndReached={handleEndReach}
            />
          ) : (
            renderFooter()
          )}
        </View>
      </View>
    </UILayout>
  )
}

export default ContactsScreen
