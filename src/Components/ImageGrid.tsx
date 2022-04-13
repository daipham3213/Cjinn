import React from 'react'
import {
  Image,
  StyleProp,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native'
import {
  Layout as View,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import { Media } from '@/Store/SignalStore/type'
import _ from 'lodash'

interface Props {
  imagePerRow?: number
  onItemPress?: (index: number) => void
  style?: StyleProp<ViewStyle>
  media: Media[]
}

const ImageGrid = ({ imagePerRow, media, onItemPress, style }: Props) => {
  const { width } = useWindowDimensions()
  const styles = useStyleSheet(styleSheet)

  const calculatedSize = (value: number) => {
    let size = (width * 0.7) / value
    return { width: size, height: size }
  }

  const renderRow = (items: Media[], size: number, row: number) => {
    const getIndex = (i: number) =>
      (row + 1) * (imagePerRow ?? 3) + i - (imagePerRow ?? 3)

    return items.map((item, i) => {
      return (
        <TouchableOpacity
          key={i}
          onPress={() => onItemPress && onItemPress(getIndex(i))}
        >
          <Image
            style={[styles.item as any, calculatedSize(size)]}
            source={{ uri: item.uri }}
          />
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={[styles.container, style]}>
      {media.length > 1 ? (
        _.chunk(media, imagePerRow).map((item, i, array) => (
          <View key={i} style={styles.row}>
            {renderRow(item, array[i].length, i)}
          </View>
        ))
      ) : (
        <TouchableOpacity onPress={() => onItemPress && onItemPress(0)}>
          <Image
            source={{ uri: media[0].uri }}
            style={[styles.item as any, calculatedSize(2)]}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styleSheet = StyleService.create({
  row: {
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 1,
    borderRadius: 5,
  },
  item: {
    margin: 2,
    borderRadius: 5,
  },
})

ImageGrid.defaultProps = {
  imagePerRow: 3,
  onItemPress: () => {},
  style: {},
}
export default ImageGrid
