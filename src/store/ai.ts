import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const initialUserLoginState: IUSER_LOGIN_INFO = {
  userId: '',
  email: '',
  name: '',
  mobile: '',
  company_name: '',
  company_id: '',
  is_company_admin: false,
  status: '',
  marketing_agreement_type: '',
  expiredDate: '',
  refreshToken: '',
  accessToken: '',
  joinType: '',
  company_registration_number: '',
  //accessToken: testToken
};

const userLoginState = atom<IUSER_LOGIN_INFO>({
  key: 'userLoginInfoMaumAi',
  default: initialUserLoginState,
  effects_UNSTABLE: [persistAtom],
});
const hostInfoName = atom<string>({
  key: 'hostInfoName',
  default: ''
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
    sequence: 0
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
  key: "checkedId",
  default: "2",
});

const chatbotData = atom<[]>({
  key: "chatbotData",
  default: [],
});

const settingDetailState = atom<IChatbotDataItem>({
  key: 'settingDetailState',
  default: {
    user_id: '',
    client_info: '',
    id: 0,
    name: '',
    llm_engine_vendor: '',
    retriever_engine_vendor: 'MAUMAI',
    chatbot_type_cd: 'AMR',
    prompt_role: '',
    prompt_requirement: '',
    prompt_tail: '',
    llm_engine_id: '',
    created_at: '',
    updated_at: '',
    retriever_engine_id: '',
    tail_engine_id: '',
    rag_parameters: [],
    llm_parameters: [],
    tail_parameters: [],
    questions: [],
    multi_turn: 5,
  },
});

const AddFunctionCheckList = atom<FUNCTION_CHECK_LIST[]>({
  key: "AddFunctionCheckList",
  default: [],
});

const isMakingQuestions = atom<boolean>({
  key: 'isMakingQuestions',
  default: false,
});

export {
  gptChatHistoryStreamState,
  gptChatHistoryState,
  chatBuilderGptEngine,
  GuideInfo,
  ProAIChatTimelineState,
  userLoginState,
  chatBuilderState,
  checkedId,
  chatbotData,
  roomInfoState,
  sequenceQuestionState,
  chatbotDiffAdmnin,
  settingDetailState,
  hostInfoName,
  AddFunctionCheckList,
  roomStatusState,
  isMakingQuestions
};
