import React from 'react'
import { Button, Layout as View, Modal, Text } from '@ui-kitten/components'
import { useAppDispatch, useAppSelector, useTheme } from '@/Hooks'
import { LoadingIndicator, PasswordField } from '@/Components'
import * as yup from 'yup'
import { passwordRegExp } from '@/Config'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { deviceActions, modalActions, RootState } from '@/Store'

const ChangePasswordModal = () => {
  const dispatch = useAppDispatch()
  const { changePassword } = useAppSelector((state: RootState) => state.modals)

  const { Layout, Gutters } = useTheme()
  const { t } = useTranslation()

  const handleToggle = () => {
    dispatch(modalActions.toggleChangePassword({ data: {} }))
  }

  const schema = yup.object().shape({
    password: yup.string().matches(passwordRegExp, t('errors.invalidPassword')),
    passwordOld: yup.string(),
    confirmPassword: yup
      .string()
      .matches(passwordRegExp, t('errors.notMatchPassword')),
  })

  const onSubmit = (values: any) => {
    const passwordOld =
      changePassword.data?.currentPassword &&
      changePassword.data.currentPassword
    const oldValue = passwordOld ? passwordOld : values.passwordOld
    if (oldValue) {
      dispatch(
        deviceActions.changePasswordAction({
          passwordNew: values.password,
          passwordOld: oldValue,
        }),
      )
    }
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    password: string
    confirmPassword: string
    passwordOld?: string
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      passwordOld: undefined,
    },
  })

  return (
    <Modal
      backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      style={{ height: 'auto', width: '80%' }}
      visible={changePassword.isShow ?? false}
    >
      <View
        style={[
          Layout.fill,
          Gutters.regularVPadding,
          Gutters.regularHPadding,
          Layout.alignItemsCenter,
          { borderRadius: 10 },
        ]}
      >
        <View>
          <Text style={Gutters.smallBMargin}>Change Password</Text>
        </View>
        <View style={{ width: '100%' }}>
          {!changePassword.data.currentPassword && (
            <PasswordField
              name={'passwordOld'}
              control={control}
              label={t('auth.passwordOld')}
              style={[Gutters.regularBMargin]}
            />
          )}
          <PasswordField
            style={[Gutters.regularBMargin]}
            name={'password'}
            control={control}
            label={t('auth.password')}
          />
          <PasswordField
            style={[Gutters.regularBMargin]}
            name={'confirmPassword'}
            control={control}
            label={t('auth.confirmPassword')}
          />
          <View style={[Layout.rowCenter]}>
            <Button
              size={'medium'}
              onPress={handleSubmit(onSubmit)}
              accessoryRight={() =>
                LoadingIndicator({ isLoading: isSubmitting })
              }
            >
              {t('auth.submit') as string}
            </Button>
            <Button
              onPress={handleToggle}
              status={'danger'}
              style={Gutters.smallLMargin}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ChangePasswordModal
