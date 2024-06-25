import { useEffect, useState } from 'react';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';

interface EngineListType {
  label: string;
  value: string;
}

function useGetEngineDatas() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [ragEngineList, setRAGEngineList] = useState<EngineListType[]>([]);
  const [ragEngineData, setRAGEngineData] = useState<IRagEngineData[]>([]);
  const [llmEngineList, setLLMEngineList] = useState<EngineListType[]>([]);
  const [llmEngineData, setLLMEngineData] = useState<ILLMEngineData[]>([]);

  useEffect(() => {
    getLLMEngines();
    getRetrieverEngines();
  }, []);

  const getLLMEngines = async () => {
    const response = await sendRequestProAI('/llmengine/', 'get');
    if (response && response.data) {
      const data = response.data.data;
      if (data && data.length > 0) {
        const responseData = data;
        const typeList: EngineListType[] = responseData.map((item: Engine_Types) => ({
          label: item.name,
          value: item.id,
        }));
        setLLMEngineList(typeList);
        setLLMEngineData(data);
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  const getRetrieverEngines = async () => {
    const response = await sendRequestProAI('/ragengine/', 'get');
    if (response && response.data) {
      const data = response.data.data;
      if (data && data.length > 0) {
        const responseData = data;
        const RAGtypeList: EngineListType[] = responseData.map((item: Engine_Types) => ({
          label: item.name,
          value: item.id,
        }));
        setRAGEngineList(RAGtypeList);
        setRAGEngineData(data);
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  return {
    ragEngineList,
    ragEngineData,
    llmEngineList,
    llmEngineData,
  };
}

export default useGetEngineDatas;
