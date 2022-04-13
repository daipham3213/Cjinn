import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppInfoService } from '@/Services/utils/appInfo'
import OtpInputs from 'react-native-otp-inputs'
import Toast from 'react-native-toast-message'
import {
  Button,
  Layout as UILayout,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'

import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { InputField, LoadingIndicator, PasswordField } from '@/Components'
import { passwordRegExp } from '@/Config'
import { deviceActions } from '@/Store/DeviceStore'
import { RootState } from '@/Store'
import { modalActions } from '@/Store/ModalStore/slice'

interface VerifyDeviceProps {
  deviceName: string
  password: string
  otp: string
}
const useVerifyDeviceModal = () => {
  const dispatch = useAppDispatch()
  const { verifyDevice } = useAppSelector((state: RootState) => state.modals)

  const { verifyDeviceAction } = deviceActions
  const { toggleVerifyDevice } = modalActions

  const { t } = useTranslation()
  const { Layout, Gutters, Fonts } = useTheme()
  const styles = useStyleSheet(styleSheet)

  const [otp, setOtp] = React.useState('')
  const isShow = verifyDevice.isShow

  const toggle = (props: { registrationId?: number }) => {
    if (props.registrationId) {
      dispatch(
        toggleVerifyDevice({ data: { registrationId: props.registrationId } }),
      )
    } else {
      dispatch(toggleVerifyDevice({}))
    }
  }

  const schema = yup.object().shape({
    deviceName: yup.string().required(t('errors.required')),
    password: yup.string().matches(passwordRegExp, t('errors.invalidPassword')),
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<VerifyDeviceProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      deviceName: AppInfoService.getDeviceName(),
      password: '',
    },
  })

  const handleVerify = (values: VerifyDeviceProps) => {
    const registrationId = verifyDevice.data?.registrationId
    if (registrationId && registrationId > 0) {
      dispatch(
        verifyDeviceAction({
          args: {
            ...values,
            registrationId: registrationId + '',
          },
        }),
      )
    }
  }

  const onSubmit = (values: VerifyDeviceProps) => {
    const registrationId = verifyDevice.data?.registrationId ?? 0
    if (otp.length === 6 && registrationId > 0) {
      values.otp = otp
      // Submit data
      handleVerify(values)
    } else {
      Toast.show({
        type: 'error',
        text1: t('errors.invalidInput'),
        text2: t('errors.invalidOtp'),
      })
    }
  }

  const renderModal = () => {
    return (
      <UILayout
        style={[
          Layout.fill,
          Gutters.regularVPadding,
          Gutters.regularHPadding,
          Layout.alignItemsCenter,
          { borderRadius: 10 },
        ]}
      >
        <View style={[Layout.fullWidth, Layout.alignItemsCenter]}>
          <Text category={'c1'} style={[Fonts.titleSmaller]}>
            {t('modal.verifyDevice') as string} 📱
          </Text>
        </View>
        <View style={[Layout.fullWidth]}>
          <InputField
            style={[Gutters.regularBMargin]}
            name={'deviceName'}
            control={control}
            label={t('modal.deviceName')}
          />
          <PasswordField
            style={[Gutters.regularBMargin]}
            name={'password'}
            control={control}
            label={t('auth.password')}
          />
          <Text
            appearance={'hint'}
            category={'p2'}
            style={Gutters.smallBMargin}
          >
            {t('modal.otpCode') as string}
          </Text>
          <OtpInputs
            handleChange={otpCode => setOtp(otpCode)}
            style={[Gutters.regularBMargin, Layout.row]}
            autofillFromClipboard={false}
            numberOfInputs={6}
            inputContainerStyles={[styles.inputBox]}
            inputStyles={styles.input}
            textAlign={'center'}
          />
          <Button
            size={'medium'}
            onPress={handleSubmit(onSubmit)}
            accessoryRight={() => LoadingIndicator({ isLoading: isSubmitting })}
          >
            {t('auth.submit') as string}
          </Button>
        </View>
      </UILayout>
    )
  }
  return { isShow, toggle, renderModal }
}

const styleSheet = StyleService.create({
  inputBox: {
    width: 40,
    height: 40,
    borderColor: 'color-primary-500',
    borderWidth: 1,
    borderRadius: 5,

    margin: 5,
  },
  input: {
    textAlign: 'center',
    fontSize: 15,
    // fontWeight: 'bold',
  },
})

export default useVerifyDeviceModal
