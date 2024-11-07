import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from 'hooks/useOutsideClick';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  userLoginState as useUserLoginState,
  chatbotIdState as useChatbotIdState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
  userAuthority as useUserAuthority,
} from 'store/pro-ai';
import { FUNCTIONS, CHATBUILDER, CHATROOM } from 'data/routers';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

const ToggleMenu = ({ handleEdit, chatbotImage }) => {
  const [isToggled, setIsToggled] = useState(false);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const userLoginState = useRecoilValue(useUserLoginState);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [isChatbotImageRefresh, setIsChatbotImageRefresh] = useRecoilState(useIsChatbotImageRefresh);
  const [imageKey, setImageKey] = useState<string>(`${chatbotId}_${new Date().getTime()}`);
  // const chatbotDiffAdmin = useRecoilValue(useChatBotDiffAdmin);
  const userAuthority = useRecoilValue(useUserAuthority);

  useEffect(() => {
    if (isChatbotImageRefresh) {
      setImageKey(`${chatbotId}_${new Date().getTime()}`);
      setIsChatbotImageRefresh(false);
    }
  }, [isChatbotImageRefresh]);

  useOutsideClick(toggleRef, () => setIsToggled(false));

  // const moveChatBuilder = () => {
  //   setRoomInfoState((prev) => ({
  //     ...prev,
  //     roomId: 0,
  //   }));
  //   resetGptChatHistroyState();
  //   navigate(CHATBUILDER);
  // };

  // const moveDialogueBot = () => {
  //   setRoomInfoState((prev) => ({
  //     ...prev,
  //     roomId: 0,
  //   }));
  //   resetGptChatHistroyState();
  //   navigate(FUNCTIONS);
  // };

  const moveChatRoom = () => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: 0,
    }));
    resetGptChatHistroyState();
    navigate(CHATROOM);
  };

  return (
    <div
      className='relative w-[56px] h-[56px] bg-[#e7ecf1] rounded-full mx-2 cursor-pointer'
      onClick={() => setIsToggled(!isToggled)}
    >
      <div className='overflow-hidden rounded-full w-[56px] h-[56px]'>
        <img className='max-w-none w-full h-full object-cover' key={imageKey} src={chatbotImage} alt='' />
      </div>
      {isToggled && (
        <div
          className='overflow-hidden absolute top-14 flex flex-col justify-center w-36 bg-white rounded-2xl text-center shadow-lg'
          ref={toggleRef}
        >
          {userAuthority && (
            <>
              <div
                className='cursor-pointer hover:bg-primary-default hover:text-white py-2'
                onClick={() => handleEdit(true)}
              >
                Edit Chatbot
              </div>
              {/* <div className='cursor-pointer hover:bg-primary-default hover:text-white py-2' onClick={moveChatBuilder}>
                ChatBuilder
              </div>
              <div className='cursor-pointer hover:bg-primary-default hover:text-white py-2' onClick={moveDialogueBot}>
                Functions
              </div> */}
            </>
          )}
          <div className='cursor-pointer hover:bg-primary-default hover:text-white py-2' onClick={moveChatRoom}>
            New Chat
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;
