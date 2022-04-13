import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Icon, IconProps, Input, InputProps } from '@ui-kitten/components'
import { Control, useController } from 'react-hook-form'

const AlertIcon = (props: IconProps) => (
  <Icon {...props} name="alert-circle-outline" />
)

export interface PasswordFieldProps extends InputProps {
  name: string
  control: Control<any>
  label?: string
}

const PasswordField = (props: PasswordFieldProps) => {
  const { name, control, label, ...rest } = props
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  const [secureTextEntry, setSecureTextEntry] = React.useState(true)

  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry)

  const renderIcon = (p: IconProps) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...p} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  )

  return (
    <View>
      <Input
        value={value}
        label={label ?? 'Password'}
        onChange={onChange}
        onBlur={onBlur}
        onChangeText={onChange}
        caption={error?.message}
        accessoryRight={renderIcon}
        secureTextEntry={secureTextEntry}
        ref={ref}
        status={invalid ? 'danger' : 'basic'}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
})

export default PasswordField
