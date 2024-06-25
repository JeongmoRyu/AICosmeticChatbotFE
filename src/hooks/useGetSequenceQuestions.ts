import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  sequenceQuestionState,
  roomInfoState as useRoomInfoState,
  chatbotDiffAdmnin as useChatbotDiffAdmnin,
  isMakingQuestions as useIsMakingQuestions
} from 'store/ai';
import { useEffect, useState } from 'react';



function useGetSequenceQuestions() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const setSequenceQuestionsList = useSetRecoilState<IProAIQuestions[]>(sequenceQuestionState);
  const roomInfoState = useRecoilValue(useRoomInfoState);
  const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const [isMakingQuestions, setIsMakingQuestions] = useRecoilState(useIsMakingQuestions);

  const getSequenceQuestions = async (room_id: number, seq: number): Promise<void> => {
    setSequenceQuestionsList([]);
    setIsMakingQuestions(true);
    const response = await sendRequestProAI(`/suggest/question/${chatbotDiffAdmnin}/${room_id}/${seq}`, 'post');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        setSequenceQuestionsList(data);
        setIsMakingQuestions(false);
      } else {
        showNotification(response.data.message, 'error');
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
