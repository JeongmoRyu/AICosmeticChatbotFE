import { Controller, useForm } from 'react-hook-form';
import ico_close_2x from 'assets/images/image/ico_close@2x.png';
import Textarea from 'components/Textarea';
import Select from 'components/Select';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chatbotDiffAdmnin as useChatbotDiffAdmnin, settingDetailState } from 'store/ai';
import useGetEngineDatas from 'hooks/useGetEngineData';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';

function SettingTab({ handleSideBar }) {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [settingDetail, setSettingDetail] = useRecoilState(settingDetailState);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const promptClientinfoRoleValue = watch('client_info');
  const promptRequirementValue = watch('prompt_requirement');
  const promptTailValue = watch('prompt_tail');
  const promptClientInfoLength = promptClientinfoRoleValue?.length || 0;
  const promptRequirementLength = promptRequirementValue?.length || 0;
  const promptTailLength = promptTailValue?.length || 0;
  const [promptClick, setPromptClick] = useState(true);
  const handlePrompt = () => {
    setPromptClick(!promptClick);
  };
  const { ragEngineList, ragEngineData, llmEngineList, llmEngineData } = useGetEngineDatas();
  const [ChangeLLMModelNum, setChangeLLMModelNum] = useState(0 as number);
  const [ChangeTailModelNum, setChangeTailModelNum] = useState(0 as number);
  const [ChangeRAGModelNum, setChangeRAGModelNum] = useState(0 as number);
  const [retrievalClick, setretrievalClick] = useState(true);
  const handleRetrieval = () => {
    setretrievalClick(!retrievalClick);
  };
  const [llmClick, setllmClick] = useState(true);
  const handlellm = () => {
    setllmClick(!llmClick);
  };

  useLayoutEffect(() => {
    getChatbotDetail();
  }, []);

  const getChatbotDetail = async () => {
    const response = await sendRequestProAI(`/chatbot/${chatbotDiffAdmnin}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data[0];
        setSettingDetail((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('챗봇 관련 정보 획득에 오류가 발생하였습니다', 'error');
    }
  };

  const putSettingDetail = async (settingData: IChatbotDataItem) => {
    console.log(settingData);
    const response = await sendRequestProAI(`/chatbot/${chatbotDiffAdmnin}`, 'put', undefined, settingData);

    console.log(response);
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        if (response.data.result !== false) {
          const data = response.data.data;
          showNotification('정상적으로 수정되었습니다.', 'success');
        } else {
          showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
        }
      } else {
        showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      }
    } else {
      showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      return;
    }
  };

  const handleRAGChangeSelect = (e: React.MouseEvent<HTMLButtonElement>, engineType) => {
    e.preventDefault();
    const selectedLabel: string | undefined = e.currentTarget.dataset.label;
    const selectedValue: string | undefined = e.currentTarget.dataset.value;
    const number = findIndexByName(ragEngineData, selectedLabel as string);

    setValue('retriever_engine_id', selectedValue as string);

    setChangeRAGModelNum(number as number);
    setSettingDetail((prev) => ({
      ...prev,
      [engineType]: selectedValue,
      rag_parameters: ragEngineData[number as number].parameters as IEngineParameter[],
    }));

    console.log(engineType, selectedLabel, ':', selectedValue, ':', ChangeRAGModelNum);
  };

  function findIndexByName(dataList: ILLMEngineData[], selectedLabel: string): number | null {
    for (let engineindex = 0; engineindex < dataList.length; engineindex++) {
      if (dataList[engineindex].name === selectedLabel) {
        return engineindex;
      }
    }
    return null;
  }

  const handleLLMOnChangeSelect = (e: React.MouseEvent<HTMLButtonElement>, engineType) => {
    e.preventDefault();
    const selectedLabel: string | undefined = e.currentTarget.dataset.label;
    const selectedValue: string | undefined = e.currentTarget.dataset.value;
    const number = findIndexByName(llmEngineData, selectedLabel as string);

    setValue('llm_engine_id', selectedValue as string);

    setChangeLLMModelNum(number as number);
    setSettingDetail((prev) => ({
      ...prev,
      [engineType]: selectedValue,
      llm_parameters: llmEngineData[number as number].parameters as IEngineParameter[],
    }));

    console.log(engineType, selectedLabel, ':', selectedValue, ':', ChangeLLMModelNum);
  };
  const handleTailOnChangeSelect = (e: React.MouseEvent<HTMLButtonElement>, engineType) => {
    e.preventDefault();
    const selectedLabel: string | undefined = e.currentTarget.dataset.label;
    const selectedValue: string | undefined = e.currentTarget.dataset.value;
    const number = findIndexByName(llmEngineData, selectedLabel as string);

    setValue('tail_engine_id', selectedValue as string);

    setChangeTailModelNum(number as number);
    setSettingDetail((prev) => ({
      ...prev,
      [engineType]: selectedValue,
      tail_parameters: llmEngineData[number as number].parameters as IEngineParameter[],
    }));

    console.log(engineType, selectedLabel, ':', selectedValue, ':', ChangeTailModelNum);
  };

  const MultiTurnInput = () => {
    const handleNumChange = (value) => {
      const inputValue = value;
      const numericValue = parseInt(inputValue, 10);
      const isIntegerValid = inputValue === '' || (!isNaN(numericValue) && /^-?\d+$/.test(inputValue));
      if (inputValue === '' || (isIntegerValid && numericValue > 0)) {
        setValue('multi_turn', inputValue);
      } else {
        showNotification('정수를 입력하세요.', 'error');
      }
    };
    return (
      <div className={`flex items-center text-xl`} key='multi_turn'>
        <Controller
          control={control}
          name='multi_turn'
          defaultValue={5}
          render={({ field }) => (
            <input
              {...field}
              type='text'
              className='ml-auto w-[120px] text-primary-default text-right border border-gray-400 rounded'
              onChange={(e) => handleNumChange(e.target.value)}
            />
          )}
        />
      </div>
    );
  };

  const EngineParameterInput = ({ param, engineType }) => {
    const fieldName = `${engineType}_parameters.${param.key}`;

    const handleInputChange = (value) => {
      const inputValue = value;
      const numericValue = parseFloat(inputValue);
      const decimalPlaces = Math.max(
        param.range.from.toString().split('.')[1]?.length || 0,
        param.range.to.toString().split('.')[1]?.length || 0,
      );
      const isDecimalValid =
        inputValue === '' ||
        (!isNaN(numericValue) && new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`).test(inputValue));
      if (
        inputValue === '' ||
        (!isNaN(numericValue) &&
          numericValue >= Number(param.range.from) &&
          numericValue <= Number(param.range.to) &&
          isDecimalValid)
      ) {
        setValue(fieldName, inputValue);
      } else {
        showNotification(
          `${param.range.from} ~ ${param.range.to} 사이의 숫자를 입력하세요. 소수점 ${decimalPlaces}자리까지 허용됩니다.`,
          'error',
        );
      }
    };

    return (
      <div className={`flex items-center text-sm`} key={`${engineType}_${param.key}`}>
        {param.label} ( {param.range.from} ~ {param.range.to} )
        {param.mandatory && <span className='text-red-500 ml-1'>*</span>}
        <Controller
          control={control}
          name={fieldName}
          defaultValue={param.value}
          render={({ field }) => (
            <input
              {...field}
              type='text'
              className='ml-auto w-[120px] text-primary-default text-right border border-gray-400 rounded'
              onChange={(e) => handleInputChange(e.target.value)}
            />
          )}
        />
      </div>
    );
  };

  const onSubmit = async (data: any) => {
    console.log('Submitted data:', data);
    console.log('Current settingDetail:', settingDetail);

    const updatedSettingDetail = {
      ...settingDetail,
      llm_engine_id: data.llm_engine_id,
      tail_engine_id: data.tail_engine_id,
      prompt_requirement: data.prompt_requirement,
      client_info: data.client_info,
      multi_turn: data.multi_turn,
      prompt_tail: data.prompt_tail,
      retriever_engine_id: data.retriever_engine_id,
      llm_parameters: settingDetail.llm_parameters.map((parameter) =>
        Object.prototype.hasOwnProperty.call(data.llm_parameters, parameter.key)
          ? { ...parameter, value: data.llm_parameters[parameter.key] }
          : parameter,
      ),
      tail_parameters: settingDetail.tail_parameters.map((parameter) =>
        Object.prototype.hasOwnProperty.call(data.tail_parameters, parameter.key)
          ? { ...parameter, value: data.tail_parameters[parameter.key] }
          : parameter,
      ),
      rag_parameters: settingDetail.rag_parameters.map((parameter) =>
        Object.prototype.hasOwnProperty.call(data.rag_parameters, parameter.key)
          ? { ...parameter, value: data.rag_parameters[parameter.key] }
          : parameter,
      ),
    };
    setSettingDetail(updatedSettingDetail);
    try {
      console.log('***here***', updatedSettingDetail);
      await putSettingDetail(updatedSettingDetail);
      console.log('서버로 데이터 전송 완료');
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    reset({
      name: settingDetail.name ?? '',
      client_info: settingDetail.client_info ?? '',
      multi_turn: settingDetail.multi_turn ?? '',
      prompt_requirement: settingDetail.prompt_requirement ?? '',
      prompt_tail: settingDetail.prompt_tail ?? '',
      retriever_engine_id: settingDetail.retriever_engine_id ?? '',
      llm_engine_id: settingDetail.llm_engine_id ?? '',
      tail_engine_id: settingDetail.tail_engine_id ?? '',
      llm_parameters: settingDetail.llm_parameters.reduce((acc, param) => {
        acc[param.key] = param.value;
        return acc;
      }, {}),

      rag_parameters: settingDetail.rag_parameters.reduce((bcc, param) => {
        bcc[param.key] = param.value;
        return bcc;
      }, {}),

      tail_parameters: settingDetail.tail_parameters.reduce((ccc, param) => {
        ccc[param.key] = param.value;
        return ccc;
      }, {}),
    });
  }, [settingDetail, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='xl:flex flex-col justify-top'>
        <div>
          <button
            type='button'
            className='w-full intro-y flex flex-row sm:flex-row items-center justify-between'
            onClick={handlePrompt}
          >
            <h4 className='mr-6 font-bold text-xl leading-10 flex items-center'>User Prompt</h4>
            <img
              src={ico_close_2x}
              alt='Close'
              className={`invert w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${!promptClick && 'rotate-180'}`}
            />
          </button>
          <div className='border-b-2 border-solid border-gray-400 w-full mb-1'></div>
          {promptClick && (
            <div>
              <div>
                <div className='flex items-center justify-between'>
                  <h4 className='text-base leading-10 mr-1'>Client Info</h4>
                  <span className='ml-0 text-red-500'>*</span>
                  <span id='client_info' className='float-right ml-auto mr-0'></span>
                </div>
                <Textarea
                  id='client_info'
                  {...register('client_info')}
                  name='client_info'
                  value={settingDetail.client_info}
                  boxClassName='multi !h-40 text-primary-default text-sm'
                  maxLength={10000}
                />
                <div className='flex justify-end'>{`${promptClientInfoLength} / 10000 자`}</div>
              </div>
              <div className='flex flex-row justify-between mb-5 mt-3'>
                <span className='text-lg'>MultiTurn</span>
                <MultiTurnInput />
              </div>
              <div>
                {ragEngineList && ragEngineList.length > 0 && (
                  <Select
                    register={{ ...register('retriever_engine_id') }}
                    id='retriever_engine_id'
                    typeList={ragEngineList}
                    boxClassName='w-full'
                    defaultLabel={
                      ragEngineList.find((engine) => engine.value === settingDetail.retriever_engine_id)?.label
                    }
                    defaultValue={settingDetail.retriever_engine_id as string}
                    onClick={(e) => handleRAGChangeSelect(e, 'retriever_engine_id')}
                  />
                )}
                {ragEngineData[ChangeRAGModelNum] && (
                  <div className='mt-5'>
                    {ragEngineData[ChangeRAGModelNum]?.parameters.map((ragparam, ragparamindex) => (
                      <EngineParameterInput key={`rag_${ragparam.key}`} param={ragparam} engineType='rag' />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* retreival 엔진 */}

        <button
          type='button'
          className='w-full intro-y flex flex-row sm:flex-row items-center mt-8 justify-between'
          onClick={handleRetrieval}
        >
          <h4 className='mr-6 font-bold text-xl leading-10 flex items-center'>Prompt Requirement</h4>
          <img
            src={ico_close_2x}
            alt='Close'
            className={`invert w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${!retrievalClick && 'rotate-180'}`}
          />
        </button>
        <div className='border-b-2 border-solid border-gray-400 w-full mb-2.5'></div>
        {retrievalClick && (
          <div>
            <div className='flex items-center justify-between mb-1'>
              <h4 className='mr-6 text-base leading-10'>
                Prompt Requirement
                <span className='text-red-500'>*</span>
              </h4>
              <span id='prompt_requirement' className='float-right ml-auto mr-0'></span>
            </div>
            <Textarea
              id='prompt_requirement'
              {...register('prompt_requirement')}
              name='prompt_requirement'
              value={settingDetail.prompt_requirement}
              boxClassName='multi !h-40 text-primary-default text-sm'
              maxLength={10000}
            />
            <div className='flex justify-end'>{`${promptRequirementLength} / 10000 자`}</div>
            <div>
              {llmEngineList && llmEngineList.length > 0 && (
                <Select
                  register={{ ...register('llm_engine_id') }}
                  id='llm_engine_id'
                  typeList={llmEngineList}
                  defaultLabel={llmEngineList.find((engine) => engine.value === settingDetail.llm_engine_id)?.label}
                  defaultValue={settingDetail.llm_engine_id as string}
                  boxClassName='w-full'
                  onClick={(e) => {
                    handleLLMOnChangeSelect(e, 'llm_engine_id');
                  }}
                  // error={errors.hasOwnProperty("llm_engine_id") ? true : false}
                  // reset={isReset}
                />
              )}
              {llmEngineData[ChangeLLMModelNum] && (
                <div className='mt-5'>
                  {llmEngineData[ChangeLLMModelNum]?.parameters.map((llmparam, llmparamindex) => (
                    <EngineParameterInput key={`llm_${llmparam.key}`} param={llmparam} engineType='llm' />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type='button'
          className='w-full intro-y flex flex-row sm:flex-row items-center mt-8 justify-between'
          onClick={handlellm}
        >
          <h4 className='mr-6 font-bold text-xl leading-10 flex items-center'>Prompt Tail</h4>
          <img
            src={ico_close_2x}
            alt='Close'
            className={`invert w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${!llmClick && 'rotate-180'}`}
          />
        </button>
        <div className='border-b-2 border-solid border-gray-400 w-full mb-2.5'></div>
        {llmClick && (
          <div>
            <div className='flex items-center justify-between mb-1'>
              <h4 className='mr-6 text-base leading-10'>
                Prompt Tail
                <span className='text-red-500'>*</span>
              </h4>
              <span id='prompt_tail' className='float-right ml-auto mr-0'></span>
            </div>
            <Textarea
              id='prompt_tail'
              {...register('prompt_tail')}
              name='prompt_tail'
              value={settingDetail.prompt_tail}
              boxClassName='multi !h-40 text-primary-default text-sm'
              maxLength={10000}
            />
            <div className='flex justify-end'>{`${promptTailLength} / 10000 자`}</div>
            <div>
              {llmEngineList && llmEngineList.length > 0 && (
                <Select
                  register={{ ...register('tail_engine_id') }}
                  id='tail_engine_id'
                  typeList={llmEngineList}
                  defaultLabel={llmEngineList.find((engine) => engine.value === settingDetail.tail_engine_id)?.label}
                  defaultValue={settingDetail.tail_engine_id as string}
                  boxClassName='w-full'
                  onClick={(e) => {
                    handleTailOnChangeSelect(e, 'tail_engine_id');
                  }}
                  // error={errors.hasOwnProperty("llm_engine_id") ? true : false}
                  // reset={isReset}
                />
              )}
              {llmEngineData[ChangeTailModelNum] && (
                <div className='mt-5'>
                  {llmEngineData[ChangeTailModelNum]?.parameters.map((tailparam, tailparamindex) => (
                    <EngineParameterInput key={`tail_${tailparam.key}`} param={tailparam} engineType='tail' />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className='flex justify-end mt-5'>
          <button className='bg-white text-primary-default px-6 py-3 rounded'>Save</button>
          {/* <button
            // type="submit"
            // className="btn btn-secondary"
            // onClick={
            //   checkedId === "1" ||
            //   checkedId === "create_option" ||
            //   !checkedId
            //     ? postSettingDetail
            //     : putSettingDetail
            // }
          >
            저장하기
          </button> */}
        </div>
      </div>
    </form>
  );
}

export default SettingTab;
