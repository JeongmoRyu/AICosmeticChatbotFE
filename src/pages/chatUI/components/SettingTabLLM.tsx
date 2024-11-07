import EditTextarea from './EditTextarea';
import EditSelectBox from './EditSelectBox';
import EngineParameterInput from './EngineParameterInput';
import EditCounter from './EditCounter';
import EssentialCheck from './EssentialCheck';

interface Props {
  data: LLMType;
  onChange: (type: string, key: string, value: any, parameters?: IEngineParameter) => void;
  parameters: IEngineParameter[];
  llmSelectList?: SelectListType[];
  valueCheck?: (mode: string, value: boolean) => void;
  mode: string;
}

const essential_prompt = ['history', 'question'];

export default function SettingTabLLM({ data, onChange, parameters, llmSelectList, valueCheck, mode }: Props) {
  return (
    <>
      <EditTextarea
        labelText='System Prompt'
        id='normal_system_prompt'
        value={data.system_prompt}
        onChange={(e) => onChange('normal_conversation', 'system_prompt', e.target.value)}
      />
      <EditTextarea
        labelText='User prompt'
        id='llm_user_prompt'
        value={data.user_prompt}
        onChange={(e) => onChange('normal_conversation', 'user_prompt', e.target.value)}
      />
      <EssentialCheck userPrompt={data.user_prompt} requiredKeys={essential_prompt} valueCheck={valueCheck} mode={mode} />
      <EditCounter
        title='Retry 횟수'
        id='llm_retry'
        value={String(data.retry)}
        onChange={(value) => onChange('normal_conversation', 'retry', value)}
      />

      {llmSelectList && (
        <>
          <EditSelectBox
            type=''
            list={llmSelectList}
            labelText='LLM Model'
            name='llm_llm_model'
            activeValue={data.llm_engine_id}
            onChange={(value, parameters) => onChange('normal_conversation', 'llm_engine_id', value, parameters)}
          />
          <EditSelectBox
            type=''
            list={llmSelectList}
            labelText='Fallback Model'
            name='llm_fallback_model'
            activeValue={data.fallback_engine_id}
            onChange={(value) => onChange('normal_conversation', 'fallback_engine_id', value)}
          />
        </>
      )}

      <EngineParameterInput engineType='normal_conversation' parameters={parameters} onChange={onChange} />
    </>
  );
}
