import { useSubscription } from '@apollo/client'
import { PRIVATE_CHANNEL } from '@/Services/operations'
import { Subscription } from '@/Services/types'
import { showInfoAction } from '@/Store/errorSaga'
import { useAppDispatch } from '@/Hooks/useReduxStore'

const usePrivateChannel = (threadId: string) => {
  const dispatch = useAppDispatch()

  const { data, loading, error } = useSubscription<Subscription>(
    PRIVATE_CHANNEL,
    {
      variables: { threadId: threadId },
    },
  )
  // Handle errors
  if (error) {
    dispatch(showInfoAction({ type: 'error', result: error.message }))
  }

  // Persist messages
  if (data) {
    console.log('New message! ', data.incomingMessage?.event)
  }
  return { data, loading }
}

export default usePrivateChannel
