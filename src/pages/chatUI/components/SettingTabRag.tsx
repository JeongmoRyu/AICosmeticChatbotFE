import EditTextarea from './EditTextarea';
import EditSelectBox from './EditSelectBox';
import EngineParameterInput from './EngineParameterInput';
import Modal from 'components/Modal';
import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import { useEffect, useState } from 'react';
import EditButtonHead from './EditButtonHead';
import EditToggle from './EditToggle';
import EditCounter from './EditCounter';
import EditCheckbox from './EditCheckbox';
import { RAG_EMBEDDING_TYPE } from 'data/options';
import EditTextInputHalf from './EditTextInputHalf';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import ModalFunctionsItem from 'pages/Modal/ModalFunctionsItem';
import { ICONS_LIBRARY_URL } from 'utils/pictogram';
import { useLocation } from 'react-router-dom';
import EssentialCheck from './EssentialCheck';

interface Props {
  data: RagType;
  onChange: (type: string, key: string, value: any, parameters?: IEngineParameter) => void;
  parameters?: IEngineParameter[];
  llmSelectList?: SelectListType[];
  llmFunctionSelectList?: SelectListType[];
  ragSelectList?: SelectListType[];
  esSelectList?: SelectListType[];
  valueCheck?: (mode: string, value: boolean) => void;
  mode: string;
}
export default function SettingTabRag({
  data,
  onChange,
  parameters,
  llmSelectList,
  llmFunctionSelectList,
  ragSelectList,
  esSelectList,
  valueCheck,
  mode
}: Props) {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [functionsAllList, setFunctionsAllList] = useState<FunctioncallItem[]>([]); // all functions
  const [functionsChecked, setFunctionsChecked] = useState<FunctioncallItem[]>([]); // checked functions
  const [embeddingList, setEmbeddingList] = useState<CheckListType[]>(() =>
    RAG_EMBEDDING_TYPE.map((item) => ({
      ...item,
      labelText: item.id.toUpperCase(),
      isChecked: item.value === 1,
    })),
  );

  useEffect(() => {
    getFunctions();
  }, [data.functions]);
  // edit builder에서 업데이트 되지 않는 문제를 해결하기 위해(호출 순서) getfunctions호출

  const getFunctions = async () => {
    const response = await sendRequestProAI('/function', 'get');
    if (response && response.data) {
      const { data: functionsData } = response.data;
      if (functionsData && functionsData.length > 0) {
        const tempData = functionsData.map((item) => {
          return {
            id: item.id,
            value: item.id,
            labelText: item.name,
            isChecked: data.functions && data.functions.length > 0 ? data.functions.includes(item.id) : false,
            url: `${ICONS_LIBRARY_URL}${item.img_path}`,
          };
        });
        const checkedFunctions = tempData.filter((item) => item.isChecked);

        setFunctionsAllList(tempData);
        setFunctionsChecked(checkedFunctions);
      }
    } else {
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleDialogueBotClick = (item: FunctioncallItem) => {
    setIsSave(true);
    setFunctionsAllList((prev) => prev.map((i) => (i.id === item.id ? { ...item, isChecked: !item.isChecked } : i)));
  };

  const handleSaveFunctions = () => {
    const updatedCheckedFunctions = functionsAllList.filter((item) => item.isChecked);

    if (updatedCheckedFunctions.length > 10) {
      console.log(updatedCheckedFunctions);
      showNotification('Function은 최대 10개까지 고를 수 있습니다.', 'error');
      return;
    }
    setFunctionsChecked(updatedCheckedFunctions);
    const updatedfunctionList: number[] = updatedCheckedFunctions.map((item) => item.value);

    onChange('rag', 'functions', updatedfunctionList);
    setIsModalVisible(!isModalVisible);
  };
  const handleAddFunctions = () => setIsModalVisible(!isModalVisible);

  const handleEmbeddingChange = (id: string) => {
    const updatedCheckList = embeddingList.map((item) => {
      if (item.id === id) {
        const newIsChecked = !item.isChecked;
        return { ...item, isChecked: newIsChecked, value: newIsChecked ? 1 : 0 };
      }
      return item;
    });
    setEmbeddingList(updatedCheckList);
    const embeddingType: IEmbeddingType[] = updatedCheckList.map((item) => ({
      id: item.id,
      value: item.value,
    }));
    onChange('rag', 'embedding_type', embeddingType);

    updatedCheckList.map((item) => {
      // bm25 체크 안되었을때
      if (item.id === 'bm25' && !item.isChecked) {
        const tempParameters = data.elastic_search.parameters.map((item) => {
          return item.key === 'rrf_sparse_weight'
            ? { ...item, value: '0' }
            : item.key === 'rrf_dense_weight'
              ? { ...item, value: '1' }
              : item;
        });
        onChange('rag.elastic_search', 'parameters', tempParameters);
      }
    });
  };

  const essential_prompt = ['history', 'context', 'question'];
  return (
    <>
      <EditToggle
        title='RAG 사용 Option'
        id='rag_use_yn'
        value={data.use_yn}
        onChange={(val) => onChange('rag', 'use_yn', val)}
      />
      {data.use_yn && (
        <>
          <div className='sub_box'>
            <div className='sub_box_inner'>
              <strong className='sub_title'>Function Call</strong>

              <EditButtonHead title='Add Functions' btnText='Edit' onClick={handleAddFunctions} icon={ico_new_create} />
              {functionsChecked && functionsChecked.length > 0 && (
                <>
                  {functionsChecked.map((item) => (
                    <div key={item.id} className='list_check_item'>
                      <div className='list_check_inner list_check_img'>
                        <img src={item.url} alt={item.labelText} />
                      </div>
                      <p className='list_check_inner'>{item.labelText}</p>
                    </div>
                  ))}
                </>
              )}
              <EditCounter
                title='Function Call Retry 횟수'
                id='rag_function_retry'
                value={String(data.function_retry)}
                onChange={(value) => onChange('rag', 'function_retry', value)}
              />
              {llmFunctionSelectList && (
                <>
                  <EditSelectBox
                    type=''
                    list={llmFunctionSelectList}
                    labelText='Function Call LLM Model'
                    name='rag_function_llm_model'
                    activeValue={data.function_llm_engine_id}
                    onChange={(value, parameters) => onChange('rag', 'function_llm_engine_id', value, parameters)}
                  />

                  <EditSelectBox
                    type=''
                    list={llmFunctionSelectList}
                    labelText='Function Call Fallback Model'
                    name='rag_function_fallback_model'
                    activeValue={data.function_fallback_engine_id}
                    onChange={(value) => onChange('rag', 'function_fallback_engine_id', value)}
                  />
                </>
              )}
              <Modal
                isShow={isModalVisible}
                title='Add Functions'
                width={705}
                onClose={toggleModal}
                okButtonText='Save'
                okButtonClick={handleSaveFunctions}
                okButtonDisabled={!isSave}
                cancelButtonText='Close'
                cancleButtonClick={toggleModal}
              >
                <div className='wrap_round_square'>
                  {functionsAllList.map((item, index) => (
                    <ModalFunctionsItem
                      key={`dialog_${index}`}
                      imageUrl={item.url}
                      title={item.labelText}
                      text={item.text}
                      onClick={() => handleDialogueBotClick(item)}
                      isSelected={item.isChecked}
                    />
                  ))}
                </div>
              </Modal>
            </div>
          </div>

          <div className='sub_box'>
            <div className='sub_box_inner'>
              <strong className='sub_title'>RAG 프롬프트</strong>
              <EditTextarea
                labelText='System Prompt'
                id='rag_system_prompt'
                value={data.system_prompt}
                onChange={(e) => onChange('rag', 'system_prompt', e.target.value)}
              />
              <EditTextarea
                labelText='User Prompt'
                id='rag_user_prompt'
                value={data.user_prompt}
                onChange={(e) => onChange('rag', 'user_prompt', e.target.value)}
              />
              <EssentialCheck key={`essential-check-${mode}`} userPrompt={data.user_prompt} requiredKeys={essential_prompt} valueCheck={valueCheck} mode={mode}/>

              <EditCounter
                title='Retry 횟수'
                id='rag_retry'
                value={String(data.retry)}
                onChange={(value) => onChange('rag', 'retry', value)}
              />
              {llmSelectList && (
                <>
                  <EditSelectBox
                    type=''
                    list={llmSelectList}
                    labelText='LLM Model'
                    name='rag_llm_model'
                    activeValue={data.llm_engine_id}
                    onChange={(value, parameters) => onChange('rag', 'llm_engine_id', value, parameters)}
                  />

                  <EditSelectBox
                    type=''
                    list={llmSelectList}
                    labelText='Fallback Model'
                    name='rag_fallback_model'
                    activeValue={data.fallback_engine_id}
                    onChange={(value) => onChange('rag', 'fallback_engine_id', value)}
                  />
                </>
              )}
              {parameters && <EngineParameterInput engineType='rag' parameters={parameters} onChange={onChange} />}
            </div>
          </div>

          <EditSelectBox
            type=''
            list={ragSelectList}
            labelText='Embedding Model'
            name='embedding_engine_id'
            activeValue={data.embedding_engine_id}
            onChange={(value) => onChange('rag', 'embedding_engine_id', value)}
          />

          <EditCheckbox
            title='Embedding 방식'
            name='rag.embedding_type'
            checkList={embeddingList}
            onChange={(id) => handleEmbeddingChange(id)}
          />

          <div className='sub_box'>
            <div className='sub_box_inner'>
              <strong className='sub_title'>ES 검색조건</strong>

              <EditTextInputHalf
                labelText='Top K'
                id='rag.elastic_search.topk'
                value={String(data.elastic_search.top_k)}
                onChange={(e) => onChange('rag', 'elastic_search.top_k', e.target.value)}
              />
              <EditCounter
                title='Retry 횟수'
                id='rag_retry'
                value={String(data.elastic_search.retry)}
                onChange={(value) => onChange('rag', 'elastic_search.retry', value)}
              />
              <EditSelectBox
                type='endpoint'
                list={esSelectList}
                labelText='Endpoint'
                name='elastic_search_endpoint'
                activeValue={data.elastic_search.endpoint}
                onChange={(value) => onChange('rag', 'elastic_search.endpoint', value)}
              />
              {data.elastic_search.parameters && (
                <EngineParameterInput
                  engineType='rag.elastic_search'
                  parameters={data.elastic_search.parameters}
                  onChange={onChange}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
