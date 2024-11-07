import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { LLMOpenAIEngineSelectList as useLLMOpenAIEngineApi } from 'store/pro-ai';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';

const useLLMOpenAIEngineSelect = () => {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [llmoOpenAIEngineApi, setLlmOpenAIEngineApi] = useRecoilState(useLLMOpenAIEngineApi);

  const getLLMOpenAIEngines = useCallback(async () => {
    if (!llmoOpenAIEngineApi) {
      const response = await sendRequestProAI('/engine/LLM/OPENAI', 'get');
      if (response && response.data) {
        const data = response.data.data;
        if (data && data.length > 0) {
          const responseData = data;
          const typeList: SelectListType[] = responseData.map((item: Engine_Types) => ({
            text: item.name,
            id: item.name,
            value: item.id,
          }));
          return setLlmOpenAIEngineApi(typeList);
        }
      } else {
        showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    getLLMOpenAIEngines();
  }, []);

  return llmoOpenAIEngineApi;
};

export default useLLMOpenAIEngineSelect;
