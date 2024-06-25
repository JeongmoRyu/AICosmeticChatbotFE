import { useEffect, useState } from 'react';
import Slider from '../../chatRoom/components/Slider';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import CatIcon from 'assets/images/image/img_cat.png';
import ElephantIcon from 'assets/images/image/img_elephant.png';
import GiraffeIcon from 'assets/images/image/img_giraffe.png';
import RabbitIcon from 'assets/images/image/img_rabbit.png';
import {
  roomStatusState as useRoomStatusState,
  chatbotDiffAdmnin as useChatbotDiffAdmnin,
  isMakingQuestions as useIsMakingQuestions,
} from 'store/ai';
import { useRecoilState, useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ChatHistorySlider = ({ selectedChatHistory, onClick }: IChatHistoryDataSlider) => {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [chatbotHistoryTitle, setChatbotHistoryTitle] = useState<IChatHistoryTitle[]>([]);
  const [roomStatusState, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const isMakingQuestions = useRecoilValue(useIsMakingQuestions);

  const getImageSrc = (index: number) => {
    switch (index % 4) {
      case 0:
        return CatIcon;
      case 1:
        return ElephantIcon;
      case 2:
        return GiraffeIcon;
      case 3:
        return RabbitIcon;
      default:
        return CatIcon;
    }
  };

  const getChatbothistoryTitle = async () => {
    const response = await sendRequestProAI(`/chatroom/${chatbotDiffAdmnin}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        setChatbotHistoryTitle(response.data.data);
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('채팅 기록 획득에 오류가 발생하였습니다', 'error');
    }
  };

  useEffect(() => {
    getChatbothistoryTitle();
  }, [roomStatusState.state]);

  return (
    <Slider width='w-[800px]'>
      {chatbotHistoryTitle && chatbotHistoryTitle.length > 0
        ? chatbotHistoryTitle.map((historyTitle, index) => (
            <button
              type='button'
              key={`historytitle_${index}`}
              className={`flex text-center items-center justify-center w-[200px] h-[56px] bg-[#e7ecf1] rounded-full cursor-pointer ${isMakingQuestions ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary-default hover:text-white'} ${
                selectedChatHistory === historyTitle.id ? 'bg-primary-default text-white' : ''
              }`}
              onClick={() => onClick(historyTitle.id)}
              disabled={isMakingQuestions}
            >
              <img src={getImageSrc(index)} alt='history' className='w-10 h-10 mr-4' />
              <div className='max-w-32 text-ellipsis overflow-hidden whitespace-nowrap'>
                {historyTitle.title ? historyTitle.title : index + 1}
              </div>
            </button>
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton_${index}`}
              className='flex items-center justify-center w-[200px] h-[56px] bg-[#e7ecf1] rounded-full'
            >
              <Skeleton circle={true} height={40} width={40} />
              <Skeleton width={140} height={24} style={{ marginLeft: '16px' }} />
            </div>
          ))}
    </Slider>
  );
};

export default ChatHistorySlider;
