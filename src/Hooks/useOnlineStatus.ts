import React from 'react'
import { useAppDispatch, useAppSelector } from '@/Hooks/useReduxStore'
import { useSubscription } from '@apollo/client'
import { ONLINE_STATUS } from '@/Services/operations'
import { FriendOnlineSubscription } from '@/Services/types'
import { showInfoAction } from '@/Store/errorSaga'
import { interactionsActions, messageActions, RootState } from '@/Store'

const useOnlineStatus = () => {
  const dispatch = useAppDispatch()
  const { onlineList } = useAppSelector((state: RootState) => state.interaction)
  const { data, loading, error } = useSubscription<FriendOnlineSubscription>(
    ONLINE_STATUS,
    { fetchPolicy: 'no-cache' },
  )

  if (error) {
    dispatch(showInfoAction({ type: 'error', result: error.message }))
  }

  // if (data) {
  //   const userId = data.event.userId
  //   const status = data.event.status
  //   if (status === 'online') {
  //     // dispatch(interactionsActions.loadOnlineList({ ...value }))
  //   } else {
  //     const index = onlineList.connection?.edges.findIndex(
  //       val => val?.node?.userId === userId,
  //     )
  //     // dispatch(interactionsActions.loadOnlineList({ ...(value as any) }))
  //   }
  // }
  //
  // React.useEffect(() => {
  //   dispatch(messageActions.getOnlineListAction())
  // }, [dispatch])

  return { data, loading }
}

export default useOnlineStatus
