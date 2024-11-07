import { useNavigate } from 'react-router-dom';
import RoundCard from '../components/RoundCard';
// import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import ico_new_create from 'assets/images/icons/ico_new_create2.svg';
import ico_add from 'assets/images/image/ico_add@3x.png';
import {
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
  chatbotIdState as useChatbotIdState,
} from 'store/pro-ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { CHATBUILDER, CHATROOM, FUNCTIONS, LOGIN } from 'data/routers';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import { ICONS_LIBRARY_URL } from 'utils/pictogram';
import RoundCardForbidden from 'components/RoundCardFrobidden';
import EmbeddingCheckRoundCard from 'components/EmbeddingCheckRoundCard';
import EditToggle from './chatUI/components/EditToggle';
import Modal from 'components/Modal';

export default function ProAI() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  // const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  const [chatbotItemState, setChatbotItemState] = useState<CardChatbotType>({} as CardChatbotType);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const userAuthority = useRecoilValue(useUserAuthority);
  const [chatbotList, setChatbotList] = useState<CardChatbotType[]>([]);
  const [allChatbotList, setAllChatbotList] = useState<CardChatbotType[]>([]);
  const [functionList, setFunctionList] = useState<FunctionsType[]>([]);
  const [allFunctionList, setAllFunctionList] = useState<FunctionsType[]>([]);
  const [embeddingChatbotIdList, setEmbeddingChatbotIdList] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [toggleState, setToggleState] = useState([false, false]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getChatbotInfo();
    getFunctions();
  }, [connectionInfoState]);

  useEffect(() => {
    if (embeddingChatbotIdList.length > 0 && chatbotList.length === allChatbotList.length) {
      timerRef.current = setInterval(embeddingRefresh, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [embeddingChatbotIdList, chatbotList]);

  const embeddingRefresh = async () => {
    const params = { chatbot_id_list: embeddingChatbotIdList.toString() };
    const response = await sendRequestProAI('/chatbotinfo/status', 'get', undefined, undefined, params);

    if (response && response.data) {
      const data = response.data.data;
      if (Array.isArray(data)) {
        const updateData = chatbotList.map((item) => {
          const matchedItem = data.find((v: ChatStatusType) => v.chatbot_id === item.id);
          return matchedItem
            ? {
              ...item,
              cnt_complete: matchedItem.cnt_complete,
              cnt_error: matchedItem.cnt_error,
              cnt_wait: matchedItem.cnt_wait,
              total_count: matchedItem.total_count,
            }
            : item;
        });
        setChatbotList(updateData);
        const isEmbeddingCompleted = updateData.some((item) => item.cnt_complete + item.cnt_error === item.total_count);
        console.log('**********embedding check**************', isEmbeddingCompleted);

        if (isEmbeddingCompleted && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;

          await getChatbotInfo();
        }
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  const getChatbotInfo = async (): Promise<CardChatbotType[]> => {
    const response = await sendRequestProAI('/chatbotinfo', 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const { data } = response.data;
        if (data && data.length > 0) {
          const tempData: CardChatbotType[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            image: `${connectionInfoState.restful}/chatbotinfo/image/${item.id}`,
            embedding_status: item.embedding_status,
            user_key: item.user_key,
            user_id: item.user_id,
            user_name: item.user_name,
            updated_at: item.updated_at,
          }));
          setChatbotList(tempData);
          setAllChatbotList(tempData);

          setEmbeddingChatbotIdList(
            tempData.filter((item) => item.embedding_status === 'P' && item).map((item) => item.id),
          );
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      showNotification('서버로부터 정상적인 챗봇 정보를 받지 못했습니다.', 'error');
    }
    return [];
  };

  const getFunctions = async () => {
    const response = await sendRequestProAI('/function', 'get');
    if (response && response.data) {
      const { data } = response.data;
      if (data && data.length > 0) {
        setFunctionList(data);
        setAllFunctionList(data);
      }
    } else {
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  const handleCreateBuilder = () => navigate(CHATBUILDER);
  const handleChatbotClick = (chatbot_id) => setChatbotIdState(chatbot_id);
  const handleCreateFunctions = () => navigate(FUNCTIONS);

  const handleToggleIsMine = useCallback(
    (type: 'chatbot' | 'functions', value: boolean) => {
      if (type === 'chatbot') {
        setToggleState([value, toggleState[1]]);
        if (value) {
          setChatbotList(chatbotList.filter((item) => item.user_key === userLoginState.user_key && item));
        } else {
          setChatbotList(allChatbotList);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      }

      if (type === 'functions') {
        setToggleState([toggleState[0], value]);
        if (value) {
          setFunctionList(functionList.filter((item) => item.user_key === userLoginState.user_key && item));
        } else {
          setFunctionList(allFunctionList);
        }
      }
    },
    [chatbotList, functionList, toggleState],
  );

  // modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleChatbotDeleteAPI = async () => {
    if (!chatbotItemState) {
      return false;
    }
    const index = chatbotItemState.id;
    console.log(index);
    if (!index) {
      return false;
    }
    const response = await sendRequestProAI(`/chatbotinfo/${index}`, 'delete', undefined);
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
        getChatbotInfo();
        setToggleState([false, toggleState[1]]);
      }, 1000);
    }
  };

  return (
    <>
      <div className='page_main pt-[57px] pb-[100px] px-[20px] mx-auto flex justify-center w-full h-fit'>
        {/* <div className='flex flex-col max-w-[880px] w-full h-full justify-evenly'> */}
        <div className='max-w-[1485px] w-full h-full mx-auto px-4'>
          <div className='flex flex-col w-full justify-evenly'>

            <div className='flex justify-between text-2xl font-bold'>
              AI Chat
              <div className='flex justify-end'>
                {userAuthority && (
                  <>
                    <EditToggle
                      title='내가 만든 AI Chat 보기'
                      id='chatbot_mine'
                      value={toggleState[0]}
                      onChange={(val) => handleToggleIsMine('chatbot', val)}
                    />
                    <button className='btn_type black w-[100px] h-[40px] rounded-[8px] text-[16px] py-[6px] px-[15px] flex items-center justify-center' onClick={handleCreateBuilder}>
                      <img src={ico_new_create} alt='create' className='btn-icon'/>
                      Create
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* <div className='mt-10 flex flex-wrap p-7 rounded-lg'> */}
          <div className='mt-[30px] result-wrap'>
            <div className='max-w-[1485px] mx-auto'>

              <div className='gap-5 grid grid-cols-4 desktop:grid-cols-4 mobile:grid-cols-1 gap-[15px] justify-center'>
                {chatbotList.length > 0 &&
                  chatbotList.map((item) =>
                    item.embedding_status === 'C' ? (
                      <EmbeddingCheckRoundCard
                        key={`chatbot_round_${item.id}`}
                        cardItem={item}
                        to={CHATROOM}
                        navigateOptions={{ id: item.id }}
                        cardClick={() => {
                          handleChatbotClick(item.id);
                          setChatbotItemState(item);
                        }}
                        imgClassName='max-w-none w-full h-full object-cover'
                        isToggleBtnVisible={!!userAuthority}
                        onDeleteSuccess={() => {
                          getChatbotInfo();
                          setToggleState([false, toggleState[1]]);
                        }}
                        setIsModalVisible={setIsModalVisible}
                        setChatbotItemState={setChatbotItemState}
                      />
                    ) : (
                      <RoundCardForbidden
                        key={item.id}
                        cardItem={item}
                        isToggleBtnVisible={!!userAuthority}
                        imgClassName='max-w-none w-full h-full object-cover'
                      />
                    ),
                  )}

                {userAuthority && (
                  <RoundCard
                    cardItem={{
                      id: 0,
                      image: ico_add,
                      name: 'Chat Builder',
                      user_key: 0,
                    }}
                    to={CHATBUILDER}
                    imgClassName='max-w-[40px] max-h-[40px]'
                  />
                )}
              </div>
            </div>
          </div>

          {userAuthority && (
            <div className='pt-28'>
              <div className='flex justify-between text-2xl font-bold'>
                Functions
                <div className='flex justify-end'>
                  {userAuthority && (
                    <>
                      <EditToggle
                        title='내가 만든 Functions 보기'
                        id='functions_mine'
                        value={toggleState[1]}
                        onChange={(val) => handleToggleIsMine('functions', val)}
                      />
                      <button className='btn_type black w-[100px] h-[40px] rounded-[8px] text-[16px] py-[6px] px-[15px] flex items-center justify-center' onClick={handleCreateFunctions}>
                      <img src={ico_new_create} alt='create' className='btn-icon'/>
                        Create
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* <div className='mt-10 flex flex-wrap p-7 rounded-lg'> */}
              <div className='mt-[30px] result-wrap'>
                <div className='max-w-[1485px] mx-auto'>
                  <div className='gap-5 grid grid-cols-4 desktop:grid-cols-4 mobile:grid-cols-1 gap-[15px] justify-center'>
                    {functionList.map((card, index) => (
                      <div key={index} className='flex justify-center'>
                        <div className='w-full max-w-[360px]'>
                          <RoundCard
                            cardItem={{
                              id: card.id,
                              name: card.name,
                              image: ICONS_LIBRARY_URL + card.img_path,
                              user_key: card.user_key,
                              user_id: card.user_id,
                              user_name: card.user_name,
                              updated_at: card.updated_at,
                            }}
                            to={FUNCTIONS}
                            imgClassName='max-w-[40px] max-h-[40px]'
                            navigateOptions={{ id: card.id }}
                          />
                        </div>
                      </div>
                    ))}
                    {userAuthority && (
                      <div className='flex justify-center'>
                        <div className='w-full max-w-[360px]'>
                          <RoundCard
                            cardItem={{
                              id: 99999,
                              name: 'Add Dialogue Bot',
                              image: ico_add,
                              user_key: 0,
                            }}
                            to={FUNCTIONS}
                            imgClassName='max-w-[40px] max-h-[40px]'

                          />
                        </div>
                      </div>
                    )}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isShow={isModalVisible}
        title={
          chatbotItemState.id
            ? `Delete ${chatbotItemState.name.length > 20 ? chatbotItemState.name.slice(0, 19) + '...' : chatbotItemState.name} Chatbot`
            : ''
        }
        width={400}
        onClose={handleModalClose}
        okButtonText='Delete'
        okButtonClick={handleModalSave}
        cancelButtonText='Close'
        cancleButtonClick={handleModalClose}
      >
        <div className='text-center mb-2 px-[10px] break-keep'>
          {/* <p className='text-[#fe4336]'>{caption} 챗봇을 지우신다면 되돌릴 수 없습니다.</p> */}
          {chatbotItemState.id && (
            <div>
              <p className='truncate max-w-full' title={chatbotItemState.name}>
                {chatbotItemState.name.length > 36 ? `${chatbotItemState.name.slice(0, 35)}...` : chatbotItemState.name}
              </p>
              <p>챗봇을 지우신다면 되돌릴 수 없습니다.</p>
            </div>
          )}
        </div>
        <div className='file_list_box'>
          <div className='txt_center text-[#fe4336]'>
            <p className='mb-2'>
              {chatbotItemState.id && (
                <span className='truncate inline-block max-w-full' title={chatbotItemState.name}>
                  {chatbotItemState.name.length > 36
                    ? `${chatbotItemState.name.slice(0, 35)}...`
                    : chatbotItemState.name}
                </span>
              )}
            </p>
            <p>챗봇을 지우시겠습니까?</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
