import { SignalStorage } from './SignalStorage'
import { MESSAGE_CONST } from './consts'
import { Message, MessageExtras, Thread } from './type'
import { Config } from '@/Config'
import moment from 'moment'

const messagePrefix = (msgId: string, threadId: string) =>
  `${MESSAGE_CONST.message + '|' + msgId + '|' + threadId}`
const threadPrefix = (threadId: string) =>
  `${MESSAGE_CONST.thread + '|' + threadId}`

export class MessageStore {
  private store: SignalStorage

  constructor(store: SignalStorage) {
    this.store = store
  }

  async getThreadByMembers(memberIds: string[]) {
    const keys = await this.store.indexer.getKeys()
    const threadKey = keys.filter(value =>
      value.startsWith(MESSAGE_CONST.thread),
    )

    return threadKey.flatMap(value => {
      const thread = this.store.getObject<Thread>(value)
      return thread &&
        thread.members.every(member => memberIds.includes(member))
        ? thread
        : []
    })
  }

  async getThreadMessages(threadId: string, last?: number, after?: string) {
    const keys = await this.store.indexer.maps.getKeys()
    let msgKeys = keys
      .filter(value => value.startsWith(MESSAGE_CONST.message))
      .reverse()
    const thread = this.getThreadById(threadId)
    if (thread) {
      thread.newMessageCount = undefined
      this.addOrEditThread(thread)
    }
    let index = 0
    if (after) {
      index = msgKeys.indexOf(messagePrefix(after, threadId))
    }
    last && (msgKeys = msgKeys.slice(index, last + index))
    return msgKeys.flatMap((value, _, array) => {
      const msg = this.store.getObject<Message>(value)
      return msg && msg.threadId === threadId && !array.includes(msg.id)
        ? msg
        : []
    })
  }

  async getThreadList(last?: number, after?: string) {
    const keys = await this.store.indexer.maps.getKeys()
    let threadKeys = keys.filter(value =>
      value.startsWith(MESSAGE_CONST.thread),
    )
    const threads = threadKeys.flatMap(value => {
      const thread = this.store.getObject<Thread>(value)
      return thread ? thread : []
    })
    function sortFunction(a: Thread, b: Thread) {
      let dateA = new Date(a.lastMessage?.timeStamp ?? a.createDate).getTime()
      let dateB = new Date(b.lastMessage?.timeStamp ?? b.createDate).getTime()
      return dateA > dateB ? 1 : -1
    }
    const index = after
      ? threads.sort(sortFunction).findIndex(value => value.id === after)
      : 0
    return threads.slice(index, last && last + index)
  }

  getThreadById(threadId: string) {
    const hasThread = this.store.indexer.maps.hasKey(threadPrefix(threadId))
    return hasThread
      ? this.store.getObject<Thread>(threadPrefix(threadId))
      : undefined
  }

  addOrEditThread(props: Thread) {
    return this.store.setObject<Thread>(threadPrefix(props.id), props)
  }

  async messageKeys(threadId: string) {
    const keys = await this.store.indexer.maps.getKeys()
    return keys
      .flatMap(value =>
        value.includes(threadId) && value.startsWith(MESSAGE_CONST.message)
          ? value
          : [],
      )
      .flatMap(value => (this.store.indexer.hasKey(value) ? value : []))
  }

  async addMessage(props: Message) {
    const thread = this.getThreadById(props.threadId)
    if (!thread) {
      throw new Error('Thread not exist')
    }
    const keys = await this.messageKeys(props.threadId)
    if (keys.length >= Config.MSG_THRESHOLD) {
      this.store.removeObject(keys[0])
    }
    this.store.setObject(messagePrefix(props.id, props.threadId), props)
    thread.lastMessage = props
    thread.newMessageCount = thread.newMessageCount
      ? thread.newMessageCount + 1
      : 1
    this.addOrEditThread(thread)
  }

  async removeThread(threadId: string) {
    const msgKeys = await this.messageKeys(threadId)
    console.log(msgKeys, 'mgs keys')
    this.store.removeObject(threadPrefix(threadId))
    msgKeys.forEach(key => {
      this.store.removeObject(key)
    })
  }

  editMessage(id: string, threadId: string, extras: MessageExtras) {
    const message = this.store.getObject<Message>(messagePrefix(id, threadId))
    if (message) {
      const newMsg: Message = {
        ...message,
        timeStamp: moment().toISOString(),
        extras: extras,
      }
      this.store.setObject<Message>(messagePrefix(id, threadId), newMsg)
    }
  }
}
