import React from 'react'
import { Layout as View } from '@ui-kitten/components/ui/layout/layout.component'
import {
  Avatar,
  Button,
  ButtonGroup,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
import { BackIcon, CameraIcon, MoreIcon, PhoneIcon } from '@/Components/Icons'
import { useAppDispatch, useTheme } from '@/Hooks'
import { navigate } from '@/Navigators/utils'

interface Props {
  name?: string
  icon?: string
  onBackPress: () => void
  onVideoCallPress: () => void
}

export default ({ name, icon, onBackPress, onVideoCallPress }: Props) => {
  const { Layout, Images, Gutters } = useTheme()

  const renderBackAction = (props: any): React.ReactElement => (
    <View style={[Layout.rowCenter]}>
      <TopNavigationAction
        onPress={onBackPress}
        icon={<BackIcon />}
        {...props}
      />
      <Avatar
        source={icon ? { uri: icon } : Images.logo}
        size={'large'}
        style={Gutters.smallHMargin}
      />
    </View>
  )

  const handleNavigate = () => {
    navigate('Call', {})
  }

  const renderRightButtons = (props: any) => (
    <ButtonGroup size={'small'} appearance={'ghost'} {...props}>
      <Button onPress={handleNavigate} accessoryLeft={PhoneIcon} {...props} />
      <Button
        onPress={onVideoCallPress}
        accessoryLeft={CameraIcon}
        {...props}
      />
      <Button accessoryLeft={MoreIcon} {...props} />
    </ButtonGroup>
  )
  return (
    <TopNavigation
      title={eve => (
        <View {...eve}>
          <Text category={'s2'}>{name}</Text>
          <Text category={'c2'} appearance={'hint'}>
            Online
          </Text>
        </View>
      )}
      accessoryLeft={renderBackAction}
      accessoryRight={renderRightButtons}
    />
  )
}
