import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  sequenceQuestionState,
  roomInfoState as useRoomInfoState,
  // chatbotDiffAdmnin as useChatbotDiffAdmnin,
  isMakingQuestions as useIsMakingQuestions,
  chatbotIdState as useChatbotIdState,
} from 'store/pro-ai';
import { LOGIN } from 'data/routers';
import { useNavigate } from 'react-router-dom';

function useGetSequenceQuestions() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const setSequenceQuestionsList = useSetRecoilState<IProAIQuestions[]>(sequenceQuestionState);
  const roomInfoState = useRecoilValue(useRoomInfoState);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  // const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const [isMakingQuestions, setIsMakingQuestions] = useRecoilState(useIsMakingQuestions);
  const navigate = useNavigate();

  const getSequenceQuestions = async (room_id: number, seq: number): Promise<void> => {
    setSequenceQuestionsList([]);
    setIsMakingQuestions(true);
    const response = await sendRequestProAI(`/suggest/question/${chatbotIdState}/${room_id}/${seq}`, 'post');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        setSequenceQuestionsList(data);
        setIsMakingQuestions(false);
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
        setIsMakingQuestions(false);
      }
    } else {
      showNotification('추가 채팅 생성에 오류가 발생하였습니다', 'error');
      setIsMakingQuestions(false);
      return;
    }
  };

  return { getSequenceQuestions };
}

export default useGetSequenceQuestions;
