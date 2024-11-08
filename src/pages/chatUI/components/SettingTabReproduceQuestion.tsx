import EditTextarea from './EditTextarea';
import EditSelectBox from './EditSelectBox';
import EngineParameterInput from './EngineParameterInput';
import EditToggle from './EditToggle';
import EditCounter from './EditCounter';
import EssentialCheck from './EssentialCheck';

interface Props {
  data: ReproduceQuestionType;
  onChange: (type: string, key: string, value: any, parameters?: IEngineParameter) => void;
  parameters?: IEngineParameter[];
  llmSelectList?: SelectListType[];
  valueCheck?: (mode: string, value: boolean) => void;
  mode: string;
}
export default function SettingTabReproduceQuestion({ data, onChange, parameters, llmSelectList, valueCheck, mode }: Props) {
  const essential_prompt = ['history', 'question'];

  return (
    <>
      <EditToggle
        title='RQ 사용 Option'
        id='rq_use_yn'
        value={data.use_yn}
        onChange={(val) => onChange('reproduce_question', 'use_yn', val)}
      />
      {data.use_yn && (
        <>
          <EditTextarea
            labelText='System Prompt'
            id='reproduce_question_system_prompt'
            value={data.system_prompt}
            onChange={(e) => onChange('reproduce_question', 'system_prompt', e.target.value)}
          />
          <EditTextarea
            labelText='User prompt'
            id='reproduce_question_user_prompt'
            value={data.user_prompt}
            onChange={(e) => onChange('reproduce_question', 'user_prompt', e.target.value)}
          />
          <EssentialCheck key={`essential-check-${mode}`} userPrompt={data.user_prompt} requiredKeys={essential_prompt} valueCheck={valueCheck} mode={mode}/>
          <EditCounter
            title='Retry 횟수'
            id='reproduce_question_retry'
            value={String(data.retry)}
            onChange={(value) => onChange('reproduce_question', 'retry', value)}
          />
          {llmSelectList && (
            <>
              <EditSelectBox
                type=''
                list={llmSelectList}
                labelText='LLM Model'
                name='reproduce_question_llm_model'
                activeValue={data.llm_engine_id}
                onChange={(value, parameters) => onChange('reproduce_question', 'llm_engine_id', value, parameters)}
              />
              <EditSelectBox
                type=''
                list={llmSelectList}
                labelText='Fallback Model'
                name='reproduce_question_fallback_model'
                activeValue={data.fallback_engine_id}
                onChange={(value) => onChange('reproduce_question', 'fallback_engine_id', value)}
              />
            </>
          )}
          {parameters && (
            <EngineParameterInput engineType='reproduce_question' parameters={parameters} onChange={onChange} />
          )}
        </>
      )}
    </>
  );
}
