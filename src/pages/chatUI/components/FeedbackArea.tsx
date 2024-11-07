import { LOGIN } from 'data/routers';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { roomInfoState as useRoomInfoState } from 'store/pro-ai';
import { showNotification } from 'utils/common-helper';

function FeedbackArea({ index, seq, isOpen, handleFeedbackArea }: FeedbackAreaProps) {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [feedbackContents, setFeedbackContents] = useState<string>('');
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
      feedbackRef.current.focus();
    }
  }, [isOpen]);

  const handleChangeFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackContents(e.target.value);
  };

  const handleSendFeedback = async () => {
    await postFeedbackContent(roomInfoState.roomId, seq, feedbackContents);
  };

  const postFeedbackContent = async (chatroom_id: number, seq: number, feedbackContent: string) => {
    const response = await sendRequestProAI(
      `/chatroom/feedback/${chatroom_id}/${seq}?feedback=${feedbackContent}`,
      'post',
      undefined,
      undefined,
      undefined,
    );
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data;
        setFeedbackContents('');
        handleFeedbackArea(index);
        showNotification('피드백 전송에 성공하였습니다.', 'success');
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      showNotification('피드백 전송에 오류가 발생하였습니다', 'error');
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className='mt-2 pr-1 w-full flex flex-col'>
      <textarea
        ref={feedbackRef}
        className='w-full h-24 p-4 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary-default focus:border-transparent'
        placeholder='내용을 입력해 주세요.'
        value={feedbackContents}
        onChange={handleChangeFeedback}
      ></textarea>
      <div className='flex justify-end'>
        <span
          className='flex justify-end hover:underline cursor-pointer mt-1 text-sm w-fit'
          onClick={handleSendFeedback}
        >
          전송하기
        </span>
      </div>
    </div>
  );
}

export default FeedbackArea;
