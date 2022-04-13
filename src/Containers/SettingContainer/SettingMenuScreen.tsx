import React from 'react'
import {
  Avatar,
  Button,
  Divider,
  Layout as UILayout,
  StyleService,
  Text,
  Toggle,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  useTheme as useThemeUI,
} from '@ui-kitten/components'
import {
  BackIcon,
  DarkModeIcon,
  GlobeIcon,
  LogoutIcon,
  PersonIcon,
  USFlag,
  VietnamFlag,
} from '@/Components/Icons'
import { useAppSelector, useSignalStorage, useTheme } from '@/Hooks'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import i18n from '../../Translations'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { useAppDispatch } from '@/Hooks/useReduxStore'
import { arrayBufferToString, deviceActions, RootState } from "@/Store";
import { deviceSliceActions } from '@/Store/DeviceStore/slice'
import { KeyHelper } from "@privacyresearch/libsignal-protocol-typescript";

interface Props {
  navigation: any
}

const SettingMenuScreen = ({ navigation }: Props) => {
  const { Layout, Fonts, Gutters, darkMode, Images } = useTheme()
  const [lang, setLang] = React.useState('en')
  const styles = useStyleSheet(styleSheet)
  const theme = useThemeUI()
  const { t } = useTranslation()
  const store = useSignalStorage()

  const { userData } = useAppSelector((state: RootState) => state.device)

  const dispatch = useAppDispatch()

  // eslint-disable-next-line no-shadow
  const onChangeTheme = async ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  const changeLanguage = React.useCallback(
    (lng: 'vn' | 'en' | string) => {
      if (lng !== lang) {
        i18n
          .changeLanguage(lng)
          .then()
          .catch(error => console.error(error))
        setLang(lng)
        const val = lng === 'vn' ? 'vi' : 'en'
        dispatch(deviceActions.updateUserInfoAction({ language: val as any }))
      }
    },
    [dispatch, lang],
  )

  React.useEffect(() => {
    dispatch(deviceActions.whoAmIAction())
  }, [dispatch, store])

  const displayName = (): string => {
    if (userData) {
      return `${userData.firstName} ${userData.lastName}`
    }
    return ''
  }

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />
  )

  const handleLogout = () => {
    dispatch(deviceSliceActions.logout())
  }

  return (
    <UILayout style={[Layout.fill, Layout.justifyContentStart]}>
      <TopNavigation
        title={t('containers.setting') as string}
        accessoryLeft={renderBackAction}
      />
      <ScrollView style={[Layout.fill]}>
        <View style={[Layout.center, Layout.fullWidth]}>
          <Avatar
            shape="rounded"
            size="giant"
            source={userData?.avatar ? { uri: userData?.avatar } : Images.logo}
          />
          <Text style={[Fonts.titleSmaller, Gutters.smallVMargin]}>
            {displayName()}
          </Text>
        </View>
        <View style={[Gutters.regularVMargin, Layout.column, Layout.fill]}>
          <Divider />
          <Text
            style={[
              Gutters.regularVPadding,
              Gutters.regularHPadding,
              Fonts.textSmall,
              { fontWeight: 'bold' },
            ]}
          >
            {t('containers.setting') as string}
          </Text>
          <TouchableOpacity style={[Layout.fullWidth, Gutters.largeHPadding]}>
            <View
              style={[
                Layout.row,
                Layout.alignItemsCenter,
                Gutters.regularVMargin,
              ]}
            >
              <PersonIcon
                fill={theme['color-primary-500']}
                style={[styles.icon]}
              />
              <Text style={[Fonts.textSmaller]}>
                {t('settings.updateProfile') as string}
              </Text>
            </View>
            <Divider />
          </TouchableOpacity>
          <View style={[Layout.fullWidth, Gutters.largeHPadding]}>
            <View
              style={[
                Layout.row,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                Gutters.regularVMargin,
              ]}
            >
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <DarkModeIcon
                  fill={theme['color-primary-500']}
                  style={[styles.icon]}
                />
                <Text style={[Fonts.textSmaller]}>
                  {t('settings.appTheme') as string}
                </Text>
              </View>
              <Toggle
                checked={darkMode}
                onChange={props => onChangeTheme({ darkMode: props })}
              />
            </View>
            <Divider />
          </View>
          <View style={[Layout.fullWidth, Gutters.largeHPadding]}>
            <View style={[Layout.alignItemsStart, Gutters.regularVMargin]}>
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <GlobeIcon
                  fill={theme['color-primary-500']}
                  style={[styles.icon]}
                />
                <Text style={[Fonts.textSmaller]}>
                  {t('settings.language') as string}
                </Text>
              </View>
              <Divider />
              {/*  Flags */}
              <View style={[Layout.row, Layout.center, Layout.fullWidth]}>
                <TouchableOpacity style={[Layout.center]}>
                  <Button
                    onPress={() => changeLanguage('vn')}
                    accessoryRight={props =>
                      VietnamFlag({ ...props, width: 100 })
                    }
                    appearance={'ghost'}
                  />
                  <Text>{t('settings.vietnamese') as string}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Layout.center]}>
                  <Button
                    onPress={() => changeLanguage('en')}
                    accessoryRight={props => USFlag({ ...props, width: 100 })}
                    appearance={'ghost'}
                  />
                  <Text>{t('settings.us') as string}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Divider />
          </View>
        </View>
        <TouchableOpacity
          style={[Layout.fullWidth, Gutters.largeHPadding]}
          onPress={() => handleLogout()}
        >
          <View
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.regularVMargin,
            ]}
          >
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <LogoutIcon
                fill={theme['color-primary-500']}
                style={[styles.icon]}
              />
              <Text style={[Fonts.textSmaller]}>
                {t('settings.logout') as string}
              </Text>
            </View>
          </View>
          <Divider />
        </TouchableOpacity>
      </ScrollView>
    </UILayout>
  )
}
const styleSheet = StyleService.create({
  setting: {
    borderColor: 'border-color-basic-2',
    borderBottomWidth: 1,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
})
export default SettingMenuScreen
