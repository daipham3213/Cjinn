import React from 'react'
import {
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import {
  Button,
  Layout as View,
  Modal,
  Text,
  TopNavigation,
} from '@ui-kitten/components'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Media } from '@/Store/SignalStore/type'
import { BackIcon } from '@/Components'

interface ImageViewProps {
  data: Media[]
  startPosition?: number
  isShow: boolean
  setShow: (value: boolean) => void
}

export const ImageViewerModal = ({
  data,
  startPosition,
  isShow,
  setShow,
}: ImageViewProps) => {
  let ref = React.useRef<Carousel<Media> | undefined>()
  const [active, setActive] = React.useState<number>()
  const [progress, setProgress] = React.useState<number>(0)
  const { width } = useWindowDimensions()

  React.useEffect(() => {
    if (startPosition) {
      setActive(startPosition)
    }
  }, [startPosition, data])

  React.useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setShow(false)
        return true
      },
    )
    return () => unsubscribe.remove()
  })

  const renderItem = (item: Media, index: number) => (
    <TouchableOpacity
      onPress={() => ref.current?.snapToItem(index)}
      key={index}
      style={[styles.color]}
    >
      <Image
        style={{ width: 70, height: 70 }}
        source={{ uri: item.uri }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  )

  const renderBackButton = () => {
    const handleClose = () => setShow(false)
    return (
      <Button
        style={{ margin: 10 }}
        accessoryLeft={BackIcon}
        appearance={'ghost'}
        onPress={handleClose}
      />
    )
  }

  const Dots = () => {
    return (
      <Pagination
        dotsLength={data.length}
        activeDotIndex={active ?? 0}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
          width: 7,
          height: 7,
          borderRadius: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  return (
    <Modal style={styles.container} visible={isShow}>
      <View style={[styles.color, { height: '100%' }]}>
        <TopNavigation
          accessoryLeft={renderBackButton}
          style={[styles.color]}
        />
        <View style={[styles.color, { height: '100%' }]}>
          <Image
            style={{
              width: '100%',
              resizeMode: 'contain',
              aspectRatio: 1,
            }}
            onProgress={({ nativeEvent: { loaded, total } }) =>
              setProgress(loaded / total)
            }
            source={{ uri: data[active ?? 0].uri }}
            resizeMode="contain"
          />
        </View>
        {progress < 1 ? <Text>{`${progress * 100}%`}</Text> : null}
        <View style={[styles.color, styles.carousel]}>
          <Carousel
            data={data}
            renderItem={({ item, index }) => renderItem(item, index)}
            onSnapToItem={setActive}
            sliderWidth={width}
            ref={ref as any}
            itemWidth={80}
          />
          <Dots />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  color: {
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
  },
  image: {
    height: '100%',
  },
})

ImageViewerModal.defaultProps = {
  startPosition: 0,
}
