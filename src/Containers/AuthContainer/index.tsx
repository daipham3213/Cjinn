import React from 'react'
import { BackHandler } from 'react-native'
import { AuthContext, useAuthContext } from './AuthContext'
import { Layout as UILayout, Modal } from '@ui-kitten/components'
import { useTheme } from '@/Hooks'
import LoginScreen from '@/Containers/AuthContainer/LoginScreen'
import RegisterScreen from '@/Containers/AuthContainer/RegisterScreen'
import VerifyTokenScreen from '@/Containers/AuthContainer/VerifyTokenScreen'
import ForgotPasswordScreen from '@/Containers/AuthContainer/ForgotPasswordScreen'
import ChangePasswordModal from '@/Components/Modals/ChangePasswordModal'
import useVerifyDeviceModal from '@/Components/Modals/VerifyDeviceModal'

const AuthPage = ({ route }: any) => {
  const { state, ...rest } = useAuthContext()
  const value = { state, ...rest }
  const { Layout, Gutters } = useTheme()
  const { isShow, renderModal } = useVerifyDeviceModal()
  React.useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        if (state !== 'login') {
          rest.goBack()
          return true
        }
        return false
      },
    )
    return () => unsubscribe.remove()
  })

  React.useEffect(() => {
    const handleSwitch = () => {
      const { state: val, tokenId } = route?.params
      switch (val) {
        case 'login':
          rest.switchToLogin()
          break
        case 'register':
          rest.switchToRegister()
          break
        case 'verify':
          rest.switchToVerify(tokenId)
          break
      }
    }
    console.log(route, 'received')
    if (route?.params?.state) {
      handleSwitch()
    }
  }, [route, state])

  return (
    <AuthContext.Provider value={value}>
      <UILayout
        style={[
          Layout.fill,
          Layout.colCenter,
          Layout.fullWidth,
          Gutters.smallVPadding,
          Gutters.smallHPadding,
        ]}
      >
        <Modal
          backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          style={{ width: '80%', height: 'auto' }}
          visible={isShow}
        >
          {renderModal()}
        </Modal>
        <ChangePasswordModal />
        {state === 'login' && <LoginScreen />}
        {state === 'register' && <RegisterScreen />}
        {state === 'verify' && <VerifyTokenScreen />}
        {state === 'forgot' && <ForgotPasswordScreen />}
      </UILayout>
    </AuthContext.Provider>
  )
}

export default AuthPage
