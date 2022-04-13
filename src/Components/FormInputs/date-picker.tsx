import React from 'react'
import { View } from 'react-native'
import { Datepicker, DatepickerProps as DPProps } from '@ui-kitten/components'
import { Control, useController } from 'react-hook-form'

export interface DatePickerProps extends DPProps {
  control: Control<any>
  name: string
}
const yesterday = new Date(1956, 0, 0)
const tomorrow = new Date(2022, 0, 0)
const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = React.useState(initialDate)
  return { date, onSelect: setDate }
}

const DatePicker = (props: DatePickerProps) => {
  const { name, control, label, ...rest } = props

  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  const minMaxPickerState = useDatepickerState()

  return (
    <View>
      <Datepicker
        label={label}
        placeholder="Min / Max"
        min={yesterday}
        max={tomorrow}
        {...minMaxPickerState}
        date={value}
        onSelect={onChange}
        onBlur={onBlur}
        caption={error?.message}
        status={invalid ? 'danger' : 'basic'}
        {...rest}
      />
    </View>
  )
}

export default DatePicker
