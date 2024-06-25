import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from 'hooks/useOutsideClick';
import EllyBanner from 'assets/images/image/EllyBanner.png';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  userLoginState as useUserLoginState,
  hostInfoName as useHostInfoName,
} from 'store/ai';

const ToggleMenu = ({ handleEdit }) => {
  const [isToggled, setIsToggled] = useState(false);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const userLoginState = useRecoilValue(useUserLoginState);
  const hostInfoName = useRecoilValue(useHostInfoName);

  useOutsideClick(toggleRef, () => setIsToggled(false));

  const moveChatBuilder = () => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: 0,
    }));
    resetGptChatHistroyState();
    navigate(`/chatbuilder/${hostInfoName}`);
  };

  const moveChatRoom = () => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: 0,
    }));
    resetGptChatHistroyState();
    navigate(`/chatroom/${hostInfoName}`);
  };

  return (
    <div
      className='relative w-14 h-14 bg-[#e7ecf1] rounded-full mx-2 cursor-pointer'
      onClick={() => setIsToggled(!isToggled)}
    >
      <img className='w-full h-full mx-auto' src={EllyBanner} alt='elly' />
      {isToggled && (
        <div
          className='overflow-hidden absolute top-14 flex flex-col justify-center w-36 bg-white rounded-2xl text-center shadow-lg'
          ref={toggleRef}
        >
          {userLoginState.name !== 'chatplaytest1' ? (
            <div>
              <div className='cursor-pointer hover:bg-[#316094] hover:text-white py-2' onClick={handleEdit}>
                Edit Chat
              </div>
              <div className='cursor-pointer hover:bg-[#316094] hover:text-white py-2' onClick={moveChatBuilder}>
                ChatBuilder
              </div>
              <div className='cursor-pointer hover:bg-[#316094] hover:text-white py-2' onClick={moveChatRoom}>
                New Chat
              </div>{' '}
            </div>
          ) : (
            <div className='cursor-pointer hover:bg-[#316094] hover:text-white py-2' onClick={moveChatRoom}>
              New Chat
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;
