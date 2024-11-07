import Slider from './Slider';
import Card from './Card';
import {
  GuideInfo as useGuideInfo,
  // chatbotDiffAdmnin as useChatbotDiffAdmnin,
  hostInfoName as useHostInfoName,
  gptChatHistoryState as useGptChatHistoryStore,
  sequenceQuestionState as useSequenceQuestions,
  isMakingQuestions as useIsMakingQuestions,
  chatbotIdState as useChatbotIdState
} from 'store/pro-ai';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { ChatMessage } from '../../chatUI/components/ChatMessage';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useSendPromptData from 'hooks/useSendPromptData';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

export default function GptGuide() {
  const navigate = useNavigate();
  const GuideInfo = useRecoilValue(useGuideInfo);
  const { createNewChatRoom } = useSendPromptData();
  // const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const hostInfoName = useRecoilValue(useHostInfoName);
  const isMakingQuestions = useRecoilValue(useIsMakingQuestions);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  const resetGptChatHistoryStore = useResetRecoilState(useGptChatHistoryStore);
  const resetSequenceQuestions = useResetRecoilState(useSequenceQuestions);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  const handleSelectCardQuestion = (question: string) => {
    navigate(`/chatroom/${chatbotIdState}`);
    resetGptChatHistoryStore();
    resetSequenceQuestions();
    if (question !== '') {
      createNewChatRoom(question);
    }
  };

  return (
    <>
      <div className='flex flex-col item-center justify-evenly w-full h-full overflow-y-auto'>
        <div className='flex flex-col justify-center items-center text-2xl my-10'>
          {GuideInfo.title.text ? (
            <p className='font-bold'>{GuideInfo?.title.text}</p>
          ) : (
            <Skeleton width={400} height={50} />
          )}
        </div>
        <div>
          <div className=' flex justify-center items-center mb-14'>
            <div className='flex bg-white rounded-xl border-none px-14 py-7 min-w-150'>
              {GuideInfo.comment.img ? (
                <img src={GuideInfo.comment.img} alt='icon' className='w-6 h-6 mr-10' />
              ) : (
                <Skeleton width={500} />
              )}
              <ChatMessage text={GuideInfo?.comment.text} />
            </div>
          </div>
          <div>
            <div className='flex ml-16 text-[#475569] font-bold text-lg'>
              <span>이런 질문은 어떠세요?</span>
            </div>
            <Slider>
              {GuideInfo.cards.length
                ? GuideInfo.cards.map((card, index) => (
                    <Card
                      key={index}
                      serverImg={
                        card.img
                          ? `${connectionInfoState.restful}/file/image/${card.img}`
                          : ''
                      }
                      img={card.img}
                      title={card.title}
                      text={card.text}
                      onClick={() => handleSelectCardQuestion(card.text)}
                      isDisabled={isMakingQuestions}
                    />
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className='p-4'>
                        <Skeleton width={256} height={300} />
                        <Skeleton count={2} />
                      </div>
                    ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}
