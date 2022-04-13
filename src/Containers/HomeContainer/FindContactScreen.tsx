import React from 'react'
import { BackHandler, RefreshControl, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Layout as UILayout,
  List,
  ListItem,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import {
  CheckMarkSquare,
  DenySquare,
  MoreIcon,
  PaperPlaneIcon,
  SearchIcon,
} from '@/Components/Icons'
import { EmailRegex, PhoneNumberRegex, UsernameRegex } from '@/Config'
import { interactionsActions, messageActions, RootState } from '@/Store'
import { FriendRequestEdge, UserNodeEdge } from '@/Services/types'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { MainStackParamList } from '@/Navigators/HomeNavigator'
import moment from 'moment'

export type MainNavigatorProps = NativeStackScreenProps<MainStackParamList>
const FindContactScreen = ({ navigation }: MainNavigatorProps) => {
  const [offset, setOffset] = React.useState<number>(0)
  const [input, setInput] = React.useState<string>('')
  const [requestCursor, setRequestCursor] = React.useState<string>()
  const dispatch = useAppDispatch()
  const { findUser, friendRequest, isLoading } = useAppSelector(
    (states: RootState) => states.interaction,
  )

  const { t } = useTranslation()
  const styles = useStyleSheet(styleSheet)
  const { Layout, Gutters, Images } = useTheme()

  React.useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch(interactionsActions.resetState('findUser'))
        dispatch(interactionsActions.resetState('friendRequest'))
        navigation.goBack()
        return true
      },
    )
    return unsubscribe.remove()
  }, [dispatch, navigation])

  React.useEffect(() => {
    dispatch(
      messageActions.getFriendRequestAction({
        first: 10,
        after: requestCursor,
      }),
    )
  }, [dispatch, requestCursor])

  const handleFetchData = () => {
    let type = ''
    if (input.length > 0) {
      if (input.match(UsernameRegex)) {
        type = 'username'
      } else if (input.match(EmailRegex)) {
        type = 'email'
      } else if (input.match(PhoneNumberRegex)) {
        type = 'phone'
      }
      switch (type) {
        default:
          dispatch(
            messageActions.findUserAction({
              username: input,
              first: 10,
              offset: offset,
            }),
          )
          break
        case 'email':
          dispatch(
            messageActions.findUserAction({
              username: input,
              first: 10,
              offset: offset,
            }),
          )
          break
        case 'phone':
          dispatch(
            messageActions.findUserAction({
              username: input,
              first: 10,
              offset: offset,
            }),
          )
          break
      }
    }
  }
  const handleInputChange = (value: string) => {
    setInput(value)
    dispatch(interactionsActions.resetState('findUser'))
  }

  const handleEndReach = () => {
    if (findUser.connection?.pageInfo.hasNextPage) {
      setOffset(offset + 10)
    }
  }

  const handleRefresh = () => {
    dispatch(interactionsActions.resetState('findUser'))
    handleFetchData()
  }

  const handleSwitchToUserInfo = (id: string) => {
    navigation.navigate('UserInfo', { id })
  }

  const renderItem = (object: UserNodeEdge | null) => {
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

  const handleProcessRequest = (isAccept: 'True' | 'False', id?: string) => {
    if (id) {
      dispatch(
        messageActions.processFriendRequestAction({
          senderId: id,
          isAccept: isAccept,
        }),
      )
    }
  }

  const renderFriendRequest = (object: FriendRequestEdge | null) => {
    const renderFooter = (props: any, type: string, pk: string) => {
      switch (type) {
        case 'sender':
          return (
            <Button
              appearance={'filled'}
              status={'basic'}
              size={'small'}
              accessoryRight={PaperPlaneIcon}
            >
              {t('home.userinfo.wait') as string}
            </Button>
          )
        case 'receiver':
          return (
            <View style={{ flexDirection: 'row-reverse' }}>
              <Button
                appearance={'filled'}
                status={'success'}
                onPress={() => handleProcessRequest('True', pk)}
                size={'small'}
                accessoryRight={CheckMarkSquare}
                style={{ width: 100, marginBottom: 10, marginHorizontal: 10 }}
              >
                {t('home.userinfo.accept') as string}
              </Button>
              <Button
                appearance={'filled'}
                status={'danger'}
                onPress={() => handleProcessRequest('False', pk)}
                size={'small'}
                accessoryRight={DenySquare}
                style={{ width: 100, marginBottom: 10 }}
              >
                {t('home.userinfo.deny') as string}
              </Button>
            </View>
          )
        default:
          return <React.Fragment />
      }
    }
    if (object?.node) {
      const { avatar, firstName, lastName, pk, type, timestamp } = object.node
      const name = firstName && lastName ? firstName + ' ' + lastName : ''
      return (
        <Card
          onPress={() => handleSwitchToUserInfo(pk)}
          footer={props => renderFooter(props, type ?? '', pk)}
        >
          <ListItem
            onPress={() => handleSwitchToUserInfo(pk)}
            title={name}
            accessoryLeft={
              <Avatar source={avatar ? { uri: avatar } : Images.logo} />
            }
            description={moment(timestamp).fromNow()}
          />
        </Card>
      )
    }
    return <React.Fragment />
  }

  const renderFooter = () => {
    const hasNext = findUser.connection?.pageInfo.hasNextPage ?? false
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

  React.useEffect(() => {
    handleFetchData()
  }, [dispatch, input, offset])

  return (
    <UILayout style={[Layout.fullWidth, Layout.fill, { paddingBottom: 150 }]}>
      <Input
        style={[Gutters.regularVPadding, Gutters.regularHPadding]}
        placeholder={t('home.findContact.placeholder')}
        accessoryRight={SearchIcon}
        onChangeText={text => handleInputChange(text)}
      />
      <View style={[Gutters.smallHPadding, Layout.rowVCenter]}>
        <View style={[Layout.fill]}>
          {friendRequest.results ? (
            <React.Fragment>
              <Text appearance={'hint'} style={[Gutters.smallVMargin]}>
                {t('home.findContact.friendRequest') as string}
              </Text>
              <List
                style={[styles.list]}
                data={friendRequest.results}
                extraData={friendRequest.connection}
                renderItem={({ item }) => renderFriendRequest(item)}
              />
              {friendRequest.connection?.pageInfo.hasNextPage ? (
                <Button appearance={'ghost'}>
                  {t('home.findContact.loadMore') as string}
                </Button>
              ) : (
                <Divider />
              )}
            </React.Fragment>
          ) : null}
          {findUser.results ? (
            <React.Fragment>
              <Text appearance={'hint'} style={[Gutters.smallVMargin]}>
                {t('home.findContact.results') as string}
              </Text>
              <Divider />
              <List
                style={[styles.list]}
                data={findUser.results}
                extraData={findUser.connection}
                renderItem={({ item }) => renderItem(item)}
                ListFooterComponent={
                  findUser.results?.length > 5 ? (
                    renderFooter()
                  ) : (
                    <React.Fragment />
                  )
                }
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                  />
                }
                onEndReached={handleEndReach}
              />
            </React.Fragment>
          ) : (
            renderFooter()
          )}
        </View>
      </View>
    </UILayout>
  )
}

const styleSheet = StyleService.create({
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

export default FindContactScreen
