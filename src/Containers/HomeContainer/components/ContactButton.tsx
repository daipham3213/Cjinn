import React from 'react'
import { Button } from '@ui-kitten/components'
import {
  AddContactIcon,
  CheckMarkSquare,
  DenySquare,
  PaperPlaneIcon,
  PersonDoneIcon,
} from '@/Components'
import { TouchableOpacity, View } from 'react-native'
import { useAppSelector, useTheme } from '@/Hooks'
import { RootState } from '@/Store'
import { useTranslation } from 'react-i18next'
interface ContactButtonProps {
  onSendRequest: (userId?: string) => void
  onProcessRequest: (isAccept: 'True' | 'False', userId?: string) => void
  userId?: string
  contactStatus?: string
}
const ContactButton = ({
  onProcessRequest,
  onSendRequest,
  userId,
  contactStatus,
}: ContactButtonProps) => {
  const { activeRecord } = useAppSelector((state: RootState) => state.device)

  const { t } = useTranslation()
  const { Layout } = useTheme()

  if (activeRecord?.user.id === userId) {
    return <React.Fragment />
  }
  switch (contactStatus) {
    case 'no_contact':
      return (
        <Button
          appearance={'filled'}
          status={'info'}
          onPress={() => onSendRequest(userId)}
          size={'small'}
          accessoryRight={AddContactIcon}
        >
          {t('home.userinfo.add') as string}
        </Button>
      )
    case 'requested':
      return (
        <Button
          appearance={'filled'}
          status={'basic'}
          size={'small'}
          accessoryRight={PaperPlaneIcon}
        >
          {t('home.userinfo.wait') as string}
        </Button>
      )
    case 'waiting':
      return (
        <View style={[Layout.colCenter, { position: 'relative', top: -15 }]}>
          <Button
            appearance={'filled'}
            status={'success'}
            onPress={() => onProcessRequest('True', userId)}
            size={'small'}
            accessoryRight={CheckMarkSquare}
            style={{ width: 100, marginBottom: 10 }}
          >
            {t('home.userinfo.accept') as string}
          </Button>
          <Button
            appearance={'filled'}
            status={'danger'}
            onPress={() => onProcessRequest('False', userId)}
            size={'small'}
            accessoryRight={DenySquare}
            style={{ width: 100, marginBottom: 10 }}
          >
            {t('home.userinfo.deny') as string}
          </Button>
        </View>
      )

    case 'in_contact':
      return (
        <TouchableOpacity style={[Layout.rowCenter]}>
          <Button
            appearance={'filled'}
            status={'control'}
            // onPress={handleSendRequest}
            size={'small'}
            accessoryRight={PersonDoneIcon}
          >
            {t('home.userinfo.contacted') as string}
          </Button>
        </TouchableOpacity>
      )
    default:
      return <React.Fragment />
  }
}

export default ContactButton
