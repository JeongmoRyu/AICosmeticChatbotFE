import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from 'hooks/useOutsideClick';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  userLoginState as useUserLoginState,
  chatbotIdState as useChatbotIdState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
} from 'store/pro-ai';
import { CHATBUILDER, CHATROOM, HOME } from 'data/routers';
import ico_add from 'assets/images/image/ico_add@3x.png';
import ChatBuilder from 'pages/chatBuilder';
import Modal from 'components/Modal';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';

interface MainToggleMenuProps {
  // handleEdit?: (show: boolean) => void;
  imageUrl?: string;
  altText?: string;
  caption?: string;
  navigateOptions?: object;
  // onClick?: () => void;
  positionStyle?: string;
  index?: number;
  onDeleteSuccess?: () => void;
}

const MainToggleMenu: React.FC<MainToggleMenuProps> = ({
  // handleEdit,
  altText = '',
  navigateOptions,
  caption,
  // onClick,
  positionStyle = 'bottom-2 right-2',
  index,
  onDeleteSuccess
}) => {
  const userLoginState = useRecoilValue(useUserLoginState);
  const { sendRequestProAI } = useProAIRestfulCustomAxios();

  const [isToggled, setIsToggled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [isModalVisible, setIsModalVisible] = useState(false); // MODAL DELETE CHECK

  // useOutsideClick(buttonRef, () => setIsToggled(!isToggled));
  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node) &&
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      setIsToggled(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onClickEditChatbotToggle = () => {
    navigate(CHATBUILDER, { state: navigateOptions });
  };

  const onClickDeleteToggle = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleChatbotDeleteAPI = async () => {
    if (!index) {
      return false;
    }
    const response = await sendRequestProAI(`/chatbotinfo/${index}`, "delete", undefined);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible(false);
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleModalSave = async () => {
    const deleteSuccess = await handleChatbotDeleteAPI();
  
    if (deleteSuccess) {
      setIsModalVisible(false); 
      setTimeout(() => {
        // window.location.reload(); 새로고침하면 시각적인 불편함이 심해 chatbotinfo를 호출
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }, 1000);
    }
  };


  const handleToggleButton = (e) => {
    console.log('handleToggleButton');
    e.stopPropagation();
    setIsToggled(!isToggled);
  };

  return (
    <div className={`absolute ${positionStyle}`}>
      <button
        type='button'
        ref={buttonRef}
        className={`overflow-hidden rounded-full w-[46px] h-[46px] bg-white border border-primary-default cursor-pointer ${isToggled && 'origin-center rotate-45'}`}
        onClick={handleToggleButton}
      >
        <img className='max-w-none w-full h-full object-cover' src={ico_add} alt={altText} />
      </button>
      {isToggled && (
        <div
          ref={contentRef}
          className='overflow-hidden z-1 absolute top-100 left-[-30px] w-[110px] rounded-2xl text-center bg-white shadow-[3px_5px_10px_0px_rgba(0,0,0,0.25)]'
        >
          <button
            type='button'
            className='w-full hover:bg-primary-default hover:text-white py-2'
            onClick={onClickEditChatbotToggle}
          >
            Edit
          </button>
          <button
            type='button'
            className='w-full hover:bg-[#fe4336] hover:text-white py-2'
            onClick={onClickDeleteToggle}
          >
            Delete
          </button>
        </div>
      )}
      <Modal
        isShow={isModalVisible}
        title={`Delete ${caption} Chatbot`}
        width={400}
        onClose={handleModalClose}
        okButtonText='Delete'
        okButtonClick={handleModalSave}
        cancelButtonText='Close'
        cancleButtonClick={handleModalClose}
      >
        <div className='text-center mb-2 px-[10px] break-keep'>
          {/* <p className='text-[#fe4336]'>{caption} 챗봇을 지우신다면 되돌릴 수 없습니다.</p> */}
          <p>{caption}</p>
          <p>챗봇을 지우신다면 되돌릴 수 없습니다.</p>
        </div>
        <div className='file_list_box'>
          <p className='txt_center text-[#fe4336]'>{caption} 챗봇을 지우시겠습니까?</p>
        </div>
      </Modal>
    </div>
  );
};

export default MainToggleMenu;
