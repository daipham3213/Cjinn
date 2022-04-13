export * from './common'
export * from './user'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any
  /** JSON as is, but converting object keys to and from camelCase automatically */
  AutoCamelCasedScalar: any
  /**
   * Errors messages and codes mapped to
   * fields or non fields errors.
   * Example:
   * {
   * field_name: [
   * {
   * "message": "error message",
   * "code": "error_code"
   * }
   * ],
   * other_field: [
   * {
   * "message": "error message",
   * "code": "error_code"
   * }
   * ],
   * nonFieldErrors: [
   * {
   * "message": "error message",
   * "code": "error_code"
   * }
   * ]
   * }
   */
  ExpectedErrorType: any
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: any
}

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']
}

export type AccountMutation = {
  __typename?: 'AccountMutation'
  changePassword?: Maybe<ChangePassword>
  login?: Maybe<ObtainOtp>
  register?: Maybe<Register>
  resendOTP?: Maybe<ResendOtp>
  validOTP?: Maybe<ValidOtp>
}

export type AccountMutationChangePasswordArgs = {
  passwordNew: Scalars['String']
  passwordOld: Scalars['String']
}

export type AccountMutationLoginArgs = {
  password: Scalars['String']
  username: Scalars['String']
}

export type AccountMutationRegisterArgs = {
  email: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
  username: Scalars['String']
}

export type AccountMutationResendOtpArgs = {
  pk: Scalars['String']
}

export type AccountMutationValidOtpArgs = {
  otp?: InputMaybe<Scalars['String']>
  pk?: InputMaybe<Scalars['String']>
}

