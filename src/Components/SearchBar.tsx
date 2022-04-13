import React from 'react'
import { View } from 'react-native'
import {
  Avatar,
  Button,
  ButtonGroup,
  Input,
  Layout as UILayout,
  Text,
} from '@ui-kitten/components'
import { useAppSelector, useTheme } from '@/Hooks'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/Store'
import { AddContactIcon, BookIcon, SearchIcon } from '@/Components/Icons'

interface Props {
  onAddContactPress: () => void
  onContactsPress: () => void
  onInputChange: (input: string) => void
}

const SearchBar = (props: Props) => {
  const { Gutters, Fonts, Layout, Images } = useTheme()
  const { activeRecord: record } = useAppSelector(
    (state: RootState) => state.device,
  )
  const { t } = useTranslation()
  const [input, setInput] = React.useState('')

  const onInputChange = (e: any) => {
    setInput(e)
    onInputChange(e)
  }

  return (
    <UILayout style={[Layout.fullWidth, Gutters.regularVPadding]}>
      <View
        style={[
          Layout.row,
          Layout.alignItemsCenter,
          Gutters.smallVPadding,
          Layout.justifyContentBetween,
        ]}
      >
        <View style={[Layout.row, Layout.alignItemsCenter]}>
          <Avatar
            shape="rounded"
            source={
              record?.user.avatar ? { uri: record?.user?.avatar } : Images.logo
            }
          />
          <Text
            style={[
              Fonts.textSmall,
              Gutters.smallHMargin,
              { fontWeight: 'bold' },
            ]}
          >
            {t('searchbar.heading') as any}
          </Text>
        </View>
        <ButtonGroup appearance="ghost" size="large">
          <Button
            accessoryLeft={BookIcon}
            onPress={() => props.onContactsPress()}
          />
          <Button
            accessoryLeft={AddContactIcon}
            onPress={() => props.onAddContactPress()}
          />
        </ButtonGroup>
      </View>
      <Input
        value={input}
        onChangeText={onInputChange}
        style={[Gutters.smallHMargin]}
        accessoryRight={SearchIcon}
        placeholder={t('searchbar.placeholder')}
        label={t('searchbar.title') as any}
      />
    </UILayout>
  )
}

export default SearchBar
