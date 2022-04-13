import { ThemeImages, ThemeVariables } from '@/Theme/theme.type'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({}: ThemeVariables): ThemeImages {
  return {
    logo: require('@/Assets/Images/app-logo.png'),
    vietnamFlag: require('@/Assets/Images/vietnam.png'),
    usFlag: require('@/Assets/Images/united-states.png'),
  }
}