export type ActivityConnection = {
  __typename?: 'ActivityConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ActivityEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `Activity` and its cursor. */
export type ActivityEdge = {
  __typename?: 'ActivityEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ActivityLogNode>
}

export type ActivityLogNode = Node & {
  __typename?: 'ActivityLogNode'
  codeDocument?: Maybe<Scalars['String']>
  data?: Maybe<Scalars['AutoCamelCasedScalar']>
  dateCreated: Scalars['DateTime']
  dateModified: Scalars['DateTime']
  docId?: Maybe<Scalars['UUID']>
  docName?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  isActive: Scalars['Boolean']
  nodeId?: Maybe<Scalars['UUID']>
  nodeName?: Maybe<Scalars['String']>
  nodeType: LogActivityLogNodeTypeChoices
  reason?: Maybe<Scalars['String']>
  remarks: Scalars['String']
  userCreated?: Maybe<UserNode>
}

export type AddKeyBundle = {
  __typename?: 'AddKeyBundle'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type AddSignedPreKey = {
  __typename?: 'AddSignedPreKey'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type AddThread = {
  __typename?: 'AddThread'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type AuthorizationLogNode = Node & {
  __typename?: 'AuthorizationLogNode'
  data?: Maybe<Scalars['AutoCamelCasedScalar']>
  dateCreated: Scalars['DateTime']
  dateModified: Scalars['DateTime']
  /** The ID of the object. */
  id: Scalars['ID']
  isActive: Scalars['Boolean']
  remarks: Scalars['String']
  userCreated?: Maybe<Scalars['UUID']>
}

export type AuthorizeLogConnection = {
  __typename?: 'AuthorizeLogConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AuthorizeLogEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `AuthorizeLog` and its cursor. */
export type AuthorizeLogEdge = {
  __typename?: 'AuthorizeLogEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<AuthorizationLogNode>
}

export type CallSignaling = {
  __typename?: 'CallSignaling'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type CallSignalingSubscription = {
  __typename?: 'CallSignalingSubscription'
  event?: Maybe<Scalars['AutoCamelCasedScalar']>
}

export type ChangePassword = {
  __typename?: 'ChangePassword'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type CreateDeviceToken = {
  __typename?: 'CreateDeviceToken'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type DeviceInfoConnection = {
  __typename?: 'DeviceInfoConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DeviceInfoEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `DeviceInfo` and its cursor. */
export type DeviceInfoEdge = {
  __typename?: 'DeviceInfoEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<DeviceInfoType>
}

export type DeviceInfoType = Node & {
  __typename?: 'DeviceInfoType'
  apnId?: Maybe<Scalars['String']>
  createdDate: Scalars['Date']
  fetchesMessages: Scalars['Boolean']
  gcmId?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  isMaster: Scalars['Boolean']
  isStale: Scalars['Boolean']
  lastSeen: Scalars['DateTime']
  name?: Maybe<Scalars['String']>
  pushTimeStamp: Scalars['DateTime']
  registrationId: Scalars['Int']
  salt?: Maybe<Scalars['String']>
  signedPreKey?: Maybe<SignedPreKeyType>
  token?: Maybe<Scalars['String']>
  user: UserViewType
  voidApnId?: Maybe<Scalars['String']>
}

export type DeviceInfoView = {
  __typename?: 'DeviceInfoView'
  id: Scalars['UUID']
  lastSeen: Scalars['DateTime']
  pk?: Maybe<Scalars['UUID']>
  registrationId: Scalars['Int']
}

/** Debugging information for the current query. */
export type DjangoDebug = {
  __typename?: 'DjangoDebug'
  /** Executed SQL queries for this API query. */
  sql?: Maybe<Array<Maybe<DjangoDebugSql>>>
}

/** Represents a single database query made to a Django managed DB. */
export type DjangoDebugSql = {
  __typename?: 'DjangoDebugSQL'
  /** The Django database alias (e.g. 'default'). */
  alias: Scalars['String']
  /** Duration of this database query in seconds. */
  duration: Scalars['Float']
  /** Postgres connection encoding if available. */
  encoding?: Maybe<Scalars['String']>
  /** Whether this database query was a SELECT. */
  isSelect: Scalars['Boolean']
  /** Whether this database query took more than 10 seconds. */
  isSlow: Scalars['Boolean']
  /** Postgres isolation level if available. */
  isoLevel?: Maybe<Scalars['String']>
  /** JSON encoded database query parameters. */
  params: Scalars['String']
  /** The raw SQL of this query, without params. */
  rawSql: Scalars['String']
  /** The actual SQL sent to this database. */
  sql?: Maybe<Scalars['String']>
  /** Start time of this database query. */
  startTime: Scalars['Float']
  /** Stop time of this database query. */
  stopTime: Scalars['Float']
  /** Postgres transaction ID if available. */
  transId?: Maybe<Scalars['String']>
  /** Postgres transaction status if available. */
  transStatus?: Maybe<Scalars['String']>
  /** The type of database being used (e.g. postrgesql, mysql, sqlite). */
  vendor: Scalars['String']
}

export type FriendOnlineConnection = {
  __typename?: 'FriendOnlineConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FriendOnlineEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `FriendOnline` and its cursor. */
export type FriendOnlineEdge = {
  __typename?: 'FriendOnlineEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<FriendOnlineType>
}

export type FriendOnlineSubscription = {
  __typename?: 'FriendOnlineSubscription'
  event?: Maybe<OnlineEvent>
}

export type FriendOnlineType = Node & {
  __typename?: 'FriendOnlineType'
  /** The ID of the object. */
  id: Scalars['ID']
  status?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['UUID']>
}

export type FriendRequestConnection = {
  __typename?: 'FriendRequestConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FriendRequestEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `FriendRequest` and its cursor. */
export type FriendRequestEdge = {
  __typename?: 'FriendRequestEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<FriendRequestType>
}

export type FriendRequestSubscription = {
  __typename?: 'FriendRequestSubscription'
  event?: Maybe<Scalars['AutoCamelCasedScalar']>
}

export type FriendRequestType = Node & {
  __typename?: 'FriendRequestType'
  avatar?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  lastName?: Maybe<Scalars['String']>
  pk?: Maybe<Scalars['UUID']>
  timestamp?: Maybe<Scalars['DateTime']>
  type?: Maybe<Scalars['String']>
}

export type HistoryLogConnection = {
  __typename?: 'HistoryLogConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<HistoryLogEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `HistoryLog` and its cursor. */
export type HistoryLogEdge = {
  __typename?: 'HistoryLogEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<HistoryLogNode>
}

export type HistoryLogNode = Node & {
  __typename?: 'HistoryLogNode'
  activityName: LogHistoryLogActivityNameChoices
  codeDocument?: Maybe<Scalars['String']>
  dateCreated: Scalars['DateTime']
  docChange?: Maybe<Scalars['AutoCamelCasedScalar']>
  docDetail?: Maybe<Scalars['AutoCamelCasedScalar']>
  docId?: Maybe<Scalars['UUID']>
  docName?: Maybe<Scalars['String']>
  docNew?: Maybe<Scalars['AutoCamelCasedScalar']>
  /** The ID of the object. */
  id: Scalars['ID']
  isActive: Scalars['Boolean']
  remarks?: Maybe<Scalars['String']>
  userCreated?: Maybe<Scalars['UUID']>
}

export type LogQuery = {
  __typename?: 'LogQuery'
  activities?: Maybe<ActivityConnection>
  authorize?: Maybe<AuthorizeLogConnection>
  histories?: Maybe<HistoryLogConnection>
}

export type LogQueryActivitiesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type LogQueryAuthorizeArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type LogQueryHistoriesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type MeetingType = {
  __typename?: 'MeetingType'
  answers?: Maybe<Scalars['AutoCamelCasedScalar']>
  hasVideo?: Maybe<Scalars['Boolean']>
  members?: Maybe<Array<Maybe<Scalars['AutoCamelCasedScalar']>>>
  offers?: Maybe<Scalars['AutoCamelCasedScalar']>
  pk?: Maybe<Scalars['UUID']>
}

export type MemberViewType = {
  __typename?: 'MemberViewType'
  id: Scalars['UUID']
  info?: Maybe<UserViewType>
  isBlocked: Scalars['Boolean']
  isMuted: Scalars['Boolean']
  joinedDate: Scalars['DateTime']
  pk?: Maybe<Scalars['UUID']>
}

export type MessageEventType = {
  __typename?: 'MessageEventType'
  data?: Maybe<Array<Maybe<Scalars['AutoCamelCasedScalar']>>>
  type?: Maybe<Event_Type>
}

export type MessengerMutation = {
  __typename?: 'MessengerMutation'
  addKeyBundles?: Maybe<AddKeyBundle>
  addSignedPreKey?: Maybe<AddSignedPreKey>
  addThread?: Maybe<AddThread>
  callSignaling?: Maybe<CallSignaling>
  createDeviceToken?: Maybe<CreateDeviceToken>
  processFriendRequest?: Maybe<ProcessFriendRequest>
  removeContact?: Maybe<RemoveContact>
  removeDevice?: Maybe<RemoveDevice>
  seenSignal?: Maybe<SeenMessages>
  sendFriendRequest?: Maybe<SendFriendRequest>
  sendMessage?: Maybe<SendMessage>
  updateDeviceInfo?: Maybe<UpdateDeviceInfo>
  updateUserInfo?: Maybe<UpdateUserInfo>
  verifyDeviceToken?: Maybe<VerifyDeviceToken>
}

export type MessengerMutationAddKeyBundlesArgs = {
  identityKey: Scalars['String']
  preKeys?: InputMaybe<Array<InputMaybe<PreKeyInput>>>
  registrationId: Scalars['String']
  signedPreKey: SignedPreKeyInput
}

export type MessengerMutationAddSignedPreKeyArgs = {
  registrationId: Scalars['String']
}

export type MessengerMutationAddThreadArgs = {
  isEncrypt: Scalars['Boolean']
  memberIds: Array<InputMaybe<Scalars['UUID']>>
  name?: InputMaybe<Scalars['String']>
}

export type MessengerMutationCallSignalingArgs = {
  meetingId?: InputMaybe<Scalars['UUID']>
  signalType: Scalars['String']
  userId: Scalars['UUID'] | undefined
}

export type MessengerMutationCreateDeviceTokenArgs = {
  registrationId: Scalars['String']
}

export type MessengerMutationProcessFriendRequestArgs = {
  isAccept: Scalars['String']
  senderId: Scalars['String']
}

export type MessengerMutationRemoveContactArgs = {
  userId: Scalars['String']
}

export type MessengerMutationRemoveDeviceArgs = {
  registrationId: Scalars['String']
}

export type MessengerMutationSeenSignalArgs = {
  messageIds: Array<InputMaybe<Scalars['UUID']>>
  threadId: Scalars['UUID']
}

export type MessengerMutationSendFriendRequestArgs = {
  recipientId: Scalars['String']
}

export type MessengerMutationSendMessageArgs = {
  messages: Array<InputMaybe<MessageInput>>
}

export type MessengerMutationUpdateDeviceInfoArgs = {
  apnId?: InputMaybe<Scalars['String']>
  gcmId?: InputMaybe<Scalars['String']>
  voidApnId?: InputMaybe<Scalars['String']>
}

export type MessengerMutationUpdateUserInfoArgs = {
  discoverableByPhoneNumber?: InputMaybe<Scalars['Boolean']>
  dob?: InputMaybe<Scalars['Date']>
  fistName?: InputMaybe<Scalars['String']>
  gender?: InputMaybe<Gender>
  language?: InputMaybe<Lang>
  lastName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
}

export type MessengerMutationVerifyDeviceTokenArgs = {
  deviceName: Scalars['String']
  otp: Scalars['String']
  password: Scalars['String']
  registrationId: Scalars['String']
}

export type MessengerQuery = {
  __typename?: 'MessengerQuery'
  contacts?: Maybe<UserViewConnection>
  friendRequest?: Maybe<FriendRequestConnection>
  friendsOnline?: Maybe<FriendOnlineConnection>
  getAllDevice?: Maybe<DeviceInfoConnection>
  getCurrentDevice?: Maybe<DeviceInfoType>
  getDeviceByUserId?: Maybe<Array<Maybe<DeviceInfoView>>>
  getDeviceKeys?: Maybe<PreKeyResponseType>
  getMeeting?: Maybe<MeetingType>
  getOnlineStatus?: Maybe<FriendOnlineType>
  getSignedPreKey?: Maybe<SignedPreKeyType>
  getStatus?: Maybe<PreKeyCount>
  searchContacts?: Maybe<UserViewConnection>
  thread?: Maybe<ThreadType>
  threadByUserIds?: Maybe<ThreadType>
  threadList?: Maybe<ThreadTypeConnectionsConnection>
}

export type MessengerQueryContactsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerQueryFriendRequestArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerQueryFriendsOnlineArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerQueryGetAllDeviceArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerQueryGetDeviceByUserIdArgs = {
  userId?: InputMaybe<Scalars['UUID']>
}

export type MessengerQueryGetDeviceKeysArgs = {
  deviceId?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['UUID']>
}

export type MessengerQueryGetMeetingArgs = {
  meetingId: Scalars['UUID']
}

export type MessengerQueryGetOnlineStatusArgs = {
  userId: Scalars['UUID']
}

export type MessengerQueryGetSignedPreKeyArgs = {
  deviceId?: InputMaybe<Scalars['UUID']>
}

export type MessengerQueryGetStatusArgs = {
  deviceId?: InputMaybe<Scalars['UUID']>
}

export type MessengerQuerySearchContactsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  keyword?: InputMaybe<Scalars['String']>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerQueryThreadArgs = {
  id: Scalars['UUID']
}

export type MessengerQueryThreadByUserIdsArgs = {
  userIds: Array<InputMaybe<Scalars['UUID']>>
}

export type MessengerQueryThreadListArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  ids: Array<InputMaybe<Scalars['UUID']>>
  last?: InputMaybe<Scalars['Int']>
}

export type MessengerSubscription = {
  __typename?: 'MessengerSubscription'
  event: MessageEventType
}

export type Mutation = {
  __typename?: 'Mutation'
  account?: Maybe<AccountMutation>
  messenger?: Maybe<MessengerMutation>
}

export type ObtainOtp = {
  __typename?: 'ObtainOTP'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type OnlineEvent = {
  __typename?: 'OnlineEvent'
  status?: Maybe<Online_Type>
  userId?: Maybe<Scalars['UUID']>
}

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>
}

export type PreKeyCount = {
  __typename?: 'PreKeyCount'
  count?: Maybe<Scalars['Int']>
}

export type PreKeyItemType = {
  __typename?: 'PreKeyItemType'
  deviceId?: Maybe<Scalars['String']>
  preKey?: Maybe<PreKeyType>
  registrationId?: Maybe<Scalars['Int']>
  signedPreKey?: Maybe<SignedPreKeyType>
}

export type PreKeyResponseType = {
  __typename?: 'PreKeyResponseType'
  devices?: Maybe<Array<Maybe<PreKeyItemType>>>
  identityKey?: Maybe<Scalars['String']>
}

export type PreKeyType = {
  __typename?: 'PreKeyType'
  id?: Maybe<Scalars['Int']>
  publicKey?: Maybe<Scalars['String']>
}

export type PrivateChannelSubscription = {
  __typename?: 'PrivateChannelSubscription'
  event: MessageEventType
}

export type ProcessFriendRequest = {
  __typename?: 'ProcessFriendRequest'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type Query = {
  __typename?: 'Query'
  __debug?: Maybe<DjangoDebug>
  logs?: Maybe<LogQuery>
  messenger?: Maybe<MessengerQuery>
  user?: Maybe<UserQuery>
}

export type Register = {
  __typename?: 'Register'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type RemoveContact = {
  __typename?: 'RemoveContact'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type RemoveDevice = {
  __typename?: 'RemoveDevice'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type ResendOtp = {
  __typename?: 'ResendOTP'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type SeenMessages = {
  __typename?: 'SeenMessages'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type SendFriendRequest = {
  __typename?: 'SendFriendRequest'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type SendMessage = {
  __typename?: 'SendMessage'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type SignedPreKeyType = {
  __typename?: 'SignedPreKeyType'
  id: Scalars['Int']
  publicKey: Scalars['String']
  signature: Scalars['String']
}

export type Subscription = {
  __typename?: 'Subscription'
  callSignaling?: Maybe<CallSignalingSubscription>
  friendOnline?: Maybe<FriendOnlineSubscription>
  friendRequest?: Maybe<FriendRequestSubscription>
  incomingMessage?: Maybe<MessengerSubscription>
  privateChannel?: Maybe<PrivateChannelSubscription>
}

export type SubscriptionCallSignalingArgs = {
  meetingId: Scalars['UUID']
}

export type SubscriptionFriendOnlineArgs = {
  registrationId?: InputMaybe<Scalars['Int']>
  threadId?: InputMaybe<Scalars['UUID']>
  token?: InputMaybe<Scalars['String']>
}

export type SubscriptionFriendRequestArgs = {
  registrationId?: InputMaybe<Scalars['Int']>
  threadId?: InputMaybe<Scalars['UUID']>
  token?: InputMaybe<Scalars['String']>
}

export type SubscriptionIncomingMessageArgs = {
  registrationId?: InputMaybe<Scalars['Int']>
  threadId?: InputMaybe<Scalars['UUID']>
  token?: InputMaybe<Scalars['String']>
}

export type SubscriptionPrivateChannelArgs = {
  registrationId?: InputMaybe<Scalars['Int']>
  threadId?: InputMaybe<Scalars['UUID']>
  token?: InputMaybe<Scalars['String']>
}

export type ThreadType = Node & {
  __typename?: 'ThreadType'
  dateCreated: Scalars['DateTime']
  extras?: Maybe<Scalars['AutoCamelCasedScalar']>
  icon?: Maybe<Scalars['String']>
  /** The ID of the object. */
  id: Scalars['ID']
  isEncrypted: Scalars['Boolean']
  leader?: Maybe<UserViewType>
  members?: Maybe<Array<Maybe<MemberViewType>>>
  name?: Maybe<Scalars['String']>
  pk?: Maybe<Scalars['UUID']>
}

export type ThreadTypeConnectionsConnection = {
  __typename?: 'ThreadTypeConnectionsConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ThreadTypeConnectionsEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `ThreadTypeConnections` and its cursor. */
export type ThreadTypeConnectionsEdge = {
  __typename?: 'ThreadTypeConnectionsEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<ThreadType>
}

export type UpdateDeviceInfo = {
  __typename?: 'UpdateDeviceInfo'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type UpdateUserInfo = {
  __typename?: 'UpdateUserInfo'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type UserInfoType = {
  __typename?: 'UserInfoType'
  avatar?: Maybe<Scalars['String']>
  contactStatus?: Maybe<Scalars['String']>
  dateJoined: Scalars['DateTime']
  dob?: Maybe<Scalars['Date']>
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  gender?: Maybe<AccountUserGenderChoices>
  isActive: Scalars['Boolean']
  isEmail: Scalars['Boolean']
  isPhone: Scalars['Boolean']
  language?: Maybe<AccountUserLanguageChoices>
  lastName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  pk?: Maybe<Scalars['UUID']>
  status?: Maybe<Scalars['String']>
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']
}

export type UserNode = Node & {
  __typename?: 'UserNode'
  avatar?: Maybe<Scalars['String']>
  dateJoined: Scalars['DateTime']
  dob?: Maybe<Scalars['Date']>
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  gender?: Maybe<AccountUserGenderChoices>
  /** The ID of the object. */
  id: Scalars['ID']
  isActive: Scalars['Boolean']
  isEmail: Scalars['Boolean']
  isPhone: Scalars['Boolean']
  language?: Maybe<AccountUserLanguageChoices>
  lastName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  pk?: Maybe<Scalars['UUID']>
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']
}

export type UserNodeConnection = {
  __typename?: 'UserNodeConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserNodeEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
  __typename?: 'UserNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<UserNode>
}

export type UserQuery = {
  __typename?: 'UserQuery'
  findUser?: Maybe<UserNodeConnection>
  me?: Maybe<UserNode>
  userInfo?: Maybe<UserInfoType>
}

export type UserQueryFindUserArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  firstName?: InputMaybe<Scalars['String']>
  last?: InputMaybe<Scalars['Int']>
  lastName?: InputMaybe<Scalars['String']>
  offset?: InputMaybe<Scalars['Int']>
  phone?: InputMaybe<Scalars['String']>
  username?: InputMaybe<Scalars['String']>
}

export type UserQueryUserInfoArgs = {
  id: Scalars['UUID']
}

export type UserViewConnection = {
  __typename?: 'UserViewConnection'
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserViewEdge>>
  /** Pagination data for this connection. */
  pageInfo: PageInfo
}

/** A Relay edge containing a `UserView` and its cursor. */
export type UserViewEdge = {
  __typename?: 'UserViewEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']
  /** The item at the end of the edge */
  node?: Maybe<UserViewType>
}

export type UserViewType = Node & {
  __typename?: 'UserViewType'
  avatar?: Maybe<Scalars['String']>
  dateJoined: Scalars['DateTime']
  dob?: Maybe<Scalars['Date']>
  firstName?: Maybe<Scalars['String']>
  gender?: Maybe<AccountUserGenderChoices>
  /** The ID of the object. */
  id: Scalars['ID']
  lastName?: Maybe<Scalars['String']>
  pk?: Maybe<Scalars['UUID']>
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']
}

export type ValidOtp = {
  __typename?: 'ValidOTP'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

export type VerifyDeviceToken = {
  __typename?: 'VerifyDeviceToken'
  errors?: Maybe<Scalars['ExpectedErrorType']>
  result?: Maybe<Scalars['AutoCamelCasedScalar']>
  success?: Maybe<Scalars['Boolean']>
}

/** An enumeration. */
export enum AccountUserGenderChoices {
  /** Female */
  Female = 'FEMALE',
  /** Male */
  Male = 'MALE',
}

/** An enumeration. */
export enum AccountUserLanguageChoices {
  /** English */
  En = 'EN',
  /** Vietnamese */
  Vi = 'VI',
}

/** An enumeration. */
export enum Event_Type {
  MessageDelivered = 'MessageDelivered',
  NewMessage = 'NewMessage',
  SeenMessage = 'SeenMessage',
}

/** An enumeration. */
export enum Gender {
  Female = 'female',
  Male = 'male',
}

/** An enumeration. */
export enum Lang {
  En = 'en',
  Vi = 'vi',
}

/** An enumeration. */
export enum LogActivityLogNodeTypeChoices {
  /** System */
  A_0 = 'A_0',
  /** Workflow */
  A_1 = 'A_1',
}

/** An enumeration. */
export enum LogHistoryLogActivityNameChoices {
  /** Cancel */
  Cancel = 'CANCEL',
  /** Comment */
  Comment = 'COMMENT',
  /** Delete */
  Delete = 'DELETE',
  /** Edit */
  Edit = 'EDIT',
  /** Save */
  Save = 'SAVE',
  /** Share */
  Share = 'SHARE',
  /** System */
  System = 'SYSTEM',
}

/** An enumeration. */
export enum Online_Type {
  Offline = 'Offline',
  Online = 'Online',
}

export type MessageInput = {
  contents: Scalars['String']
  createdBy: Scalars['UUID']
  destinationDeviceId: Scalars['UUID']
  extras?: InputMaybe<Scalars['JSONString']>
  id: Scalars['String']
  replyTo?: InputMaybe<Scalars['UUID']>
  threadId: Scalars['UUID']
}

export type PreKeyInput = {
  keyId: Scalars['String']
  publicKey: Scalars['String']
}

export type SignedPreKeyInput = {
  keyId: Scalars['String']
  publicKey: Scalars['String']
  signature: Scalars['String']
}
