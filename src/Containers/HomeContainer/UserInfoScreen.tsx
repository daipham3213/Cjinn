import React from 'react'
import {
  IndexPath,
  Layout as UILayout,
  Menu,
  MenuGroup,
  MenuItem,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import faker from 'faker'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { Image, View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { messageActions, RootState } from '@/Store'
import {
  BookIcon,
  EmailIcon,
  GiftIcon,
  GlobeIcon,
  PaperPlaneIcon,
  PersonIcon,
  PhoneIcon,
} from '@/Components/Icons'
import { MainStackParamList } from '@/Navigators/HomeNavigator'
import { UserInfoType } from '@/Services/types'
import moment from 'moment'
import Clipboard from '@react-native-clipboard/clipboard'
import Toast from 'react-native-toast-message'
import ContactButton from '@/Containers/HomeContainer/components/ContactButton'

type MainNavigatorProps = NativeStackScreenProps<MainStackParamList, 'UserInfo'>

interface InfoMenuProps {
  // style?: StyleProp<ViewStyle>
  userInfo: UserInfoType
}

const InfoMenu = ({ userInfo }: InfoMenuProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<
    IndexPath | undefined
  >()

  const { dob, email, gender, phone } = userInfo

  const handleCopy = (value: string) => {
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard',
    })
    Clipboard.setString(value)
  }
  return (
    <Menu
      style={{ flex: 1, marginBottom: 100, marginTop: 20 }}
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      <MenuGroup title={'Information'} accessoryLeft={BookIcon}>
        <MenuItem
          title={email as string}
          accessoryLeft={EmailIcon}
          onLongPress={() => handleCopy(email as any)}
        />
        <MenuItem
          title={gender && gender === 'MALE' ? 'Male' : 'Female'}
          accessoryLeft={PersonIcon}
        />
        <MenuItem
          title={phone ?? 'None'}
          accessoryLeft={PhoneIcon}
          onLongPress={() => phone && handleCopy(phone)}
        />
        <MenuItem
          title={moment(dob).format('MMMM Do YYYY')}
          accessoryLeft={GiftIcon}
        />
      </MenuGroup>
      <MenuGroup title={'Groups'} accessoryLeft={GlobeIcon}>
        <MenuItem title="Nebular" accessoryLeft={PaperPlaneIcon} />
      </MenuGroup>
    </Menu>
  )
}

const UserInfoScreen = ({ navigation, route }: MainNavigatorProps) => {
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector((state: RootState) => state.interaction)

  const styles = useStyleSheet(styleSheet)
  const { Images, Layout } = useTheme()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [userId, setUserId] = React.useState<string | undefined>()

  const handleSendRequest = () => {
    if (userId) {
      setLoading(true)
      dispatch(messageActions.sendFriendRequestAction({ recipientId: userId }))
    }
  }

  const handleProcessRequest = (isAccept: 'True' | 'False', id?: string) => {
    if (id) {
      setLoading(true)
      dispatch(
        messageActions.processFriendRequestAction({
          senderId: id,
          isAccept: isAccept,
        }),
      )
    }
  }

  React.useEffect(() => {
    if (route.params.id) {
      setUserId(route.params.id)
    }
    if (userId) {
      // getting user info
      dispatch(messageActions.getUserInfoAction({ id: userId }))
      setLoading(false)
    }
  }, [userId, dispatch, loading])

  return (
    <UILayout style={[Layout.fill]}>
      <UILayout style={[Layout.fullSize]}>
        <View style={[Layout.fullSize, styles.coverContainer]}>
          <Image
            source={{
              uri: `https://picsum.photos/420/320?image=${faker.datatype.number(
                { max: 120, min: 0 },
              )}`,
            }}
            resizeMode={'cover'}
            style={styles.cover as any}
          />
          <Image
            source={userInfo?.avatar ? { uri: userInfo.avatar } : Images.logo}
            style={styles.avatar as any}
            resizeMode={'contain'}
          />
          <View style={[styles.avatarWrapper]} />
        </View>
        <View style={[styles.username]}>
          <Text category={'p2'}>
            {userInfo?.firstName && userInfo?.lastName
              ? userInfo.firstName + ' ' + userInfo.lastName
              : ''}
          </Text>
          <Text appearance={'hint'} category={'c2'}>
            {userInfo ? '@' + userInfo.username : '@undefined'}
          </Text>
        </View>
        <View style={[styles.btnAddWrapper]}>
          <ContactButton
            contactStatus={userInfo?.contactStatus as any}
            userId={userId}
            onProcessRequest={handleProcessRequest}
            onSendRequest={handleSendRequest}
          />
        </View>
        <UILayout style={[styles.info]}>
          <InfoMenu userInfo={userInfo as any} />
        </UILayout>
      </UILayout>
    </UILayout>
  )
}

const styleSheet = StyleService.create({
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    top: 190,
    left: 35,
    position: 'absolute',
    zIndex: 1,
  },
  coverContainer: {
    position: 'relative',
    height: 250,
  },
  avatarWrapper: {
    backgroundColor: 'white',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'color-primary-disabled',

    position: 'relative',
    top: 180,
    left: 24,
  },
  cover: {
    width: '100%',
    height: 230,
    position: 'absolute',
    top: 0,
  },
  username: {
    marginLeft: 150,
    marginBottom: 20,
  },
  btnAddWrapper: {
    position: 'absolute',
    top: 250,
    right: 20,
  },
  info: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 200,
  },
})

export default UserInfoScreen
