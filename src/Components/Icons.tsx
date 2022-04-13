import React from 'react'
import { Icon, IconProps } from '@ui-kitten/components'
import { useTheme } from '@/Hooks'
import { Image, ImageProps, View } from 'react-native'

export const MessageIcon = (props: IconProps) => (
  <Icon name="message-circle-outline" {...props} />
)

export const AddContactIcon = (props?: IconProps) => (
  <Icon name="person-add-outline" {...props} />
)

export const SettingIcon = (props: IconProps) => (
  <Icon name="settings-outline" {...props} />
)

export const AddIcon = (props: IconProps) => (
  <Icon name="plus-outline" {...props} />
)

export const BackIcon = (props: IconProps) => (
  <Icon name="arrow-back-outline" {...props} />
)

export const PersonIcon = (props: IconProps) => (
  <Icon name="person-outline" {...props} />
)

export const PersonDoneIcon = (props: IconProps) => (
  <Icon name="person-done-outline" {...props} />
)
export const PaperPlaneIcon = (props: IconProps) => (
  <Icon name="paper-plane-outline" {...props} />
)
export const DarkModeIcon = (props: IconProps) => (
  <Icon name="moon-outline" {...props} />
)

export const GlobeIcon = (props: IconProps) => (
  <Icon name="globe-2-outline" {...props} />
)

export const LogoutIcon = (props: IconProps) => (
  <Icon name="log-out-outline" {...props} />
)

export const SearchIcon = (props: IconProps) => (
  <Icon name={'search-outline'} {...props} />
)

export const MoreIcon = (props: IconProps) => (
  <Icon name={'more-horizontal-outline'} {...props} />
)

export const CheckMark = (props: IconProps) => (
  <Icon name={'checkmark-outline'} {...props} />
)

export const CheckMarkSquare = (props: IconProps) => (
  <Icon name={'checkmark-square-2-outline'} {...props} />
)

export const DenySquare = (props: IconProps) => (
  <Icon name={'close-square-outline'} {...props} />
)

export const DenyIcon = (props: IconProps) => (
  <Icon name={'close-outline'} {...props} />
)

export const PhoneIcon = (props: IconProps) => (
  <Icon name={'phone-outline'} {...props} />
)

export const CameraIcon = (props: IconProps) => (
  <Icon name={'video-outline'} {...props} />
)
export const HardDriveIcon = (props: IconProps) => (
  <Icon name={'hard-drive-outline'} {...props} />
)

export const BookIcon = (props: IconProps) => (
  <Icon name={'book-outline'} {...props} />
)

export const GiftIcon = (props: IconProps) => (
  <Icon name={'gift-outline'} {...props} />
)

export const EmailIcon = (props: IconProps) => (
  <Icon name={'email-outline'} {...props} />
)

export const TrashCanIcon = (props: IconProps) => (
  <Icon name={'trash-2-outline'} {...props} />
)

export const PhoneOffIcon = (props: IconProps) => (
  <Icon name={'phone-off-outline'} {...props} />
)

export const MicIcon = (props: IconProps) => (
  <Icon name={'mic-outline'} {...props} />
)

export const MicOffIcon = (props: IconProps) => (
  <Icon name={'mic-off-outline'} {...props} />
)

export const CameraOffIcon = (props: IconProps) => (
  <Icon name={'video-off-outline'} {...props} />
)

export const LockIcon = (props: any) => <Icon name={'lock'} {...props} />

export const SyncIcon = (props: IconProps) => (
  <Icon name={'sync-outline'} {...props} />
)

export const ImageIcon = (props: IconProps) => (
  <Icon name={'image-outline'} {...props} />
)

// <editor-fold description="Flags">
interface FlagProps extends ImageProps {
  height?: number
  width?: number
  mode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center'
}

export const VietnamFlag = ({
  width = 120,
  height = 70,
  mode = 'contain',
}: Partial<FlagProps>) => {
  const { Layout, Images } = useTheme()
  return (
    <View style={{ height, width }}>
      <Image
        style={Layout.fullSize}
        source={Images.vietnamFlag}
        resizeMode={mode}
      />
    </View>
  )
}

export const USFlag = ({
  width = 120,
  height = 70,
  mode = 'contain',
}: Partial<FlagProps>) => {
  const { Layout, Images } = useTheme()
  return (
    <View style={{ height, width }}>
      <Image style={Layout.fullSize} source={Images.usFlag} resizeMode={mode} />
    </View>
  )
}
// </editor-fold>
