import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import {
  roomInfoState as useRoomInfoState,
  gptChatHistoryState as useGptChatHistoryStore,
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  userLoginState as useUserLoginState,
  sequenceQuestionState,
  chatbotDiffAdmnin as useChatbotDiffAdmnin,
  hostInfoName as useHostInfoName,
  roomStatusState as useRoomStatusState,
  isMakingQuestions as useIsMakingQuestions
} from 'store/ai';
import { showNotification } from 'utils/common-helper';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import useGetSequenceQuestions from './useGetSequenceQuestions';

type HeaderType = {
  'Content-Type'?: string;
};

function useSendPromptData() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  const hostInfoName = useRecoilValue(useHostInfoName);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const [isMakingQuestions, setIsMakingQuestions] = useRecoilState(useIsMakingQuestions);
  const [roomStatusState, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const setGptChatHistoryStreamStore = useSetRecoilState(useGptChatHistoryStreamStore);
  const [gptChatHistoryState, setGptChatHistoryState] = useRecoilState(useGptChatHistoryStore);
  // const seq = gptChatHistoryState.history.filter((item) => item.role === 'user').length;
  const nowTime: number = new Date().getTime();
  // const timeString: string = getTime.toString();
  // const nowTime: number = parseInt(timeString.substring(1, 10));
  const { getSequenceQuestions } = useGetSequenceQuestions();
  const setSequenceQuestionsList = useSetRecoilState<IProAIQuestions[]>(sequenceQuestionState);
  const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);

  const requestAnswerToMCL = async (userChatData: string, room_id: number, seq_num: number) => {
    setRoomInfoState((prev) => ({ ...prev, roomId: room_id }));
    setSequenceQuestionsList([]);
    console.log('***requestAnswerToMCL***', userChatData);
    if (userChatData !== '') {
      const response = await sendRequest(
        `/chat/${chatbotDiffAdmnin}/${room_id}?room_id=${roomInfoState.socketId}`,
        'post',
        undefined,
        [
          {
            role: 'user',
            content: userChatData,
            seq: seq_num,
          },
        ],
      );
      await getSequenceQuestions(room_id, seq_num);
      if (response && response.data) {
        console.log(response);
        console.log(gptChatHistoryState);
        if (response.data.code !== 'F002') {
          if (parseResponseData(response.data) != '') {
            const answer = parseResponseData(response.data);
          }
          setRoomStatusState((prev) => ({ ...prev, state: 'QUESTION' }));
          setRoomInfoState((prev) => ({ ...prev, sequence: seq_num }));
        } else {
          showNotification(response.data.message, 'error');
        }
      }
    }
  };

  const parseResponseData = (responseData: any): string => {
    let answer: string = '';
    if (responseData) {
      if (Array.isArray(responseData)) {
        if (responseData[0].text != '') {
          answer = responseData[0].text;
        }
      }
    }
    return answer;
  };

  const restfulHeader = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  
  const sendRequest = (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: any,
  ): Promise<any> => {
    const baseURL = connectionInfoState.restful;
    const requestOptions = {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
      responseType: 'stream',
    };
  
    const fetchWithTimeout = (url: string, options: RequestInit, timeout: number = 180000): Promise<Response> => {
      return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
    };
  
    const responseData = fetchWithTimeout(baseURL + url, requestOptions)
      .then(async (responseData) => {
        if (responseData && responseData.body) {
          const reader = responseData.body.getReader();
          if (reader) {
            let answer = '';
            let temp = '';
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                console.log('The stream was closed!');

                let ChatPlayAnswer: string = '';
                ChatPlayAnswer = answer;

                const history: ChatHistoryType = {
                  role: 'assistant',
                  content: ChatPlayAnswer,
                  seq: nowTime,
                };
                setGptChatHistoryState((prev) => ({
                  ...prev,
                  history: [...prev.history, history],
                }));
                return responseData;
              } else {
                const parseData: any = new TextDecoder('utf-8').decode(value);
                console.log('parseData: ', parseData);
                if (parseData && !parseData.includes("|🤖Pong!|")) {
                  const cleanedData = parseData.replaceAll('"', '');
                  temp += cleanedData;
                  if (temp.length > 0) {
                    answer += temp;
                    setGptChatHistoryStreamStore(answer);
                    temp = '';
                  }
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
        return null;
      })
      .finally(() => {
        setRoomStatusState((prev) => ({
          ...prev,
          chatUiState: 'FINISH',
          state: 'QUESTION',
        }));
        setGptChatHistoryStreamStore('');
        // setIsMakingQuestions(true);
      });

    return responseData;
  };
  
  const checkChatUiState = async (chatData) => {
    const NowPath = window.location.pathname
    const TargetPath = `/chatroom/${chatbotDiffAdmnin}/`

    if (NowPath === TargetPath && roomInfoState.roomId && roomInfoState.roomId !== 0) {
      setRoomStatusState((prev) => ({ ...prev, chatUiState: 'ING' }));
      addMessageToHistory('user', chatData, nowTime);
    } else {
      if (NowPath !== TargetPath) {
        console.log('새로운 대화방 자동 생성');
        navigate(`/chatroom/${chatbotDiffAdmnin}/${hostInfoName}`);
        await createNewChatRoom(chatData);
      } else {
        setRoomStatusState((prev) => ({ ...prev, chatUiState: 'ING' }));
        addMessageToHistory('user', chatData, nowTime);
      }
    }
  };

  const addMessageToHistory = (role: string, content: string, seq_num: number) => {
    // console.log("*****imhere*****",window.location.pathname, window.location.search)
    const newMessage = { role, content, seq_num };
    console.log('***addMessageToHistory***', newMessage);
    setGptChatHistoryState((prev) => ({
      ...prev,
      history: [...prev.history, newMessage],
    }));
    setRoomStatusState((prev) => ({ ...prev, state: 'QUESTION' }));
    setRoomInfoState((prev) => ({ ...prev, sequence: seq_num }));

    requestAnswerToMCL(content, roomInfoState.roomId, seq_num);
  };

  const createNewChatRoom = async (chat: string) => {
    console.log('***here is newchatroom***');
    console.log(chat);
    const response = await sendRequestProAI(`/chatroom/${chatbotDiffAdmnin}`, 'post', undefined, {});

    if (response && response.data && response.data.result) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        if (data && data.id) {
          console.log('대화방 ID: ', data.id);
          setGptChatHistoryState((prev) => {
            return {
              ...prev,
              history: [
                ...prev.history,
                {
                  role: 'user',
                  content: chat,
                  seq: nowTime,
                },
              ],
            };
          });

          setRoomInfoState((prev) => ({
            ...prev,
            roomId: data.id,
            sequence: nowTime,
          }));
          setRoomStatusState((prev) => ({
            ...prev,
            chatUiState: 'ING',
            state: 'CREATED',
          }));

          requestAnswerToMCL(chat, data.id, nowTime);
        }
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('새로운_대화방_생성중에_오류가_발생하였습니다', 'error');
      return;
    }
  };

  return {
    checkChatUiState,
    createNewChatRoom,
    requestAnswerToMCL,
  };
}

export default useSendPromptData;
