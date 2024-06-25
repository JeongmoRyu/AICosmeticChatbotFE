import { atom } from 'recoil';
// export interface GptHistoryType {
//   [key: string]: string;
// }
interface ChatHistoryInfo {
  history: ChatHistoryType[];
}

interface ChatUiInfo {
  type: 'GUIDE' | 'CHAT';
  isChatting: boolean;
  isShowing: boolean;
  state: 'READY' | 'ING' | 'FINISH';
}

const selectRoomState = atom<string>({
  key: 'selectRoomState',
  default: '',
});

const selectRefSentenceState = atom<string>({
  key: 'selectRefSentenceState',
  default: '',
});

const gptChatHistoryStreamState = atom<string>({
  key: 'gptChatHistoryStreamState',
  default: '',
});

const gptChatHistoryState = atom<ChatHistoryInfo>({
  key: 'gptChatHistoryState',
  default: {
    history: [],
  },
});

const chatUiState = atom<ChatUiInfo>({
  key: "chatUiState",
  default: {
    type: 'GUIDE',
    isChatting: false,
    isShowing: false,
    state: 'READY',
  },
});

const chatGptEngine = atom<string>({
  key: 'chatGptEngine',
  default: 'chatgpt4',
});

export {
  gptChatHistoryStreamState,
  gptChatHistoryState,
  chatUiState,
  chatGptEngine,
  selectRoomState,
  selectRefSentenceState,
};
