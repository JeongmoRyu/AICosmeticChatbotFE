import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import ico_skin_note from 'assets/images/icons/ico_skin_note.svg';
import ico_weather from 'assets/images/icons/ico_weather.svg';
import ico_alarm from 'assets/images/icons/ico_alarm.svg';
import ico_time from 'assets/images/icons/ico_time.svg';
import ico_pims from 'assets/images/icons/ico_pims.svg';
import ico_skins from 'assets/images/icons/ico_skins.svg';
import ico_info from 'assets/images/icons/ico_info.svg';

const { persistAtom } = recoilPersist();

export const DEFAULT_CHATBOT_ID = 11;

export const initialUserLoginState: IUSER_LOGIN_INFO = {
  userId: '',
  email: '',
  name: '',
  mobile: '',
  company_name: '',
  company_id: '',
  is_company_admin: false,
  is_company_super_admin: false,
  status: '',
  marketing_agreement_type: '',
  expiredDate: '',
  refreshToken: '',
  accessToken: '',
  joinType: '',
  company_registration_number: '',
  default_chatbot_id: DEFAULT_CHATBOT_ID,
  user_key: 0,
  //accessToken: testToken
};

const userLoginState = atom<IUSER_LOGIN_INFO>({
  key: 'userLoginInfoMaumAi',
  default: initialUserLoginState,
  effects_UNSTABLE: [persistAtom],
});

const userAuthority = atom<string>({
  key: 'userAuthority',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

const hostInfoName = atom<string>({
  key: 'hostInfoName',
  default: '',
});
const chatbotIdState = atom<number>({
  key: 'chatbotIdState',
  default: DEFAULT_CHATBOT_ID,
  effects_UNSTABLE: [persistAtom],
});
const gptChatHistoryStreamState = atom<string>({
  key: 'gptChatHistoryStreamState',
  default: '',
});

const gptChatHistoryState = atom<IChatHistoryInfo>({
  key: 'gptChatHistoryState',
  default: {
    history: [],
  },
  effects_UNSTABLE: [persistAtom],
});

const roomInfoState = atom<IRoomInfo>({
  key: 'roomInfoState',
  default: {
    socketId: '',
    roomId: 0,
    sequence: 0,
  },
  effects_UNSTABLE: [persistAtom],
});

const roomStatusState = atom<IRoomStatus>({
  key: 'roomStatusState',
  default: {
    state: 'CREATED',
    chatUiState: 'READY',
  },
});

const sequenceQuestionState = atom<IProAIQuestions[]>({
  key: 'sequenceQuestionState',
  default: [],
});

const GuideInfo = atom<IGuideInfo>({
  key: 'GuideInfo',
  default: {
    title: { text: '' },
    comment: { img: '', text: '' },
    cards: [],
  },
});

const chatBuilderGptEngine = atom<string>({
  key: 'chatBuilderGptEngine',
  default: 'chatgpt3.5',
});
const chatbotDiffAdmnin = atom<number>({
  key: 'chatbotDiffAdmnin',
  default: 2,
});

const ProAIChatTimelineState = atom<IChatPlayTimelineInfo>({
  key: 'ProAIChatTimelineState',
  default: {
    timeline: [],
  },
});

const chatBuilderState = atom({
  key: 'chatBuilderState',
  default: {
    instructionModel: 0,
    name: '',
    description: '',
    instructions: '',
    functions: [],
    conversationStarter: '',
    knowledge: '',
    actions: [],
  },
});

const checkedId = atom<string>({
  key: 'checkedId',
  default: '2',
});

const chatbotData = atom<[]>({
  key: 'chatbotData',
  default: [],
});

const AddFunctionCheckList = atom<FUNCTION_CHECK_LIST[]>({
  key: 'AddFunctionCheckList',
  default: [],
});
const isMakingQuestions = atom<boolean>({
  key: 'isMakingQuestions',
  default: false,
});
const LLMEngineSelectList = atom<SelectListType[] | undefined>({
  key: 'LLMEngineSelectList',
  default: undefined,
});
const LLMOpenAIEngineSelectList = atom<SelectListType[] | undefined>({
  key: 'LLMOpenAIEngineSelectList',
  default: undefined,
});
const RAGEngineSelectList = atom<SelectListType[] | undefined>({
  key: 'RAGEngineSelectList',
  default: undefined,
});
const ESEngineSelectList = atom<SelectListType[] | undefined>({
  key: 'ESEngineSelectList',
  default: undefined,
});
const EREngineSelectList = atom<SelectListType[] | undefined>({
  key: 'EREngineSelectList',
  default: undefined,
});
const SemanticChunkingBPType = atom<SelectListCodeType[] | undefined>({
  key: 'SemanticChunkingBPType',
  default: undefined,
});
const SemanticChunkingEmbedding = atom<SelectListCodeType[] | undefined>({
  key: 'SemanticChunkingEmbedding',
  default: undefined,
});

const AddFunctionCall = atom<string | undefined>({
  key: 'AddFunctionCall',
  default: undefined,
});
const ActionsApiList = atom<FunctioncallItem[]>({
  key: 'ActionsApiList',
  default: [
    {
      value: 0,
      id: 'actions_skin_note',
      labelText: '스킨 노트',
      text: '비대면 피부 관리 서비스',
      url: ico_skin_note,
      isChecked: false,
    },
    {
      value: 1,
      id: 'actions_pims',
      labelText: 'PIMS',
      text: '상품 정보 관리 시스템',
      url: ico_pims,
      isChecked: false,
    },
    {
      value: 2,
      id: 'actions_skins',
      labelText: 'SKINS',
      text: '아모레 시티랩 데이터 기반 상담 서비스',
      url: ico_skins,
      isChecked: false,
    },
    {
      value: 3,
      id: 'actions_product_info',
      labelText: '상품 정보',
      text: '아모레 몰 상품 정보 안내',
      url: ico_info,
      isChecked: false,
    },
    {
      value: 4,
      id: 'actions_weather',
      labelText: '날씨 알림',
      text: '날씨 알림 서비스',
      url: ico_weather,
      isChecked: false,
    },
    {
      value: 5,
      id: 'actions_alarm',
      labelText: '리마인더',
      text: '리마인드 알림 서비스',
      url: ico_alarm,
      isChecked: false,
    },
    {
      value: 6,
      id: 'actions_time',
      labelText: '시계',
      text: '시간 연동 서비스',
      url: ico_time,
      isChecked: false,
    },
  ],
});
const isLoadingState = atom<boolean>({
  key: 'isLoadingState',
  default: false,
});
const isChatbotImageRefresh = atom<boolean>({
  key: 'isChatbotImageRefresh',
  default: false,
});

export {
  gptChatHistoryStreamState,
  gptChatHistoryState,
  chatBuilderGptEngine,
  GuideInfo,
  ProAIChatTimelineState,
  userLoginState,
  userAuthority,
  chatBuilderState,
  chatbotIdState,
  checkedId,
  chatbotData,
  roomInfoState,
  sequenceQuestionState,
  chatbotDiffAdmnin,
  hostInfoName,
  AddFunctionCheckList,
  roomStatusState,
  isMakingQuestions,
  LLMEngineSelectList,
  LLMOpenAIEngineSelectList,
  RAGEngineSelectList,
  ESEngineSelectList,
  AddFunctionCall,
  ActionsApiList,
  isLoadingState,
  isChatbotImageRefresh,
  SemanticChunkingBPType,
  SemanticChunkingEmbedding,
  EREngineSelectList
};
