import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  SemanticChunkingBPType as useSemanticChunkingBPType,
  SemanticChunkingEmbedding as useSemanticChunkingEmbedding
} from 'store/pro-ai';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';
import { showNotification } from 'utils/common-helper';
import { useNavigate } from 'react-router-dom';


const useEmbeddingRankerCodeSelect = (type: string) => {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [SemanticChunkingBPType, setSemanticChunkingBPType] = useRecoilState(useSemanticChunkingBPType);
  const [SemanticChunkingEmbedding, setSemanticChunkingEmbedding] = useRecoilState(useSemanticChunkingEmbedding);
  const navigate = useNavigate();

  const getEmbeddingRankerCodes = useCallback(async () => {
    if (type) {
      const response = await sendRequestProAI(`/code/${type}`, 'get');
      if (response && response.code === 'F002') {
        showNotification('인증되지 않은 사용자입니다. 다시 로그인해주세요', 'error');
        navigate('/login');
        return;
      }
      if (response && response.data) {
        const data = response.data.data;
        if (data && data.length > 0) {
          const responseData = data;
          const typeList: SelectListCodeType[] = responseData.map((item: EngineCodeTypes) => ({
            text: item.name,
            // id: item.name,
            value: item.cd_id,
          }));
          if (type === 'SEMANTIC_CHUNKING_BP_TYPE') {
            return setSemanticChunkingBPType(typeList);
          } else {
            return setSemanticChunkingEmbedding(typeList);
          }
          // return setLlmOpenAIEngineApi(typeList);
        }
      } else {
        showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    getEmbeddingRankerCodes();
  }, []);


  if (type === 'SEMANTIC_CHUNKING_BP_TYPE') {
    return SemanticChunkingBPType;
  } else {
    return SemanticChunkingEmbedding;
  }
  // return llmoOpenAIEngineApi;
};

export default useEmbeddingRankerCodeSelect;
