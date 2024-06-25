import { useState, useRef, CSSProperties } from 'react';
import { useRecoilValue } from 'recoil';
import { TailSpin } from 'react-loader-spinner';
import { roomStatusState as useRoomStatusState, isMakingQuestions as useIsMakingQuestions } from 'store/ai';
import { showNotification } from 'utils/common-helper';
import ico_send_on from 'assets/images/icons/ico_send_on.svg';
import ico_send from 'assets/images/icons/ico_send.svg';
import useSendPromptData from 'hooks/useSendPromptData';

export default function PromptBox() {
  const { checkChatUiState } = useSendPromptData();
  const [requestPrompt, setRequestPrompt] = useState<string>('');
  const [promptBoxStyle, setPromptBoxStyle] = useState<CSSProperties>({});
  const roomStatusState = useRecoilValue(useRoomStatusState);
  const isMakingQuestions = useRecoilValue(useIsMakingQuestions);
  const refRowCount = useRef<number>(0);

  const handleOnChangeChat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const chatData = e.target.value;
    updatePromptBoxStyle(chatData);
    setRequestPrompt(chatData);
  };

  const updatePromptBoxStyle = (chatData: string) => {
    const count = chatData.split('\n').length - 1;
    if (refRowCount.current !== count) {
      refRowCount.current = count;
      const curHeight = 66 + 16 * refRowCount.current + 'px';
      setPromptBoxStyle({ height: curHeight });
    }
    if (chatData === '') {
      refRowCount.current = 0;
      setPromptBoxStyle({ height: '64px' });
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('handleOnKeyDown');
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (requestPrompt.trim()) {
        checkChatUiState(requestPrompt);
        setRequestPrompt('');
      }
    }
  };

  const handleClickSendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleClickSendRequest', requestPrompt);
    e.preventDefault();
    if (!requestPrompt.trim()) {
      showNotification('질문 또는 요청할 데이터가 존재하지 않습니다', 'error');
      return;
    }
    checkChatUiState(requestPrompt);
    setRequestPrompt('');
  };

  return (
    <div className='relative flex flex-col justify-center items-center w-full text-sm mt-2 bg-slate-100'>
      {roomStatusState.chatUiState === 'ING' && (
        <div className='flex justify-center items-center fixed top-0 left-0 z-99 w-full h-full bg-black bg-opacity-20'>
          <TailSpin
            height='80'
            width='80'
            color='#316094'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
      <textarea
        id='promptbox'
        value={requestPrompt}
        className='prompt-box'
        placeholder='AI Chat에게 질문 또는 요청을 해보세요'
        onChange={handleOnChangeChat}
        onKeyPress={handleOnKeyDown}
        disabled={roomStatusState.chatUiState === 'ING' || isMakingQuestions}
        style={promptBoxStyle}
      />
      <button
        type='button'
        className={`absolute right-[10px] top-0 bottom-0 w-10 h-10 my-[auto] ${isMakingQuestions ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}  ${requestPrompt.trim() && 'bg-primary-default'}`}
        onClick={handleClickSendRequest}
        disabled={roomStatusState.chatUiState === 'ING' || isMakingQuestions}
      >
        {requestPrompt.trim() ? <img src={ico_send_on} alt='send on' /> : <img src={ico_send} alt='send' />}
      </button>
    </div>
  );
}
