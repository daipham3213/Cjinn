import React from 'react'
import { Control, useController } from 'react-hook-form'
import {
  IndexPath,
  Select,
  SelectItem,
  SelectItemProps,
} from '@ui-kitten/components'
import { Text, View } from 'react-native'

export interface SelectOption {
  title: string
  props?: SelectItemProps
}

export interface SelectFieldProps {
  name: string
  control: Control<any>
  label?: string
  disabled?: boolean
  options: SelectOption[]
}
const SelectField = (props: SelectFieldProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0))
  const { label, name, control, options, ...rest } = props
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  const displayValue = options[selectedIndex.row]

  return (
    <View>
      <Select
        status={invalid ? 'danger' : 'basic'}
        caption={error?.message}
        onBlur={onBlur}
        label={label ?? 'Select'}
        value={displayValue.title ?? 'NULL'}
        selectedIndex={selectedIndex}
        onSelect={(p: any) => {
          onChange(p.row)
          setSelectedIndex(p)
          console.log('Value selected: ', value)
        }}
        {...rest}
      >
        {options.map((obj, index) => (
          <SelectItem title={obj.title} key={index} {...props} />
        ))}
      </Select>
      <Text>{error?.message}</Text>
    </View>
  )
}

export default SelectField
