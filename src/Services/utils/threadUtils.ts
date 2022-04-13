import { MessageInput, ThreadType } from '@/Services/types'
import moment from 'moment'
import { DeliveredItem, Message, PortDelivered, PortReceived, ReceivedMessage } from "@/Store/SignalStore/type";

export const getName = (
  item: ThreadType | undefined | null,
  activeRecord: any,
): string => {
  if (item?.name && item.name.length > 0) {
    return item.name
  }
  if (item && activeRecord) {
    const { members } = item
    if (members && members.length > 1) {
      return members
        .filter(value => value?.info?.username !== activeRecord.user.username)
        .flatMap(value => value?.info?.firstName + ' ' + value?.info?.lastName)
        .toString()
    }
  }
  return ' error ***'
}

export const getIconUrl = (
  item: ThreadType | undefined | null,
  activeRecord: any,
): string | undefined => {
  if (item && item.icon) {
    return item.icon
  }
  if (item && activeRecord) {
    const { members } = item
    const { user } = activeRecord
    if (members && members.length > 1) {
      const temp = members.filter(
        value => value?.info?.username !== user.username,
      )
      if (temp.length === 1) {
        return temp[0]?.info?.avatar ? temp[0]?.info?.avatar : undefined
      }
      return undefined
    }
  }
}
// export const merge2Array = <T extends { id?: string; pk?: string }>(
//   array1: T[],
//   array2: T[],
// ) => {
//   if (!array1[0].id && !array1[0].pk) {
//     throw Error('array does not have any id or pk key')
//   }
//   if (!array2[0].id && !array2[0].pk) {
//     throw Error('array does not have any id or pk key')
//   }
//   let merged: T[] = []
//   for (let i = 0; i < array1.length; i++) {
//     merged.push({
//       ...array1[i],
//       ...array2.find(itmInner =>
//         itmInner.id
//           ? itmInner.id === array1[i].id
//           : itmInner.pk === array1[i].pk,
//       ),
//     })
//   }
//   return merged
// }

export function mergeBy<T>(
  data: T[],
  key: keyof T,
  child: keyof T[keyof T],
): T[] {
  return Array.from(
    data
      .reduce(
        (m, o) => m.set(o[key][child], { ...m.get(o[key][child]), ...o }),
        new Map(),
      )
      .values(),
  )
}

export function mapMessageInputToMessage(
  message: Omit<MessageInput, 'destinationDeviceId'>,
) {
  return {
    id: message.id,
    contents: message.contents,
    threadId: message.threadId,
    createdBy: message.createdBy,
    extras: { status: 'sending' } as any,
    timeStamp: moment().toISOString(),
  }
}

export function mapReceivedMessageToMessage(message: ReceivedMessage): Message {
  return {
    id: message.id,
    timeStamp: message.timestamp,
    threadId: message.threadId,
    contents: message.contents,
    extras: {
      status: message.isSync ? 'delivered' : 'received',
      media: message.media,
    },
    createdBy: message.createdBy,
    replyTo: message.replyTo,
  }
}

export function mapPortDeliveredType(message: PortDelivered): DeliveredItem {
  return {
    ...message,
    media: message.media ? JSON.parse(message.media) : undefined,
  }
}

export function mapPortReceivedType(message: PortReceived): ReceivedMessage {
  return {
    ...message,
    media: message.media ? JSON.parse(message.media) : undefined,
  }
}
