import { ContinueChatResponse, StartChatResponse } from '@typebot.io/schemas'

export type InputSubmitContent = {
  label?: string
  value: string
  attachments?: Answer['attachments']
}

export type BotContext = {
  typebot: StartChatResponse['typebot']
  resultId?: string
  isPreview: boolean
  apiHost?: string
  sessionId: string
  storage: 'local' | 'session' | undefined
}

export type OutgoingLog = {
  status: string
  description: string
  details?: unknown
}

export type ClientSideActionContext = {
  apiHost?: string
  sessionId: string
}

export type ChatChunk = Pick<
  ContinueChatResponse,
  'messages' | 'input' | 'clientSideActions'
> & {
  streamingMessageId?: string
}

export type Answer = {
  text: string
  attachments?: {
    type: string
    url: string
  }[]
}

export type CustomData = {
  member: {
    userKey: string
    userName: string
    memberId: string
    sessionId: string
    [key: string]: string
  }
}

// 이전 webchat 에서 사용한 타입들
export enum WsPayloadType {
  MESSAGE = 'Message',
  SESSION_CONFIRM = 'session_confirm',
  SESSION_REQUEST = 'session_request',
  SESSION_TERMINATE = 'session_terminate',
  SESSION_TERMINATE_REQUEST = 'session_terminate_request',
  BOT_MESSAGE_RESPONSE = 'bot_message_response',
  BOT_START_REQUEST = 'bot_start_request',
  BOT_WELCOME_RESPONSE = 'bot_welcome_response',
  BOT_WELCOME_RESPONSE_COMPLETE = 'bot_welcome_response_complete',
  AGENT_START_REQUEST = 'agent_start_request',
  AGENT_START_RESPONSE = 'agent_start_response',
  AGENT_RESPONSE = 'agent_response',
  USER_MESSAGE = 'user_message',
  USER_FILE_MESSAGE = 'user_file_message',
  USER_BOT_RESPONSE = 'user_bot_response',
  SESSION_CONFIG = 'session_config',
  STATUS_CHANGE_EVENT = 'status_change_event',
  WEBHOOK_EVENT = 'webhook_event',
  HEARTBEAT = 'heartbeat',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

export class Payload {
  constructor(public type: WsPayloadType | undefined) {}
}

export type BaseResponse = {
  action: string
  sessionId: string
  userKey: string
  memberId: string
  clientId: string
  connectionId: string
}

export interface ResponseMessage extends BaseResponse {
  message: Message
}

export interface ResponseMessages extends BaseResponse {
  // messages: Message[];
  messageList: Message[]
}

type BaseMessage = {
  type: string
  component: never
  sender: string
  showAvatar: boolean
  timestamp: Date
  unread: boolean
  messageId?: string
  props?: unknown
}

export interface MessageTypes extends BaseMessage {
  text: string
}

export type QuickButtonTypes = {
  label: string
  value: string | number
  component: never
}

export interface Link extends BaseMessage {
  title: string
  link: string
  target: string
}

export interface LinkParams {
  link: string
  title: string
  target?: string
}

export interface UserAction extends BaseMessage {
  actionPayload: ActionPayload
  text?: string
}

export interface ImgReply extends BaseMessage {
  images: ImageContent[]
}

export interface BtnImgReply extends BaseMessage {
  buttons: ButtonContent[]
  images: ImageContent[]
  text?: string
}

export interface CustomCompMessage extends BaseMessage {
  props: unknown
}

export interface BehaviorState {
  connected: boolean
  initialized: boolean
  newChatSelected: boolean
  showChat: boolean
  disabledInput: boolean
  messageLoader: boolean
  current_mode: ModeType
  current_menu: MenuType
  current_sessionId: string
}

export interface MessagesState {
  messages: (
    | MessageTypes
    | Link
    | ImgReply
    | BtnImgReply
    | UserAction
    | CustomCompMessage
  )[]
  badgeCount: number
}

export interface ChannelsState {
  channels: Channel[]
  currentChannelId: string
  currentChannelMessages: ResponseMessages[]
}

export interface QuickButtonsState {
  quickButtons: QuickButtonTypes[]
}

export interface ImageState {
  src: string
  alt?: string
  width: number
  height: number
}

export interface FullscreenPreviewState extends ImageState {
  visible?: boolean
}

export interface GlobalState {
  messages: MessagesState
  behavior: BehaviorState
  channels: ChannelsState
  quickButtons: QuickButtonsState
  preview: FullscreenPreviewState
}

export interface ConnectionInfo {
  sessionId: string
  localUserKey: string
  localMemberId: string
  clientId: string
  connectionId: string
}

export enum ChannelStatus {
  opened = 'opened', // 상담 연결요청 메뉴를 선택하여 사용자 입력 전 상태
  counsel = 'counsel', // 상담 중인 상태
  assigned = 'assigned', // 상담원이 할당된 상태
  unassigned = 'unassigned', // 사용자가 메세지 입력 후 상담원 연결 대기 상태
  closed = 'closed', // 상담 종료
  snoozed = 'snoozed', // 일시 중지
  unsnoozed = 'unsnoozed', // 일시 중지 해제
  // ready = 'ready', // 사용자가 메세지 입력 후 상담원 연결 대기 상태
  bot = 'bot', // 챗봇
}

export enum ActionType {
  AGENT = 'AGENT', // 채팅 상담 연결
  MENU = 'MENU', // 초기 메뉴
  END = 'END', // 채팅 상담 종료
}

export type ActionPayload = {
  type: 'COMPONENT' | 'MESSAGE' | 'ACTION' | 'URL-LINK' | 'API'
  text: string
  payload: string
}

export enum ModeType {
  SESSION = 'session',
  CHATBOT = 'bot',
  AGENT = 'agent',
}

export enum MenuType {
  HOME = 'home',
  CONVERSATION = 'conversation',
  HELP = 'help',
  SETTINGS = 'settings',
}

export class Message extends Payload {
  constructor(init?: Partial<Message>) {
    super(init?.type)
    Object.assign(this, init)
  }
  public sender!: string
  public text: string | undefined
  public sendAt: string | undefined
  public channelId!: string
  public messageId!: string
  public connectionId!: string
  public mode: ModeType | undefined
  public messageType!: MessageType
  public attachment: Attachment | undefined
  public buttons: ButtonContent[] | ButtonGroupContent | undefined
  public referComponentId!: string
  public componentId!: string
  public video: VideoContent | undefined
  public files: FileContent[] | undefined
  public sequence: number | undefined
  public channelStatus: ChannelStatus | undefined
  public unread: boolean | undefined
  public timestamp: Date | number | undefined
  public showAvatar: boolean | undefined

