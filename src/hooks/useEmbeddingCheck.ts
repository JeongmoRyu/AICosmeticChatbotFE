import { useCallback, useState } from 'react';
import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from './useProAIRestfulCustomaxios';

const useEmbeddingCheck = (chatbotList) => {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();

  const entryEmbeddingCheck = useCallback(async (chatbotId) => {
    console.log(chatbotList)
    const params = { chatbot_id_list: chatbotId.toString() };
    const response = await sendRequestProAI('/chatbotinfo/status', 'get', undefined, undefined, params);

    if (response && response.data) {
      const data = response.data.data;
      console.log(data)
      if (Array.isArray(data)) {
        const updateData = chatbotList.map((item) => {
          const matchedItem = data.find((v) => v.chatbot_id === item.id);
          return matchedItem
            ? {
              ...item,
              cnt_complete: matchedItem.cnt_complete,
              cnt_error: matchedItem.cnt_error,
              cnt_wait: matchedItem.cnt_wait,
              total_count: matchedItem.total_count,
            }
            : item;
        });
        if (
          updateData[0] &&
          (updateData[0].cnt_complete === undefined ||
            updateData[0].cnt_error === undefined ||
            updateData[0].total_count === undefined)
        ) {
          return true;
        }
        if (updateData[0].cnt_complete + updateData[0].cnt_error === updateData[0].total_count) {
          return true
        } else {
          return false
        }
      }
    } else {
      showNotification('Embedding 상태 체크에 실패하였습니다.', 'error');
      return false;
    }
  }, [chatbotList]);

  return { entryEmbeddingCheck };
};

export default useEmbeddingCheck;
