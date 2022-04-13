import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MemberProps {
  id: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string | null
}

interface Props {
  available: boolean
  meeting?: MeetingType
  data: any
}

const initialState: Props = {
  available: true,
  meeting: undefined,
  data: undefined,
}

const slice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeeting: (
      state,
      { payload }: PayloadAction<MeetingType | undefined>,
    ) => {
      if (payload) {
        state.meeting = {
          id: payload.id,
          type: payload.type,
          hasVideo: payload.hasVideo,
          ...state.meeting,
        }
      }
      state.available = false
    },
    setCaller: (state, action: PayloadAction<MemberProps>) => {
      if (!state.meeting) {
        state.meeting = {
          id: '',
          type: 'in_coming',
          hasVideo: true,
        }
      }
      state.meeting.caller = action.payload
    },
    setCallee: (state, action: PayloadAction<MemberProps>) => {
      if (state.meeting) {
        state.meeting.callee = action.payload
      }
    },
    setData: (state, action) => {
      state.data = action.payload
    },
    reset: () => initialState,
  },
})

export default slice.reducer
export const meetingSliceActions = slice.actions

export interface MeetingType {
  id: string
  caller?: MemberProps
  callee?: MemberProps
  type: 'in_coming' | 'out_going'
  hasVideo: boolean
}
