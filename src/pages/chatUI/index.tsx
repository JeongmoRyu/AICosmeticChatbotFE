import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  roomStatusState as useRoomStatusState,
  ProAIChatTimelineState as useProAIChatTimelineStore,
  sequenceQuestionState,
  userLoginState as useUserLoginState,
  isMakingQuestions as useIsMakingQuestions,
} from 'store/ai';
import { replaceWithBr } from 'utils/chat';
import ico_pro_ai_fill from 'assets/images/icons/ico_pro_ai_fill.svg';
import ico_user from 'assets/images/icons/ico_user_s.svg';
import EnterIcon from 'assets/images/icons/ico_enter.svg';
import { ChatMessage } from './components/ChatMessage';
import PromptBox from '../../components/PromptBox';
import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import ChatHistorySlider from './components/ChatHistorySlider';
import ToggleMenu from './components/ToggleMenu';
import FeedbackArea from './components/FeedbackArea';
import Sidebar from './components/Sidebar';
import useSendPromptData from 'hooks/useSendPromptData';
import useGetSequenceQuestions from 'hooks/useGetSequenceQuestions';
import { TailSpin } from 'react-loader-spinner';
import 'assets/styles/chat.scss';

export default function ChatUI() {
  const refChatlist = useRef<HTMLDivElement>(null);
  const [selectedChatHistory, setSelectedChatHistory] = useState<number | null>(0);
  const [openFeedbackArea, setOpenFeedbackArea] = useState<Record<number, boolean>>({});
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [gptChatHistoryState, setGptChatHistoryState] = useRecoilState(useGptChatHistoryStore);
  const [isMakingQuestions, setIsMakingQuestions] = useRecoilState(useIsMakingQuestions);
  const [gptChatHistoryStreamState, setGptChatHistoryStreamState] = useRecoilState(useGptChatHistoryStreamStore);
  const resetProAIChatTimelineState = useResetRecoilState(useProAIChatTimelineStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const [roomStatusState, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const sequenceQuestionsList = useRecoilValue(sequenceQuestionState);
  const userLoginState = useRecoilValue(useUserLoginState);
  const resetSequenceQuestions = useResetRecoilState(sequenceQuestionState);
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const { requestAnswerToMCL } = useSendPromptData();
  const { getSequenceQuestions } = useGetSequenceQuestions();
  const [siderBarOpen, setSiderBarOpen] = useState<boolean>(false);
  const [logData, setLogData] = useState<IDashBoardLogs>({
    total_time: 0,
    logs: [],
    chatbot_id: 0,
    prompt_1: '',
    prompt_2: '',
  });
  const [activeSideTab, setActiveSideTab] = useState<'setting' | 'testlog'>('setting');

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
      console.log('*** reset GptHistory ***');
    }
  }, [gptChatHistoryState, gptChatHistoryStreamState]);

  const handleSelectQuestion = (question: string) => {
    console.log(question);
    const nowTime: number = new Date().getTime();

    requestAnswerToMCL(question, roomInfoState.roomId, nowTime);

    setGptChatHistoryState((prev) => {
      // const userMessagesCount = prev.history.filter((item) => item.role === 'user').length;

      return {
        ...prev,
        history: [
          ...prev.history,
          {
            role: 'user',
            content: question,
            seq: nowTime,
          },
        ],
      };
    });
    setRoomStatusState((prev) => ({
      ...prev,
      chatUiState: 'ING',
    }));
  };
  const handleSelectChatHistory = (index: number) => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: index,
    }));
    setSelectedChatHistory(index);
    getChatRoomhistorycontent(index);
    setOpenFeedbackArea({});
    resetProAIChatTimelineState();
  };

  const handleFeedbackArea = (index: number) => {
    setOpenFeedbackArea((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getChatRoomhistorycontent = async (chatroomid: number) => {
    const response = await sendRequestProAI(`/chatroom/detail/${chatroomid}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        const changedHistory = data.map((item: IChatItem) => ({
          role: item.role,
          content: item.content,
          seq: item.seq,
        }));
        // const list_num = changedHistory.filter((item) => item.role === 'user').length;

        setGptChatHistoryState({ history: changedHistory });
        if (
          gptChatHistoryState.history.length > 0 &&
          gptChatHistoryState.history[gptChatHistoryState.history.length - 1]['role'] === 'assistant'
        ) {
          getSequenceQuestions(
            chatroomid,
            gptChatHistoryState.history[gptChatHistoryState.history.length - 1]['seq'] as number,
          );
        }
        // setIsMakingQuestions(true);
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('채팅 기록 획득에 오류가 발생하였습니다', 'error');
      return;
    }
  };
  const editChat = () => {
    setSiderBarOpen(!siderBarOpen);
    activeSideTab === 'testlog' && setActiveSideTab('setting');
  };

  const handleStreamingComplete = () => {
    setGptChatHistoryStreamState('');
  };
  const handleChatLog = (chatroomId, seqNum) => {
    getDashboardlogs(chatroomId, seqNum);
    !siderBarOpen && setSiderBarOpen(true);
    activeSideTab === 'setting' && setActiveSideTab('testlog');
  };
  const getDashboardlogs = async (chatroomId, seqNum) => {
    const response = await sendRequestProAI(`/maum-admin/api/logs/?room_id=${chatroomId}&seq=${seqNum}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        console.log(response.data);
        setLogData(response.data);
        console.log(logData);
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('채팅 기록 획득에 오류가 발생하였습니다', 'error');
    }
  };

  return (
    <div className='page_chat'>
      <div className='chatting_box'>
        <div className='flex items-center mt-14 min-w-0'>
          <ToggleMenu handleEdit={editChat} />

          <div className='w-[1px] h-10 bg-[#888] border' />
          <ChatHistorySlider onClick={handleSelectChatHistory} selectedChatHistory={selectedChatHistory} />
        </div>
        <div id='chatbotContentBody' className='h-[calc(100vh-21rem)] min-h-[150px] overflow-y-auto mt-2 scroll-pr-6'>
          <ul className='flex flex-col mx-auto text-[#111111] text-base text-left break-keep'>
            {gptChatHistoryState &&
              gptChatHistoryState.history.map((item, index) => {
                if (item.role == 'user') {
                  return (
                    <li
                      key={`chatuser_${index}`}
                      className='flex w-full p-7 rounded-[0.625rem] bg-[#e7ecf1] mt-7 text-sm'
                    >
                      <div className='h-full w-28'>
                        <div className='flex flex-row justify-center items-start'>
                          <img src={ico_user} alt='user' />
                        </div>
                      </div>
                      <p
                        className='w-full'
                        dangerouslySetInnerHTML={{
                          __html: replaceWithBr(item.content as string),
                        }}
                      />
                      <div
                        onClick={() => handleChatLog(roomInfoState.roomId, item.seq)}
                        className='cursor-pointer hover:bg-gray-100 rounded'
                      >
                        [더보기]
                      </div>
                    </li>
                  );
                } else if (item.role == 'assistant') {
                  // const lastAssistantIndex = gptChatHistoryState.history.reduce((acc, curr, idx) => {
                  //   return curr.role === 'assistant' ? idx : acc;
                  // }, -1);

                  // if (gptChatHistoryStreamState && index === lastAssistantIndex) {
                  //   return null;
                  // }
                  return (
                    <React.Fragment key={`chatassistant_${index}`}>
                      <li className='flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm'>
                        <div className='h-full w-28'>
                          <div className='flex flex-col items-center justify-center'>
                            <img className='w-6' src={ico_pro_ai_fill} alt='chatgpt' />
                          </div>
                        </div>
                        <div className='flex flex-col w-full'>
                          <ChatMessage text={item.content as string} />
                        </div>
                      </li>
                      <div className='mt-2 ml-10'>
                        <div
                          className='flex items-center cursor-pointer w-fit'
                          onClick={() => handleFeedbackArea(index)}
                        >
                          <img src={EnterIcon} alt='enter' className='mr-2' />
                          <div className='text-sm text-bd-darkgray'>피드백 남기기</div>
                        </div>
                        {openFeedbackArea[index] && (
                          <FeedbackArea
                            index={index}
                            seq={item.seq as number}
                            isOpen={openFeedbackArea[index]}
                            handleFeedbackArea={handleFeedbackArea}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                }
              })}

            {gptChatHistoryStreamState && roomStatusState.chatUiState !== 'FINISH' ? (
              <li className='flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm'>
                <div className='h-full w-28'>
                  <div className='flex flex-col items-center justify-start'>
                    <img className='w-6' src={ico_pro_ai_fill} alt='chatgpt' />
                  </div>
                </div>
                <ChatMessage
                  text={gptChatHistoryStreamState}
                  type='STREAM'
                  // onStreamingComplete={handleStreamingComplete}
                />
              </li>
            ) : null}
            <li>
              <div ref={refChatlist}></div>
            </li>
          </ul>
          <ul className='flex w-full justify-end'>
            {isMakingQuestions ? (
              <div className='h-[50px] flex justify-start w-[80%]'>
                <TailSpin
                  height='40'
                  width='40'
                  color='#316094'
                  ariaLabel='tail-spin-loading'
                  radius='4'
                  wrapperStyle={{}}
                  wrapperClass=''
                  visible={true}
                />
              </div>
            ) : sequenceQuestionsList && sequenceQuestionsList.length > 0 ? (
              sequenceQuestionsList.slice(0, 3).map((item, index) => (
                <button
                  type='button'
                  key={`sequenceQ_${index}`}
                  className={`flex items-center justify-center border w-64 h-[50px] rounded-2xl cursor-pointer border-primary-default bg-white text-bd-darkgray text-primary-default  hover:bg-primary-default hover:text-white mt-1 ml-4`}
                  onClick={() => handleSelectQuestion(item['question'])}
                >
                  <div className='flex h-[48px] max-w-60 text-sm text-ellipsis overflow-hidden px-3 max-h-10'>
                    {item['question']}
                  </div>
                </button>
              ))
            ) : (
              <div className='h-[50px]'></div>
            )}
          </ul>
        </div>
        <PromptBox />
      </div>
      <Sidebar
        SidebarState={siderBarOpen}
        handleSideBar={editChat}
        logData={logData}
        activeTab={activeSideTab}
        setActiveTab={setActiveSideTab}
      />
    </div>
  );
}
