import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TestChatting from 'pages/chatBuilder/components/TestChatting';
import ico_chevron_left from 'assets/images/image/chevron-left@3x.png';
import ico_chevron_down from 'assets/images/image/chevron-down@3x.png';
import ico_check_16 from 'assets/images/icons/ico_check_16.svg';
import Modal from 'components/Modal';
import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import FunctionImageUpload from './components/functionImageUpload';
import ModalFunctionsItem from 'pages/Modal/ModalFunctionsItem';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import Knowledge from './components/Knowledge';
import { ICONS_LIBRARY_URL } from 'utils/pictogram';
import { useFetchFileUpload } from 'hooks/useFetchFileUpload';
import { isLoadingState as useIsLoadingState } from 'store/pro-ai';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FUNCTIONS, HOME, LOGIN } from 'data/routers';
import QuestionImageUpload from './components/QuestionImageUpload';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import EditTextInput from 'pages/chatUI/components/EditTextInput';
import EditTextarea from 'pages/chatUI/components/EditTextarea';
import EditButtonHead from 'pages/chatUI/components/EditButtonHead';

type ModalType = 'library' | 'delete' | 'test';

const DEFAULT_VALUE: DefaultFunctionsValueType = {
  description: '',
  file_list: [],
  filter_prefix: '',
  id: 0,
  img_path: '',
  name: '',
  pre_info_type: [],
  question_image: '',
  question_name: '',
  question_detail: '',
};

