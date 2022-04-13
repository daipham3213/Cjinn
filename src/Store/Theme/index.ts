import { createSlice } from '@reduxjs/toolkit'

export type ThemeState = {
  theme: 'default' | null | undefined
  darkMode: boolean | null | undefined
}

type ThemePayload = {
  payload: {
    theme: 'default' | null | undefined
    darkMode: boolean | null | undefined
  }
}

const slice = createSlice({
  name: 'theme',
  initialState: { theme: null, darkMode: null },
  reducers: {
    changeTheme: (
      state: ThemeState,
      { payload: { theme, darkMode } }: ThemePayload,
    ) => {
      if (typeof theme !== 'undefined') {
        state.theme = theme
      }
      if (typeof darkMode !== 'undefined') {
        state.darkMode = darkMode
      }
    },
    setDefaultTheme: (
      state: ThemeState,
      { payload: { theme, darkMode } }: ThemePayload,
    ) => {
      if (!state.theme) {
        state.theme = theme
        state.darkMode = darkMode
      }
    },
  },
})

export const { changeTheme, setDefaultTheme } = slice.actions

export default slice.reducer
