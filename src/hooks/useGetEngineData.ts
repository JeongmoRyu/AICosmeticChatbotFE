import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import { chatbotIdState as useChatbotIdState } from 'store/pro-ai';

interface AllEngineListType {
  elasticList: SelectListType[];
  llmEngineList: SelectListType[];
  ragEngineList: SelectListType[];
}

export default function useGetEngineDatas() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [allEngineList, setAllEngineList] = useState<AllEngineListType>({
    elasticList: [],
    llmEngineList: [],
    ragEngineList: [],
  });
  const [allEngineData, setAllEngineData] = useState<ILLMEngineData[]>([]);

  useEffect(() => {
    getAllEngines();
  }, []);

  const getAllEngines = async () => {
    const params = { chatbot_id: chatbotId };
    const response = await sendRequestProAI('/chatbotinfo/optionlist', 'get', undefined, undefined, params);
    if (response && response.data) {
      const data = response.data.data;
      if (data) {
        const { elasticList, llmEngineList, ragEngineList } = data;
        const extractIdAndName = (list) =>
          list.map(({ id, name, parameters }) => ({ id: name, value: id, text: name, parameters: parameters }));
        setAllEngineList({
          elasticList: extractIdAndName(elasticList),
          llmEngineList: extractIdAndName(llmEngineList),
          ragEngineList: extractIdAndName(ragEngineList),
        });

        setAllEngineData(data);
      }
    } else {
      showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  return { allEngineList, allEngineData };
}
