import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Layout as UILayout, Text } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { setDefaultTheme } from '@/Store/Theme'
import { deviceActions, RootState } from '@/Store'

const StartupContainer = () => {
  const dispatch = useAppDispatch()
  const { isAuth, loadingState, activeRecord } = useAppSelector(
    (state: RootState) => state.device,
  )

  const { Layout, Gutters, Fonts } = useTheme()
  const { t } = useTranslation()

  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true)
      }, 2000),
    )
    await setDefaultTheme({ theme: 'default', darkMode: null })
    if (isAuth && activeRecord) {
      dispatch(deviceActions.initialActions())
    } else {
      navigateAndSimpleReset('Auth')
    }
  }

  useEffect(() => {
    init().catch(error => console.error(error))
  }, [])

  return (
    <UILayout style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      <Text style={Fonts.textCenter}>
        {t(loadingState ?? 'welcome') as string}
      </Text>
    </UILayout>
  )
}

export default StartupContainer
