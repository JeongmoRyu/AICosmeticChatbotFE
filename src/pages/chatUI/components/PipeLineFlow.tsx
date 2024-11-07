import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showNotification } from 'utils/common-helper';
import {
  userLoginState as useUserLoginState,
  chatbotIdState as useChatbotIdState,
  isLoadingState as useIsLoadingState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
  userAuthority as useUserAuthority,
} from 'store/pro-ai';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import RadioToggle from './RadioToggle';
import StreamPipeLine from './StreamPipeLine';
import SettingTab from './SettingTab';
import { useFetchFileUpload } from 'hooks/useFetchFileUpload';
import { LOGIN } from 'data/routers';
import { useNavigate } from 'react-router-dom';

const TABS: toggleListProps[] = [
  { id: 'setting', label: '설정' },
  { id: 'testlog', label: '테스트 로그' },
];

function PipeLineFlow({ activeTab, onChangeTab, logData }) {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const userLoginState = useRecoilValue(useUserLoginState);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [settingData, setSettingData] = useState<IChatbotDataItem>({} as IChatbotDataItem);
  const [settingImage, setSettingImage] = useState<FileType[]>([]);
  const imageFileUpload = useFetchFileUpload();
  const setIsLoadingState = useSetRecoilState(useIsLoadingState);
  const setIsChatbotImageRefresh = useSetRecoilState(useIsChatbotImageRefresh);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [chatbotList, setChatbotList] = useState<ChatbotType[]>([]);
  const navigate = useNavigate();
  const userAuthority = useRecoilValue(useUserAuthority);

  const getChatbotDetail = useCallback(async () => {
    const response = await sendRequestProAI(`/chatbotinfo/${chatbotId}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        setSettingData(data);
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      showNotification('챗봇 관련 정보 획득에 오류가 발생하였습니다', 'error');
    }
  }, [chatbotId]);

  useLayoutEffect(() => {
    getChatbotDetail();
  }, [getChatbotDetail]);

  useEffect(() => {
    console.log(chatbotList);
    if (chatbotList.length > 0) {
      timerRef.current = setInterval(embeddingRefresh, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [chatbotList]);

  // useEffect(() => {

  //   if (chatbotId && settingData) {
  //     if (chatbotId && settingData.id) {
  //       const chatbotItem: ChatbotType = {
  //         id: settingData.id,
  //         name: settingData.name,
  //         embedding_status: settingData.embedding_status,
  //       };

  //       setChatbotList([chatbotItem]);
  //     }
  //     console.log(chatbotList)
  //     timerRef.current = setInterval(embeddingRefresh, 5000);
  //   }
  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       console.log('out')
  //     }
  //   };
  // }, [settingData]);

  const embeddingRefresh = async () => {
    console.log(chatbotList);
    const params = { chatbot_id_list: chatbotId };
    // const params = { chatbot_id_list: '14' };
    const response = await sendRequestProAI(`/chatbotinfo/status`, 'get', undefined, undefined, params);

    if (response && response.data) {
      const data = response.data.data;

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
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  const onValueChange = (type: string, key: string, value: any, parameters?: IEngineParameter) => {
    if (key === '') {
      setSettingData((prev) => ({ ...prev, [type]: value }));
    } else if (key === 'llm_engine_id' && parameters) {
      setSettingData((prev) => {
        return { ...prev, [type]: { ...prev[type], [key]: value, parameters: parameters } };
      });
    } else if (type === 'rag' && key.startsWith('elastic_search.')) {
      const subKey = key.replace('elastic_search.', '');
      setSettingData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          elastic_search: {
            ...prev[type].elastic_search,
            [subKey]: value,
          },
        },
      }));
    } else if (type === 'rag.elastic_search') {
      setSettingData((prev) => {
        return {
          ...prev,
          rag: {
            ...prev.rag,
            elastic_search: {
              ...prev.rag.elastic_search,
              parameters: value,
            },
          },
        };
      });
    } else {
      setSettingData((prev) => {
        return { ...prev, [type]: { ...prev[type], [key]: value } };
      });
    }
  };

  const handleChangeImage = (imageFile: FileType) => {
    setSettingImage([imageFile]);
  };

  const putSettingDetail = async (settingData: IChatbotDataItem) => {
    const missingFields: string[] = [];
    if (!settingData.name) {
      missingFields.push('name');
    }
    if (!settingData.description) {
      missingFields.push('description');
    }
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      showNotification(`${missingFieldsString}은 chatbot의 필수 항목입니다.`, 'info');
      return;
    }
    const falseModes = Object.entries(modeStates)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (falseModes.length > 0) {
      const modeList = falseModes.join(', ');
      const message = `${modeList} prompt 값이 문제가 있어서 '수정할 수 없습니다.}`;
      showNotification(message, 'error');
      return;
    }

    const response = await sendRequestProAI(`/chatbotinfo/${chatbotId}`, 'put', undefined, settingData);
    console.log(response);
    if (response && response.data) {
      if (response.data.code === 'EC02') {
        showNotification('Embedding 중입니다.', 'error');
        return false;
      }
      if (response.data.code === 'EA01') {
        showNotification('생성 권한이 없습니다.', 'error');
        return false;
      }
      if (response.data.code === 'EA04') {
        showNotification('수정 권한이 없습니다.', 'error');
        return false;
      }
      if (response.data.code !== 'F002') {
        if (response.data.result !== false) {
          const data = response.data.data;
          const chatbotItem: ChatbotType = {
            id: settingData.id,
            name: settingData.name,
            embedding_status: settingData.embedding_status,
            image: settingData.imgfile_id,
            user_key: userLoginState.user_key
          };

          setChatbotList([chatbotItem]);
          showNotification('정상적으로 수정되었습니다.', 'success');

          setIsChatbotImageRefresh(true);
        } else {
          showNotification('정상적으로 수정하지 못하였습니다.', 'error');
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      showNotification('정상적으로 수정하지 못하였습니다.', 'error');
      return;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingState(true);
      if (settingImage.length > 0) {
        let img_file_id = undefined;
        // if (settingData.imgfile_id) {
        //   img_file_id = [Number(settingData.imgfile_id)];
        // }
        await imageFileUpload
          .multiFileUpload('/file/image', 'post', settingImage)
          .then((responseData) => {
            const { data } = responseData.data;
            img_file_id = data[0].id;
          })
          .catch((err) => {
            showNotification(err.message, 'error');
          })
          .finally(async () => {
            await putSettingDetail({ ...settingData, img_file_id });
            setSettingImage([]);
          });
      } else {
        putSettingDetail(settingData);
      }

      setIsLoadingState(false);
      console.log('서버로 데이터 전송 완료');
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
  };
  const [modeStates, setModeStates] = useState({
    rq: true,
    rag: true,
    llm: true,
  });

  const setValueCheck = (mode: string, value: boolean) => {
    setModeStates((prevStates) => ({
      ...prevStates,
      [mode]: value,
    }));
  };

  return (
    <>
      {userAuthority && (
        <RadioToggle toggleList={TABS} name='tabEditChatbot' checkedId={activeTab} onChange={onChangeTab} />
      )}
      {activeTab === 'setting' && (
        <>
          <div className='scroll_wrap'>
            <SettingTab data={settingData} handleChange={onValueChange} handleChangeImage={handleChangeImage} valueCheck={setValueCheck} />
          </div>
          <div className='bottom_box'>
            {chatbotList &&
              chatbotList.length > 0 &&
              chatbotList[0]?.total_count !== undefined &&
              chatbotList[0]?.cnt_wait !== undefined &&
              chatbotList[0]?.cnt_complete !== undefined &&
              chatbotList[0]?.cnt_error !== undefined ? (
              chatbotList[0].cnt_complete + chatbotList[0].cnt_error !== chatbotList[0].total_count ? (
                <div className='flex justify-between h-[30px]'>
                  <p className='text-lg text-primary-default'>
                    {`진행 중..... (${chatbotList[0].total_count - chatbotList[0].cnt_wait}/${chatbotList[0].total_count})`}
                  </p>
                  <button type='button' className='btn_embedding' disabled>
                    ....수정중
                  </button>
                </div>
              ) : (
                <button type='button' className='btn_type blue' onClick={handleSubmit}>
                  Save
                </button>
              )
            ) : (
              <button type='button' className='btn_type blue' onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </>
      )}
      {activeTab === 'testlog' && <StreamPipeLine logData={logData} />}
    </>
  );
}

export default PipeLineFlow;
