import {
  GestureResponderEvent,
  Pressable,
  TouchableOpacityProps,
} from 'react-native'
import {
  Layout as View,
  StyleService,
  useStyleSheet,
  useTheme as useUITheme,
} from '@ui-kitten/components'
import { useTheme } from '@/Hooks'
import React from 'react'
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { AddIcon, LockIcon } from '@/Components/Icons'
import { StrokeProps } from 'react-native-svg/lib/typescript/lib/extract/types'
import { useFocusEffect } from '@react-navigation/native'

export interface AnimatedButtonProps extends TouchableOpacityProps {
}

const CIRCLE_LENGTH = 180
const R = CIRCLE_LENGTH / (2 * Math.PI)
const STROKE_WIDTH = 0.01 * CIRCLE_LENGTH
const CX = CIRCLE_LENGTH / 6

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const ReanimatedPressable = Animated.createAnimatedComponent(Pressable)

const AnimatedButton = ({
  onPress,
  onLongPress,
  ...props
}: AnimatedButtonProps) => {
  const styles = useStyleSheet(styleSheet)
  const { Layout } = useTheme()
  const theme = useUITheme()
  const [isLongPress, setIsLongPress] = React.useState(false)
  useFocusEffect(() => {
    setIsLongPress(false)
  })

  const offset = useSharedValue(0)
  const percent = useSharedValue(0)
  const pressed = useSharedValue(false)

  const uas = useAnimatedStyle(() => {
    const scale = withTiming(!pressed.value ? 1 : 1.2, { duration: 1500 })
    return {
      translateY: withSpring(offset.value, {
        damping: 20,
        stiffness: 90,
      }),
      transform: [{ scale: scale }],
    }
  })
  const pressableOnLongPress = React.useCallback(
    async (event: GestureResponderEvent) => {
      offset.value = -10
      setIsLongPress(true)
      onLongPress && onLongPress(event)
    },
    [offset, onLongPress],
  )

  const pressOut = React.useCallback(async () => {
    offset.value = 0
    pressed.value = false
    percent.value = 0
  }, [offset, percent])

  const onPresIn = React.useCallback(async () => {
    pressed.value = true
    percent.value = withTiming(1, { duration: 1000 })
  }, [percent])

  const animatedProps = useAnimatedProps<StrokeProps>(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - percent.value),
    strokeWidth: percent.value * 4 - STROKE_WIDTH,
  }))

  return (
    <Animated.View style={[uas, styles.container]}>
      <ReanimatedPressable
        style={[Layout.center, styles.button]}
        onPress={onPress}
        onPressIn={onPresIn}
        onLongPress={pressableOnLongPress}
        onPressOut={pressOut}
        delayLongPress={1000}
      >
        <Svg>
          <Circle
            cx={CX}
            cy={CX}
            r={R}
            stroke={'grey'}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            cx={CX}
            cy={CX}
            r={R}
            stroke={theme['color-primary-500']}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={animatedProps}
          />
        </Svg>
        <View style={styles.icon}>
          {isLongPress ? (
            <LockIcon {...props} animation="pulse" />
          ) : (
            <AddIcon {...props} animation="pulse" />
          )}
        </View>
      </ReanimatedPressable>
    </Animated.View>
  )
}

const styleSheet = StyleService.create({
  button: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
  },
  container: {
    position: 'absolute',
    backgroundColor: 'background-basic-color-1',
    borderRadius: CIRCLE_LENGTH / 4 + STROKE_WIDTH,
    bottom: 15,
    width: CIRCLE_LENGTH / 3 + STROKE_WIDTH,
    height: CIRCLE_LENGTH / 3 + STROKE_WIDTH,
  },
})

export default AnimatedButton
