import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import GptGuide from './components/GptGuide';
import {
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  GuideInfo as useGuideInfo,
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  userLoginState as useUserLoginState,
  hostInfoName as useHostInfoName,
} from 'store/ai';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import PromptBox from '../../components/PromptBox';
import { useSocketConnection } from 'hooks/useSocketConnection';
import { useNavigate } from 'react-router-dom';

export default function ChatRoom() {
  const resetGptChatHistoryStore = useResetRecoilState(useGptChatHistoryStore);
  const resetGptChatHistoryStreamState = useResetRecoilState(useGptChatHistoryStreamStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const setGuideInfo = useSetRecoilState(useGuideInfo);
  const userLoginState = useRecoilValue(useUserLoginState);
  const navigate = useNavigate();
  const hostInfoName = useRecoilValue(useHostInfoName);

  useSocketConnection();

  useEffect(() => {
    console.log(userLoginState.name);
    console.log(userLoginState.accessToken);
    getChatGuideData();
    return () => {
      setRoomInfoState((prev) => ({
        ...prev,
        roomId: 0,
      }));
      resetGptChatHistoryStreamState();
      resetGptChatHistoryStore();
    };
  }, []);

  const getChatGuideData = async () => {
    const response = await sendRequestProAI('/chatbot/contents', 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        if (response.data.result) {
          const data = response.data.data;
          showNotification('서버에서 정상적으로 받아왔습니다.', 'success');
          setGuideInfo(data);
        } else {
          showNotification('서버에서 정상적으로 받아오지 못했습니다.', 'error');
        }
      } else {
        navigate(`/${hostInfoName}`);
        showNotification('인증되지 않은 사용자입니다.', 'error');
      }
    } else {
      showNotification('서버에서 정상적으로 받아오지 못했습니다.', 'error');
      return;
    }
  };

  return (
    <div className='flex flex-row w-full h-full'>
      {/* content */}
      <div className='flex flex-col items-center justify-center w-full h-full bg-slate-100 scrollbar-hide overflow-y-auto'>
        <div className='flex flex-col w-full max-w-[62rem] h-full'>
          <GptGuide />
          <PromptBox />
        </div>
      </div>
    </div>
  );
}
