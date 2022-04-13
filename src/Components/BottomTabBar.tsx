import {
  BottomNavigation,
  BottomNavigationTab,
  Layout as View,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedButton, MessageIcon, SettingIcon } from '@/Components'
import { navigate } from '@/Navigators/utils'
import TestButton from '@/Components/TestButton'

const styleSheet = StyleService.create({
  barBorder: {
    borderColor: 'border-basic-color-5',
    borderStyle: 'solid',
    borderWidth: 0.3,
  },
})

const BottomTabBar = (props?: any) => {
  const { navigation, state } = props
  const { t } = useTranslation()

  const styles = useStyleSheet(styleSheet)

  const handleNavigate = (index: number) => {
    const value = [0, -1, 1]
    if (value[index] > -1) {
      navigation && navigation.navigate(state.routeNames[value[index]])
    }
  }
  React.useEffect(() => {}, [props])
  const renderMiddle = (p: any) => (
    <AnimatedButton
      radius={30}
      onPress={() =>
        navigate('Conversation', {
          screen: 'AddConversation',
          params: {
            isEncrypt: false,
          },
        })
      }
      onLongPress={() =>
        navigate('Conversation', {
          screen: 'AddConversation',
          params: {
            isEncrypt: true,
          },
        })
      }
      {...p}
    />
  )
  return (
    <View style={styles.barBorder}>
      <BottomNavigation
        appearance="noIndicator"
        selectedIndex={state.index === 1 ? 2 : 0}
        onSelect={index => handleNavigate(index)}
      >
        <BottomNavigationTab
          title={t('containers.conversations') as string}
          icon={MessageIcon}
        />
        <BottomNavigationTab icon={renderMiddle} />
        <BottomNavigationTab
          title={t('containers.setting') as string}
          icon={SettingIcon}
        />
      </BottomNavigation>
    </View>
  )
}

export default BottomTabBar
