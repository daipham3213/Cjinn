import React, { Component } from 'react'
import Animated from 'react-native-reanimated'
import { TapGestureHandler } from 'react-native-gesture-handler'
import {
  Layout as View,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import { Circle } from 'react-native-svg/src/index'
import { FlatList, StyleSheet } from "react-native";

const CIRCLE_LENGTH = 100
const R = CIRCLE_LENGTH / (2 * Math.PI)
const STROKE_WIDTH = 5

const { Value, event } = Animated

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default class TestButton extends Component {
  gestureState = new Value(-1)
  onStateChange = event([
    {
      nativeEvent: { state: this.gestureState },
    },
  ])
  render() {
    return (
      <View>
        <TapGestureHandler>
          <Animated.View style={[styles.circle]} />
          <FlatList data={} renderItem={}
        </TapGestureHandler>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    width: (CIRCLE_LENGTH + STROKE_WIDTH) / 2,
    height: (CIRCLE_LENGTH + STROKE_WIDTH) / 2,
    borderRadius: CIRCLE_LENGTH / 4 + STROKE_WIDTH,
    backgroundColor: '#000000',
  },
})
