import React from 'react'
import { Layout as UILayout, Modal, Text } from '@ui-kitten/components'
import { LoadingIndicator } from '@/Components'
import { useAppSelector, useTheme } from '@/Hooks'
import { RootState } from '@/Store'
import { useTranslation } from 'react-i18next'

const LoadingOverlay = () => {
  const { Layout, Gutters } = useTheme()
  const { t } = useTranslation()

  const { loading } = useAppSelector((state: RootState) => state.modals)

  return (
    <Modal
      backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      style={{ height: 'auto', width: 'auto' }}
      visible={loading.isShow}
    >
      <UILayout
        style={[
          Layout.fill,
          Gutters.regularVPadding,
          Gutters.regularHPadding,
          Layout.alignItemsCenter,
          { borderRadius: 10 },
        ]}
      >
        <LoadingIndicator isLoading={true} spinnerProps={{ size: 'large' }} />
      </UILayout>
      <Text
        appearance={'alternative'}
        style={[Gutters.regularVMargin]}
        numberOfLines={3}
      >
        {t('modal.loading', { message: loading.message ?? '' }) as string}
      </Text>
    </Modal>
  )
}

export default LoadingOverlay
