import React from 'react'
import { Control, useController } from 'react-hook-form'
import { Input, InputProps } from '@ui-kitten/components'
import { View } from 'react-native'

export interface InputFieldProps extends InputProps {
  name: string
  control: Control<any>
  label?: string
}

const InputField = (props: InputFieldProps) => {
  const { name, control, label, ...rest } = props
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  return (
    <View>
      <Input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onChangeText={onChange}
        label={label}
        ref={ref}
        status={invalid ? 'danger' : 'basic'}
        caption={error?.message}
        {...rest}
      />
    </View>
  )
}

export default InputField
