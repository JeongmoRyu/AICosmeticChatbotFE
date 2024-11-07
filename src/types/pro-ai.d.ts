interface IChatPlayTimelineInfo {
  timeline: IChatPlayTimelineType[];
}

interface IChatPlayTimelineType {
  [key: string]: string;
}

interface IManagerInfoType {
  token: string;
  id: string;
}

interface ILoginData {
  username: string;
  password: string;
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
  serverImg?: string;
}

interface IRoundImageLinkProps {
  title: string;
  onClick: () => void;
  imageUrl?: string;
  text?: string;
  source?: string;
  isSelected?: boolean;
}
interface IRoundImageLinkSubProps {
  onClick: () => void;
  imageUrl?: string;
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
  cardItem: CardChatbotType;
  to?: string;
  cardClick?: () => void;
  imgClassName?: string;
  imgSize?: number;
  navigateOptions?: Record<string, any>;
  isToggleBtnVisible?: boolean;
  onDeleteSuccess?: () => void;
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setChatbotItemState?: React.Dispatch<React.SetStateAction<CardChatbotType>>;
}

interface CardChatbotType {
  id: number;
  name: string;
  image?: string;
  embedding_status?: string;
  user_key: number;
  user_id?: string;
  user_name?: string;
  updated_at?: string;
  // embedding ing...
  cnt_complete?: number;
  cnt_error?: number;
  cnt_wait?: number;
  total_count?: number;
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
  is_company_super_admin: boolean;
  status: string;
  marketing_agreement_type: string;
  expiredDate: string;
  refreshToken: string;
  accessToken: string;
  joinType: string;
  company_registration_number: string | null;
  default_chatbot_id: number;
  user_key: number;
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

// interface IExtraProps {
//   node: unknown;
// }
interface IExtraProps {
  node: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;  
}

interface CodeBlockProps {
  language: string;
  code: string;
}

interface toggleListProps {
  id: string;
  label: string;
}

interface Engine_Types {
  id: number;
  name: string;
  parameters?: IEngineParameter[];
}

// interface Engine_Types {
//   [{ key: string }];
// }

interface LlmCommonType {
  memory_type: string;
  window_size: number;
}
interface CommonDataType {
  system_prompt: string;
  user_prompt: string;
  retry: number;
  llm_engine_id: number;
  fallback_engine_id: number;
}
interface ReproduceQuestionType extends CommonDataType {
  use_yn: boolean;
  parameters: IEngineParameter[];
}
interface RagType extends CommonDataType {
  use_yn: boolean;
  functions: number[];
  parameters: IEngineParameter[];
  embedding_type: IEmbeddingType[];
  embedding_engine_id: number;
  elastic_search: EsRagType;
  function_retry: number;
  function_llm_engine_id: number;
  function_fallback_engine_id: number;
}
interface EsRagType {
  retry: number;
  top_k: number;
  endpoint: number;
  parameters: IEngineParameter[];
}
interface RagFunctionsType {
  filter_prefix: string;
  name: string;
  description: string;
  pre_info_type: number[];
}
// interface RagFunctionsType {
//   function_id: number;
//   libraries: number[];
// }
interface IEmbeddingType {
  id: string;
  value: number;
}

interface RagPromptType extends CommonDataType {
  parameters: IEngineParameter[];
}
interface LLMType extends CommonDataType {
  use_yn: boolean;
  parameters: IEngineParameter[];
}

interface IChatbotDataItem {
  id: number;
  name: string;
  embedding_status: string;
  description: string;
  img_file_id?: number[]; // put, post 사용
  llm_common: LlmCommonType;
  reproduce_question: ReproduceQuestionType;
  rag: RagType;
  normal_conversation: LLMType;
  imgfile_id: string;
  public_use_yn: boolean;
  hidden_yn?: boolean;
}

// interface IChatbotDataItem {
//   chatbot_id: number;
//   name: string;
//   description: string;
//   llm_common: LlmCommonType;
//   reproduce_question: ReproduceQuestionType;
//   rag: RagType;
//   llm: LLMType;
// }

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
  text?: string;
  img?: string;
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
  tokens: number;
}

interface FileType {
  id: number;
  name: string;
  size: number;
  type: string;
  file?: File;
  index?: number;
  isNewFile?: boolean;
}

interface SelectListType {
  value: number;
  id: string;
  text: string;
  parameters?: IEngineParameter;
}
interface SelectListCodeType {
  value: string;
  // id: string;
  text: string;
  parameters?: IEngineParameter;
}

interface EngineCodeTypes {
  cd_id: number;
  name: string;
  parameters?: IEngineParameter[];
}


interface CheckListType {
  id: string;
  value: number;
  labelText: string;
  isChecked: boolean;
}
// functions list 선택 모달에서 사용
interface FunctioncallItem extends CheckListType {
  url: string;
  text?: string;

  pre_info_type?: number[];
  use_yn?: string;
  created_at?: string;
  updated_at?: string;
}

interface LibraryItemType extends CheckListType {
  description: string;
  img_path: string;
  link: StringOrNull;
  created_at: string;
  updated_at: string;
}

interface ChatbotType {
  id: number;
  name: string;
  image?: string;
  embedding_status?: string;
  user_key: number;
  // embedding ing...
  cnt_complete?: number;
  cnt_error?: number;
  cnt_wait?: number;
  total_count?: number;
}

// index > functions 에서 사용
interface FunctionsType {
  id: number;
  chatbot_id: number;
  name: string;
  description: string;
  img_path: string;
  pre_info_type: number[];
  use_yn: string;
  created_at: string;
  updated_at: string;
  user_key: number;
  user_id?: string;
  user_name?: string;
  updated_at?: string;
}

interface DefaultFunctionsValueType {
  // chatbot_id: number | null;
  // created_at: string;
  description: string;
  file_list: FileType[];
  filter_prefix: string;
  id: number;
  img_path: string;
  name: string;
  pre_info_type: number[];
  question_image: string;
  question_name: string;
  question_detail: string;
  // updated_at: string;
  // use_yn: 'Y' | 'N' | null;
}

interface ChatStatusType {
  cnt_processing: number;
  functions: [
    {
      cnt_processing: number;
      total_count: number;
      cnt_complete: number;
      function_id: number;
      cnt_wait: number;
      cnt_error: number;
    },
  ];
  total_count: number;
  cnt_complete: number;
  cnt_wait: number;
  chatbot_id: number;
  cnt_error: number;
}

interface UserListType {
  username: string; // 로그인ID
  password: stringOrNull;
  name: string; // 사용자 이름
  sex: 'M' | 'F' | null; // 성별
  birth_year: stringOrNull; // 출생년도
  is_admin: boolean; // 어드민 계정 여부
  is_super_admin: boolean; // 어드민 계정 여부
  user_key?: number;
}
