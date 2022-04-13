export interface Message<ExtraType = MessageExtras> {
  id: string
  threadId: string
  contents: string
  replyTo?: string
  extras: ExtraType
  timeStamp: string
  createdBy: string
}

export interface Thread {
  id: string
  devices: {
    userId: string
    deviceId: string
  }[]
  members: string[]
  lastMessage?: Message
  createDate: Date
  newMessageCount?: number
  isEncrypted?: boolean
}

export interface MessageExtras {
  seenBy?: string[]
  status: 'received' | 'sending' | 'delivered' | 'error'
  media?: Media[]
}

export interface Media {
  isVideo: boolean
  name: string
  uri: string
}

export interface ReceivedMessage {
  id: string
  contents: string
  createdBy: string
  destinationDeviceId: string
  isSync: boolean
  threadId: string
  timestamp: string
  replyTo?: string
  sender: Sender
  registrationId: number
  media?: Media[]
}

export interface DeliveredItem {
  id: string
  threadId: string
  media?: Media[]
}

export type Sender = {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}
export interface PortReceived extends Omit<ReceivedMessage, 'media'> {
  media?: string
}

export interface PortDelivered extends Omit<DeliveredItem, 'media'> {
  media?: string
}
