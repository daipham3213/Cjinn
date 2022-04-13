import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Spinner } from '@ui-kitten/components'
import { SpinnerProps } from '@ui-kitten/components/ui/spinner/spinner.component'

export interface LoadingIndicatorProps {
  style?: ViewStyle
  spinnerProps?: SpinnerProps
  isLoading?: boolean
}

const LoadingIndicator = (props: LoadingIndicatorProps) =>
  props.isLoading ? (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" {...props.spinnerProps} />
    </View>
  ) : (
    <React.Fragment />
  )

const styles = StyleSheet.create({
  button: {
    margin: 2,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LoadingIndicator
