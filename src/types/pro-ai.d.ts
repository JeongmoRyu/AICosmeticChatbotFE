interface IChatPlayTimelineInfo {
  timeline: IChatPlayTimelineType[];
}

interface IChatPlayTimelineType {
  [key: string]: string;
}

interface IChatHistoryData {
  id: number;
  chatbot_id: number;
  reg_user_id: string;
  seq: number;
  title: string;
  created_at: string;
  updated_at: string;
}
interface ICardProps {
  img?: string;
  title?: string;
  text?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

interface IRoundImageLinkProps {
  imageUrl: string;
  altText?: string;
  text?: string;
  title?: string;
  source?: string;
  imgClassName?: string;
  onClick: () => void;
  isSelected?: boolean;
}

interface IChatHistoryDataSlider {
  selectedChatHistory: number | null;
  onClick: (id: number) => void;
}

interface IChatMessageProps {
  text: string;
  type?: 'NORMAL' | 'STREAM';
  onStreamingComplete?: () => void;
}

interface FeedbackAreaProps {
  index: number;
  seq: number;
  isOpen: boolean;
  handleFeedbackArea: (index: number) => void;
}

interface RoundImageLinkProps {
  to: string;
  imageUrl: string;
  altText?: string;
  imgClassName?: string;
  caption?: string;
  imgSize?: number;
}
interface ISliderProps {
  children: React.ReactNode;
  width?: string;
}

interface IChatItem {
  role: string;
  content: string;
  seq?: number;
}

interface IUSER_LOGIN_INFO {
  userId: string;
  email: string;
  name: string;
  mobile: string;
  company_name: string | null;
  company_id: string;
  is_company_admin: boolean;
  status: string;
  marketing_agreement_type: string;
  expiredDate: string;
  refreshToken: string;
  accessToken: string;
  joinType: string;
  company_registration_number: string | null;
}

interface IChatHistoryInfo {
  history: ChatHistoryType[];
}
type TRoomState = 'CREATED' | 'QUESTION';
type TchatUiState = 'READY' | 'ING' | 'FINISH';

interface IRoomInfo {
  socketId: string;
  roomId: number;
  sequence: number;
}

interface IRoomStatus {
  state: TRoomState;
  chatUiState: TchatUiState;
}

interface ICard {
  img: string;
  title: string;
  text: string;
}
interface IGuideInfo {
  title: { text: string };
  comment: { img: string; text: string };
  cards: ICard[];
}

interface IHeaderStyles {
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
}

interface IExtraProps {
  node: unknown;
}

interface TabbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Engine_Types {
  id: number;
  name: string;
}

interface Engine_Types {
  [{ key: string }];
}

interface IChatbotDataItem {
  user_id: string;
  id: string | number;
  name: string;
  client_info: string;
  llm_engine_vendor: string;
  retriever_engine_vendor: string;
  chatbot_type_cd: string;
  prompt_role: string;
  prompt_requirement: string;
  prompt_tail: string;
  llm_engine_id: string | number;
  tail_engine_id: string | number;
  created_at: string;
  updated_at: string;
  retriever_engine_id: string | number;
  rag_parameters: IEngineParameter[];
  llm_parameters: IEngineParameter[];
  tail_parameters: IEngineParameter[];
  questions: IProAIQuestions[];
  multi_turn: number;
}

interface IProAIQuestions {
  question: string;
}
interface SideBarAreaProps {
  SidebarState: boolean;
  handleSideBar: (index: number) => void;
}

interface IEngineParameter {
  label: string;
  key: string;
  range: {
    from: string;
    to: string;
  };
  mandatory: boolean;
  value: string;
}

interface ILLMEngineData {
  id: number;
  vendor: string;
  name: string;
  seq: number;
  apik: string;
  endpoint: string;
  model: string;
  version: string;
  parameters: IEngineParameter[];
  created_at: string;
  updated_at: string;
}

interface IRagEngineData {
  id: number;
  type: string;
  vendor: string;
  name: string;
  seq: number;
  apik: string;
  endpoint: string;
  model: string;
  version: string;
  parameters: IEngineParameter[];
  parameters_additional: any;
  created_at: string;
  updated_at: string;
}
interface IChatHistoryDataSlider {
  selectedChatHistory: number | null;
  onClick: (id: number) => void;
}
interface IChatHistoryTitle {
  id: number;
  title: string;
}


interface FUNCTION_CHECK_LIST {
  name: string;
  category: string;
  id: number;
  title: string;
  source?: string;
  text? : string;
  img? : string;
}

interface IChatLogDetail {
  chatroomId: number;
  seqNum: Long;
}

interface IDashBoardLogs {
  total_time: number;
  logs: IDashBoardLog[];
  chatbot_id: number;
  prompt_1: string;
  prompt_2: string;
}
interface IDashBoardLog {
  log: string;
  created_at: string;
  diff: number;
}


