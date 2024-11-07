import { useEffect, useRef } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryState as useGptChatHistoryStore,
  ProAIChatTimelineState as useProAIChatTimelineStore,
  sequenceQuestionState,
} from 'store/pro-ai';
import { replaceWithBr } from 'utils/chat';
import ico_chatgpt_20_on from '/src/assets/images/icons/ico_chatgpt_20_on.svg';
import ico_user from 'assets/images/icons/ico_user_s.svg';
import { ChatMessage } from 'pages/chatUI/components/ChatMessage';
import PromptBox from 'components/PromptBox';
import 'assets/styles/chat.scss';

export default function TestChatting() {
  const refChatlist = useRef<HTMLDivElement>(null);
  const gptChatHistoryState = useRecoilValue(useGptChatHistoryStore);
  const resetProAIChatTimelineState = useResetRecoilState(useProAIChatTimelineStore);
  const resetSequenceQuestions = useResetRecoilState(sequenceQuestionState);
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);

  useEffect(() => {
    resetSequenceQuestions();
    return () => {
      console.log('*** Unmount Reset ***');
      resetGptChatHistroyState();
      resetProAIChatTimelineState();
    };
  }, []);

  useEffect(() => {
    if (gptChatHistoryState && gptChatHistoryState.history.length > 0) {
      if (refChatlist && refChatlist.current) {
        refChatlist.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // console.log('*** reset GptHistory ***');
    }
  }, [gptChatHistoryState]);

  return (
    <>
      <div id='chatbotContentBody' className='flex-1 min-h-[150px] overflow-y-auto mt-2 scroll-pr-6'>
        <ul className='flex flex-col mx-auto text-[#111111] text-base text-left break-keep'>
          {gptChatHistoryState &&
            gptChatHistoryState.history.map((item, index) =>
              item.role == 'user' ? (
                <li key={`chatuser_${index}`} className='flex w-full p-7 rounded-[0.625rem] bg-[#e7ecf1] mt-7 text-sm'>
                  <div className='pr-[10px]'>
                    <img src={ico_user} alt='user' />
                  </div>
                  <p
                    className='w-full'
                    dangerouslySetInnerHTML={{
                      __html: replaceWithBr(item.content as string),
                    }}
                  />
                </li>
              ) : item.role == 'assistant' ? (
                <li
                  key={`chatassistant_${index}`}
                  className='flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm'
                >
                  <div className='pr-[10px]'>
                    <img className='w-6' src={ico_chatgpt_20_on} alt='Chathub' />
                  </div>
                  <div className='flex flex-col w-full'>
                    <ChatMessage text={item.content as string} />
                  </div>
                </li>
              ) : (
                <></>
              ),
            )}
          <li>
            <div ref={refChatlist}></div>
          </li>
        </ul>
        <div className='h-[20px]'></div>
      </div>
      <PromptBox isTest={true} />
    </>
  );
}
