import React from 'react'
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastConfig,
} from 'react-native-toast-message'
import { StyleService, useStyleSheet } from '@ui-kitten/components'
import useTheme from './useTheme'

const useToastConfig = (): ToastConfig => {
  const { darkMode } = useTheme()
  const styles = useStyleSheet(styleSheet(darkMode))

  return {
    success: params => (
      <SuccessToast
        {...params}
        style={styles.success}
        text1NumberOfLines={1}
        text1Style={styles.text1}
        text2NumberOfLines={3}
        text2Style={styles.text2}
      />
    ),
    warning: params => (
      <BaseToast
        {...params}
        style={styles.warning}
        text1NumberOfLines={1}
        text1Style={styles.text1}
        text2NumberOfLines={3}
        text2Style={styles.text2}
      />
    ),
    info: params => (
      <InfoToast
        {...params}
        style={styles.info}
        text1NumberOfLines={1}
        text1Style={styles.text1}
        text2NumberOfLines={3}
        text2Style={styles.text2}
      />
    ),
    error: params => (
      <ErrorToast
        {...params}
        style={styles.error}
        text1NumberOfLines={1}
        text1Style={styles.text1}
        text2NumberOfLines={3}
        text2Style={styles.text2}
      />
    ),
  }
}
const styleSheet = (darkMode: boolean) =>
  StyleService.create({
    text1: {
      fontSize: 13,
      fontWeight: 'bold',
      ...(darkMode && { color: 'white' }),
    },
    text2: {
      fontSize: 12,
      ...(darkMode && { color: 'white' }),
    },
    success: darkMode
      ? { borderColor: '#348215', backgroundColor: '#222B45' }
      : { borderColor: '#B0ED15', backgroundColor: '#F7F9FC' },
    warning: darkMode
      ? { borderColor: '#DBAA00', backgroundColor: '#222B45' }
      : { borderColor: '#FFDC3F', backgroundColor: '#F7F9FC' },
    info: darkMode
      ? { borderColor: '#0065B7', backgroundColor: '#222B45' }
      : { borderColor: '#00AEFF', backgroundColor: '#F7F9FC' },
    error: darkMode
      ? { borderColor: '#B71839', backgroundColor: '#222B45' }
      : { borderColor: '#FF3037', backgroundColor: '#F7F9FC' },
  })
export default useToastConfig