  public toString(): string {
    return JSON.stringify(this)
  }
}

// Text Component
export type TextContent = {
  textContent: string
  textFormat?: string
}

// Image Component
export type ImageContent = {
  attachment: Attachment
}

// Video Component
export type VideoContent = {
  videoUrl: string
  altText?: string
  clickUrl?: string
}

// File Component
export type FileContent = {
  fileUrl: string
  contentType?: string
  name: string
  type: string
  altText?: string
  clickUrl?: string
}

// Button Component
export type ButtonContent = {
  title: string
  payload: string
  style?: 'DEFAULT' | 'PRIMARY' | 'SECONDARY' | 'INFO'
  payloadType: 'COMPONENT' | 'MESSAGE' | 'ACTION' | 'URL-LINK' | 'API'
}

// Button Group Component
export type ButtonGroupContent = {
  buttons: ButtonContent[]
}

export type Attachment = {
  type: string
  payload: {
    title: string
    src: string
    desc?: string
    altText?: string
    clickUrl?: string
    clickComponent?: string
  }
}

export enum MessageType {
  TEXT = 'Text',
  IMAGE = 'Image',
  VIDEO = 'Video',
  IMAGEBUTTON = 'ImageButton',
  IMAGEBUTTONGROUP = 'ImageButtonGroup',
  BUTTON = 'Button',
  BUTTONGROUP = 'ButtonGroup',
  STEPPERFORM = 'StepperForm',
  FILE = 'File',
  CARD = 'Card',
  CARDSLIDE = 'CardSlide',
  AGENTDIVIDER = 'AgentDivider',
  USERTEXT = 'UserText',
}

export class Connection {
  public connectionId: string | undefined
  public clientId: string | undefined
  public localMemberId!: string
  public localUserKey!: string
  public sessionId!: string
}

export enum SenderType {
  CLIENT = 'client',
  RESPONSE = 'response',
  BOT = 'bot',
}

export class Channel extends Payload {
  constructor(init?: Partial<Channel>) {
    super(init?.type)
    Object.assign(this, init)
  }

  public id!: string
  public RelConnectionIds!: string
  public curChannelStatus!: ChannelStatus
  public memberId?: string
  public memberInfo!: string
  public userKey?: string
  public createdAt!: string
  public assigneeId?: string
  public assignedAt?: string
  public clientId!: string
  public mode!: ModeType
  public lastUpdated?: string
  public messages?: []
  public avatar?: string
}

// Client Table
export type Client = {
  clientId: string
  brandName: string
  createAt: string
  estimateDelay: string
  holidays: string[]
  isBlockReplyAfterClose: boolean
  isOperation: boolean
  isOperationSchedule: boolean
  isShowOperationProfile: boolean
  isTodayHoliday: boolean
  operationScheduleRanges: OperationScheduleRange[]

  additionalInfo?: object
}

export type OperationScheduleRange = {
  dayOfWeeks: string[]
  from: number
  to: number
}

// Flow Table
export type Flow = {
  clientId: string
  flowId: string
  flowName: string
  createAt: string
  lastUpdated: string
  flowComponents: string[]
}

// FlowComponent Table
export type FlowComponent = {
  flowId: string
  componentId: string
  type:
    | 'Text'
    | 'Image'
    | 'VIDEO'
    | 'Button'
    | 'ImageButton'
    | 'ButtonGroup'
    | 'Card'
    | 'CardSlide'
    | 'StepperForm'
    | 'File'
  content:
    | TextContent
    | ImageContent
    | VideoContent
    | FileContent
    | ButtonContent
    | ButtonGroupContent
  nextComponentId?: string
  createAt: string
  lastUpdated: string
  sequence: number
}

export enum ChatUIModeType {
  INIT = 'init',
  NEW = 'new',
  CONTINUE = 'continue',
  END = 'end',
}

// <div className="content">
// <div className="content-head">
//   <div className="name">엘비유세스 IT개발/운영팀</div>
//   <div className="time">1일 전</div>
// </div>
// <div className="content-body">[폼: 담당자님 성함을 알려주세요.]</div>
// </div>
