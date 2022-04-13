import React from 'react'
import Carousel from 'react-native-snap-carousel'
import { Image, useWindowDimensions } from 'react-native'
import { Button, Layout as View } from '@ui-kitten/components'

interface CarouselProps {
  data: string[]
  onItemRemove: (index: number) => void
  onCancel: () => void
}

const ImageCarousel = (props: CarouselProps) => {
  const { width, height } = useWindowDimensions()
  const { data, onCancel, onItemRemove } = props

  const renderMedia = ({ item, index }: any) => (
    <View
      style={{
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
      }}
    >
      <Button
        style={{
          position: 'absolute',
          right: -5,
          top: -5,
          zIndex: 1,
        }}
        size={'tiny'}
        status={'basic'}
        appearance={'ghost'}
        onPress={() => onItemRemove(index)}
      >
        X
      </Button>
      <Image
        style={{
          width: height * 0.1,
          height: height * 0.1,
        }}
        source={{ uri: item }}
        resizeMode={'contain'}
      />
    </View>
  )

  return (
    <View style={{ alignItems: 'flex-end' }}>
      <View style={{ width: 50 }}>
        <Button onPress={onCancel} appearance={'ghost'} size={'tiny'}>
          X
        </Button>
      </View>
      <Carousel
        data={data}
        renderItem={renderMedia}
        sliderWidth={width}
        itemWidth={height * 0.1 + 5}
      />
    </View>
  )
}

export default ImageCarousel