export default function Functions() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const functionId = location.state?.id || null; // location.state?.id 가 있으면 수정
  const isCopyPage = location.state?.isCopy || false;
  const [functionsDetail, setFunctionsDetail] = useState(DEFAULT_VALUE);
  const [libraryAllList, setLibraryAllList] = useState<LibraryItemType[]>([]); // all library (modal에서 사용)
  const [libraryChecked, setLibraryChecked] = useState<LibraryItemType[]>([]); // checked library id (page에서 사용)
  const [isSave, setIsSave] = useState<boolean>(false);
  const [arrayFiles, setArrayFiles] = useState<FileType[]>([]);
  const fileUpload = useFetchFileUpload();
  const [arrRemoveFileId, setArrRemoveFileId] = useState<number[]>([]); // 삭제한 파일 아이디 배열
  const [isLoadingState, setIsLoadingState] = useRecoilState(useIsLoadingState);
  const [settingImage, setSettingImage] = useState<FileType[]>([]);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const [functionsTestReady, setFunctionsTestReady] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState({
    library: false,
    delete: false,
    test: false,
  });
  const [testMessage, setTestMessage] = useState('');
  const [testResultMessage, setTestResultMessage] = useState('');

  const getLibrary = async () => {
    setIsLoadingState(true);
    const response = await sendRequestProAI('/library', 'get');
    if (response && response.data) {
      const { data } = response.data;
      const tempData = data.map((item) => {
        return {
          id: item.id,
          value: item.id,
          labelText: item.name,
          isChecked: false,
          description: item.description,
          img_path: `${ICONS_LIBRARY_URL}${item.img_path}`,
          link: item.link,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });
      setLibraryAllList(tempData);

      if (functionId) {
        getFunctionsDetail(functionId, tempData);
      } else {
        setIsLoadingState(false);
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      setIsLoadingState(false);
      return;
    }
  };

  useEffect(() => {
    // step: library get => functions detaile get => library checked setting
    getLibrary();

    return () => {
      isLoadingState && setIsLoadingState(false);
    };
  }, []);

  useEffect(() => {
    if (libraryAllList.length > 0) {
      setLibraryChecked(libraryAllList.filter((item) => item.isChecked && item));
    }
  }, [functionsDetail.pre_info_type]);

  const getFunctionsDetail = async (id: number, allList?: LibraryItemType[]) => {
    const response = await sendRequestProAI(`/function/${id}`, 'get');
    if (response && response.data) {
      const { data } = response.data;
      setFunctionsDetail(data);
      updatedAllList(data.pre_info_type, allList);

      const tempFileList = data.file_list.map((item, index) => ({ ...item, index }));
      setArrayFiles(tempFileList);
      setIsLoadingState(false);
    } else {
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      setIsLoadingState(false);
      return;
    }
  };

  // data: number[] 기준으로 libraryAllList 변경
  const updatedAllList = (data: number[], allList?: LibraryItemType[]) => {
    const list = allList ? allList : libraryAllList;
    if (list.length > 0) {
      const updatedList = list.map((item) => {
        const isCheckedItem = data.some((checkedItem) => checkedItem === Number(item.id));
        return {
          ...item,
          isChecked: !!isCheckedItem,
        };
      });
      setLibraryAllList(updatedList);
    }
  };

  const handleBack = () => navigate(-1);

  const handleFunctionsSave = async () => {
    const missingFields: string[] = [];
    if (!functionsDetail.name) {
      missingFields.push('name');
    }
    if (!functionsDetail.description) {
      missingFields.push('description');
    }
    if (arrayFiles.length === 0) {
      missingFields.push('파일');
    }
    if (!functionsDetail.img_path) {
      missingFields.push('이미지');
    }
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      showNotification(`${missingFieldsString}은 function의 필수 항목입니다.`, 'info');
      return; 
    }
    // if (!functionsDetail.name || !functionsDetail.description || arrayFiles.length === 0 || !functionsDetail.img_path) {
    //   showNotification('필수 입력 필드(name, description, file, img)가 누락되었습니다.', 'error');
    //   return;
    // }
    setIsLoadingState(true);
    let img_file_id = undefined;
    if (settingImage.length > 0) {
      await fileUpload
        .multiFileUpload('/file/image', 'post', settingImage)
        .then((responseData) => {
          const { data } = responseData.data;
          if (data && data.length > 0) {
            img_file_id = data[0].id;
            functionsDetail.question_image = String(img_file_id);
          }
        })
        .catch((err) => {
          showNotification(err.message, 'error');
        });
    }

    const isModifyFile = arrayFiles.filter((item) => item.isNewFile);
    if (isModifyFile.length > 0) {
      // 파일 추가,수정 했을때
      handleFilePost();
    } else if (functionsDetail.file_list.length === arrayFiles.length) {
      // 파일 수정 안했을때
      handleFunctionSaveAPI(functionsDetail);
    } else {
      // 파일 삭제
      handleFunctionSaveAPI({ ...functionsDetail, file_list: arrayFiles });
    }

    setIsLoadingState(false);
  };

  const handleFilePost = async () => {
    let detailAddFiles;
    await fileUpload
      .multiFileUpload('/file', 'post', arrayFiles)
      .then((responseData) => {
        const data = responseData.data;
        if (data.code === 'F000') {
          if (arrRemoveFileId.length > 0) {
            detailAddFiles = {
              ...functionsDetail,
              file_list: [
                ...functionsDetail.file_list.filter((item) => !arrRemoveFileId.includes(item.id || 0)),
                ...data.data,
              ],
            };
          } else {
            detailAddFiles = {
              ...functionsDetail,
              file_list: [...functionsDetail.file_list, ...data.data],
            };
          }

          handleFunctionSaveAPI({ ...detailAddFiles });
        } else {
          detailAddFiles = functionsDetail;
          return showNotification(data.message, 'error');
        }
      })
      .catch((err) => {
        showNotification(err.message, 'error');
      });
  };

  const getFunctionsCheckAPI = async () => {
    setFunctionsTestReady(false)
    const response = await sendRequestProAI(`/function/check/${functionId}`, 'get', undefined, undefined, {
      msg: testMessage,
    });
    if (response && response.data) {
      const data = response.data;
      if (data.code === 'F000') {
        setTestResultMessage(data.message);
        setFunctionsTestReady(true)
      }
    } else {
      setFunctionsTestReady(true)
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  const handleFunctionSaveAPI = async (detailData: DefaultFunctionsValueType) => {
    const url = functionId ? `/function/${functionId}` : '/function';
    const method = functionId ? 'put' : 'post';
    const response = await sendRequestProAI(url, method, undefined, detailData);
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        if (response.data.result !== false) {
          showNotification(`정상적으로 ${functionId ? '수정' : '생성'} 되었습니다.`, 'success');

          setTimeout(() => {
            navigate(HOME);
          }, 1000);
        } else {
          showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      return;
    }
  };

  const handleFunctionChange = (key: string, value: string | number | null) => {
    if (key === 'name' && value) {
      setFunctionsDetail((prev) => ({
        ...prev,
        name: value.toString().replace(/[^a-zA-Z0-9-_]/g, ''),
      }));
    } else if (key === 'pre_info_type') {
      const tempList = libraryAllList.map((item) =>
        item.id === value ? { ...item, isChecked: !item.isChecked } : item,
      );
      setLibraryAllList(tempList);
      setIsSave(true);
    } else {
      setFunctionsDetail((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleLibraryModalSave = () => {
    const updatedParameters = {
      ...functionsDetail,
      pre_info_type: libraryAllList.filter((item) => !!item.isChecked).map((item) => item.value),
    };
    setFunctionsDetail(updatedParameters);
    setIsModalVisible({ ...isModalVisible, library: false });
    isSave && setIsSave(false);
  };

  const handleFileChange = (files: FileType[]) => setArrayFiles(files);
  const handleFileRemove = (removeFileId?: number) => {
    if (removeFileId) {
      setArrRemoveFileId((prev) => [...prev, removeFileId]);
    } else {
      setArrRemoveFileId([]);
    }
  };

  const handleModalVisible = (type: ModalType) => setIsModalVisible({ ...isModalVisible, [type]: true });

  const handleModalClose = (type: ModalType) => {
    setIsModalVisible({ ...isModalVisible, [type]: false });
    if (type === 'library') {
      isSave && updatedAllList(functionsDetail.pre_info_type); // 변경이 되었을때에만 리셋
      isSave && setIsSave(false);
    }
  };

  const handleFunctionDeleteAPI = async () => {
    if (!functionId) {
      return false;
    }
    const response = await sendRequestProAI(`/function/${functionId}`, 'delete', undefined);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible({ ...isModalVisible, delete: false });
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 Function을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 Function을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleDeleteModalSave = async () => {
    const deleteSuccess = await handleFunctionDeleteAPI();

    if (deleteSuccess) {
      setIsModalVisible({ ...isModalVisible, delete: false });
      setTimeout(() => {
        navigate(HOME);
      }, 1000);
    }
  };

  const handleChangeImage = (imageFile: FileType) => setSettingImage([imageFile]);

  const handleFunctionCopy = useCallback((copydata) => {
    navigator.clipboard
      .writeText(copydata)
      .then(() => {
        showNotification('Function 데이터가 클립보드에 복사되었습니다.', 'success');
        copydata.name = copydata.name + '-copy';
        copydata.id = null;
        navigate(FUNCTIONS, { state: { isCopy: true } });
        location.state.id = null;
        console.log(location.state);
        console.log(copydata);
      })
      .catch((err) => {
        showNotification(`Function 데이터 복사를 실패하였습니다. ${err}`, 'error');
      });
  }, []);


  return (
    <div className='page_builder'>
      {/* content */}
      <div className='builder_header'>
        {isCopyPage ? (
          <button type='button' className='btn_head_close' onClick={handleBack}>
            copy close
          </button>
        ) : (
          <button type='button' className='font-bold text-xl hover:underline' onClick={handleBack}>
            <img src={ico_chevron_left} alt='backtochat' className='inline-block w-6 h-7' />
            Chathub
          </button>
        )}
        <div className='flex'>
          {functionId && (
            <>
              <button className='btn_type white' onClick={() => handleModalVisible('test')}>
                Test 해보기
              </button>
              <button className='btn_type red' onClick={() => handleModalVisible('delete')}>
                Delete
              </button>
              <button className='btn_type blue' onClick={() => handleFunctionCopy(functionsDetail)}>
                Copy
              </button>
            </>
          )}
          <button className='btn_type blue' onClick={handleFunctionsSave}>
            <img src={ico_check_16} alt='' />
            {functionId ? 'Edit' : 'Save'}
          </button>
        </div>
      </div>
      <div className='builder_content'>
        {/* chatBuilder */}
        <div className='chat_builder'>
          <div className='chat_builder_inner'>
            <em className='txt_label'>Image</em>
            <FunctionImageUpload
              serverImg={functionsDetail.img_path ? `${ICONS_LIBRARY_URL}${functionsDetail.img_path}` : undefined}
              onImageChange={(url) => handleFunctionChange('img_path', url)}
              isDisabled={false}
            />
          </div>
          <div className='chat_builder_inner'>
            <EditTextInput
              labelText='Name'
              id='instructionName'
              value={functionsDetail.name}
              onChange={(e) => handleFunctionChange('name', e.target.value)}
            />
          </div>
          <div className='chat_builder_inner'>
            <EditTextarea
              labelText='Description'
              id='instructionDescription'
              value={functionsDetail.description}
              onChange={(e) => handleFunctionChange('description', e.target.value)}
            />
          </div>

          <div className='chat_builder_inner'>
            <EditButtonHead
              title='Library'
              btnText='Edit'
              onClick={() => handleModalVisible('library')}
              icon={ico_new_create}
            />

            {libraryChecked.length > 0 && (
              <div className='list_check_wrap'>
                {libraryChecked.map((item) => (
                  <div key={item.id} className='list_check_item'>
                    <div className='list_check_inner list_check_img'>
                      <img src={item.img_path} alt={item.labelText} />
                    </div>
                    <p className='list_check_inner'>{item.labelText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Modal
            isShow={isModalVisible.library}
            title='Library'
            width={710}
            onClose={() => handleModalClose('library')}
            okButtonText='Save'
            okButtonClick={handleLibraryModalSave}
            okButtonDisabled={!isSave}
            cancelButtonText='Close'
            cancleButtonClick={() => handleModalClose('library')}
          >
            <div className='wrap_round_square'>
              {libraryAllList.map((item, index) => (
                <ModalFunctionsItem
                  key={`dialog_${index}`}
                  imageUrl={item.img_path}
                  title={item.labelText}
                  text={item.description}
                  onClick={() => handleFunctionChange('pre_info_type', item.id)}
                  isSelected={item.isChecked}
                />
              ))}
            </div>
          </Modal>

          <Knowledge
            serverFiles={functionsDetail.file_list}
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
          />

          <div className='chat_builder_inner'>
            <label className='txt_label' htmlFor='questionDetail'>
              Question
            </label>

            <QuestionImageUpload
              serverImg={
                functionsDetail.question_image
                  ? `${connectionInfoState.restful}/file/image/${functionsDetail.question_image}`
                  : ''
              }
              onChangeImage={handleChangeImage}
            />

            <div className='chat_builder_value'>
              <EditTextInput
                id='questionName'
                name='questionName'
                placeholder='function 질문 제목을 입력하세요'
                value={functionsDetail.question_name || ''}
                onChange={(e) => handleFunctionChange('question_name', e.target.value)}
              />
              <EditTextarea
                id='questionDetail'
                name='questionDetail'
                placeholder='function 질문 설명을 입력하세요'
                value={functionsDetail.question_detail}
                onChange={(e) => handleFunctionChange('question_detail', e.target.value)}
                isLengthVisible={false}
              />
            </div>
          </div>
        </div>

        {/* test chatting */}
        {/* <div className='test_chatting'>
          <TestChatting />
        </div> */}
      </div>

      <Modal
        isShow={isModalVisible.delete}
        title={`Delete ${functionsDetail.name} Function`}
        width={400}
        onClose={() => handleModalClose('delete')}
        okButtonText='Delete'
        okButtonClick={handleDeleteModalSave}
        cancelButtonText='Close'
        cancleButtonClick={() => handleModalClose('delete')}
      >
        <div className='text-center mb-2 px-[10px] break-keep'>
          <p>{functionsDetail.name}</p>
          <p>Function을 지우신다면 되돌릴 수 없습니다.</p>
        </div>
        <div className='file_list_box'>
          <p className='txt_center text-[#fe4336]'>{functionsDetail.name} Function을 지우시겠습니까?</p>
        </div>
      </Modal>

      <Modal
        isShow={isModalVisible.test}
        title={`${functionsDetail.name} Function Test`}
        width={710}
        onClose={() => handleModalClose('test')}
        okButtonText={functionsTestReady ? 'Test' : 'Testing...'}
        okButtonClick={functionsTestReady ? getFunctionsCheckAPI : undefined}
        // okButtonText='Test'
        // okButtonClick={getFunctionsCheckAPI}
        cancelButtonText='Close'
        cancleButtonClick={() => handleModalClose('test')}
      >
        <EditTextInput
          labelText='테스트 할 메세지'
          id='functionTest'
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
        />

        <EditTextarea
          labelText='테스트 결과'
          id='functionTestResult'
          value={testResultMessage}
          disabled
          onChange={() => { }}
          isLengthVisible={false}
        />
      </Modal>
    </div>
  );
}
