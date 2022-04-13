import React, { useContext } from 'react'
import { BackHandler, TouchableOpacity, View } from 'react-native'
import {
  Button,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import { useAppDispatch, useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { useTranslation } from 'react-i18next'
import OtpInputs, { OtpInputsRef } from 'react-native-otp-inputs'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { AuthContext } from '@/Containers/AuthContainer/AuthContext'
import { deviceActions } from '@/Store'

const styleSheet = StyleService.create({
  inputBox: {
    width: 50,
    height: 50,
    borderColor: 'color-primary-500',
    borderWidth: 1,
    borderRadius: 5,

    margin: 5,
  },
  input: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

const VerifyTokenScreen = () => {
  const dispatch = useAppDispatch()

  const { Layout, Gutters, Fonts } = useTheme()
  const { tokenId, goBack, state } = useContext(AuthContext)
  const { t } = useTranslation()
  const styles = useStyleSheet(styleSheet)

  const otpRef = React.useRef<OtpInputsRef>()
  const [s, setS] = React.useState<string>()

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      if (state !== 'login') {
        goBack()
        return true
      }
      return false
    })
  })

  const handleNavigate = () => {
    dispatch(deviceActions.resendOtpAction({ pk: tokenId }))
  }

  const handleSubmit = () => {
    // Getting values
    dispatch(deviceActions.accountVerificationAction({ pk: tokenId, otp: s }))
    otpRef.current?.reset()
  }

  return (
    <View style={[Layout.fullSize, Layout.column, Layout.alignItemsCenter]}>
      <View style={[Layout.alignItemsCenter]}>
        <Brand />
        <Text
          style={[Fonts.titleSmall, Fonts.textCenter, Gutters.regularVMargin]}
        >
          {t('auth.verify') as string}
        </Text>
        <View style={[Layout.fill]}>
          <OtpInputs
            ref={otpRef as any}
            handleChange={code => setS(code)}
            numberOfInputs={6}
            autofillFromClipboard={false}
            inputContainerStyles={styles.inputBox}
            inputStyles={styles.input}
            textAlign={'center'}
          />
          <Text
            style={[Fonts.textCenter, Gutters.regularBMargin]}
            appearance="hint"
          >
            {t('auth.wait', { seconds: 30 }) as string}
          </Text>
          <View style={[Layout.fill]}>
            <Button status={'primary'} onPress={handleSubmit}>
              {t('auth.submit') as string}
            </Button>
            <TouchableOpacity onPress={handleNavigate}>
              <Text style={[Fonts.textCenter, Gutters.largeTMargin]}>
                {t('auth.reSendOtp') as string}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default VerifyTokenScreen
