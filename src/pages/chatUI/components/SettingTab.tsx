import { useState } from 'react';
import icon_up from 'assets/images/icons/icon_up.svg';
import ico_warning from 'assets/images/icons/ico_warning.png';
import SettingTabChatbotInfo from './SettingTabChatbotInfo';
import SettingTabLLMCommon from './SettingTabLLMCommon';
import SettingTabReproduceQuestion from './SettingTabReproduceQuestion';
import SettingTabLLM from './SettingTabLLM';
import SettingTabRag from './SettingTabRag';
import useLLMOpenAIEngineSelect from 'hooks/useLLMOpenAIEngineSelect';
import EditToggle from './EditToggle';
import useGetEngineDatas from 'hooks/useGetEngineData';
import { userAuthority as useUserAuthority } from 'store/pro-ai';
import { useRecoilValue } from 'recoil';

interface Props {
  data: IChatbotDataItem;
  handleChange: (type, key, value, parameters?: IEngineParameter) => void;
  handleChangeImage: (imageFile: FileType) => void;
  valueCheck?: (mode: string, value: boolean) => void;
}

const SettingTab = ({ data, handleChange, handleChangeImage, valueCheck }: Props) => {
  const llmOpenAIEngineApi = useLLMOpenAIEngineSelect();
  const allEngineApi = useGetEngineDatas();
  const { elasticList, llmEngineList, ragEngineList } = allEngineApi.allEngineList;
  const userAuthority = useRecoilValue(useUserAuthority);

  const [openAccordion, setOpenAccordion] = useState({
    llmCommonBox: false,
    retrievalBox: false,
    ragBox: false,
    normalBox: false,
  });

  if (Object.keys(data).length === 0) {
    return null;
  }

  const handleAccordion = (e) => {
    const id = e.currentTarget.parentNode.getAttribute('id');
    setOpenAccordion((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <h3 className='screen_hide'>설정</h3>
      {/* Chatbot Info */}
      <div className='accordion_box open'>
        <div className='accordion_content'>
          {userAuthority === 'admin' && data.hidden_yn !== undefined && (
            <EditToggle
              title='챗봇 숨김'
              id='hidden_yn'
              value={data.hidden_yn}
              onChange={(val) => handleChange('hidden_yn', '', val)}
            />
          )}
          <EditToggle
            title='Public 사용여부'
            id='public_use_yn'
            value={data.public_use_yn}
            onChange={(val) => handleChange('public_use_yn', '', val)}
          />
          <SettingTabChatbotInfo
            name={data.name}
            description={data.description}
            id={data.id}
            onChange={handleChange}
            onChangeImage={handleChangeImage}
          />
        </div>
      </div>

      {/* LLM Common */}
      <div id='llmCommonBox' className={`accordion_box ${openAccordion.llmCommonBox ? 'open' : ''}`}>
        <button type='button' className='accordion_btn' onClick={handleAccordion}>
          LLM Common
          <img className='ico_up' src={icon_up} alt={openAccordion.llmCommonBox ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <SettingTabLLMCommon data={data.llm_common} onChange={handleChange} />
        </div>
      </div>

      {/* Reproduce Question */}
      <div id='retrievalBox' className={`accordion_box ${openAccordion.retrievalBox ? 'open' : ''}`}>
        {/* <button type='button' className='accordion_btn' onClick={handleAccordion}> */}
        <button
          type='button'
          className={data.reproduce_question.use_yn ? 'accordion_btn' : 'accordion_btn_no'}
          onClick={handleAccordion}
        >
          Reproduce Question
          <img className='ico_up' src={icon_up} alt={openAccordion.retrievalBox ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <SettingTabReproduceQuestion
            data={data.reproduce_question}
            onChange={handleChange}
            parameters={data.reproduce_question?.parameters}
            llmSelectList={llmEngineList}
            valueCheck={valueCheck}
            mode="rq"
            />
        </div>
      </div>

      {/* RAG */}
      <div id='ragBox' className={`accordion_box ${openAccordion.ragBox ? 'open' : ''}`}>
        <button
          type='button'
          className={data.rag.use_yn ? 'accordion_btn' : 'accordion_btn_no'}
          onClick={handleAccordion}
        >
          RAG
          <img className='ico_up' src={icon_up} alt={openAccordion.ragBox ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <SettingTabRag
            data={data.rag}
            onChange={handleChange}
            parameters={data.rag?.parameters}
            llmSelectList={llmEngineList}
            llmFunctionSelectList={llmOpenAIEngineApi}
            ragSelectList={ragEngineList}
            esSelectList={elasticList}
            valueCheck={valueCheck}
            mode="rag"            
          />
        </div>
      </div>

      {/* LLM */}
      <div id='normalBox' className={`accordion_box ${openAccordion.normalBox ? 'open' : ''}`}>
        <button type='button' className='accordion_btn warning' onClick={handleAccordion}>
          <div>
            <span className='txt_between'>LLM</span>

            <span className='txt_warning'>
              <img src={ico_warning} alt='' />
              <span className='txt_s'>*RAG option 활성 시 Normal conversation에 해당</span>
            </span>
          </div>
          <img className='ico_up' src={icon_up} alt={openAccordion.normalBox ? '접기' : '펼치기'} />
        </button>
        <div className='accordion_content'>
          <SettingTabLLM
            data={data.normal_conversation}
            onChange={handleChange}
            parameters={data.normal_conversation?.parameters}
            llmSelectList={llmEngineList}
            valueCheck={valueCheck}
            mode="llm"
          />
        </div>
      </div>
    </>
  );
};
export default SettingTab;
