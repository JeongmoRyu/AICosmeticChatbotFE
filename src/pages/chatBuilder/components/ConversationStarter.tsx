import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import { useState } from 'react';
import { showNotification } from 'utils/common-helper';

export default function ConversationStarter() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [conversationQuestions, setConversationQuestions] = useState<IProAIQuestions[]>();

  const makeQuestions = async () => {
    const response = await sendRequestProAI(
      '/chatbot/genquestion',
      'post',
      undefined,
      {
        // name: nameValue,
        // prompt_role: promptRoleValue,
        // prompt_requirement: promptRequirementValue,
        name: '챗봇1',
        prompt_role: '정답을 알려주는 챗봇',
        prompt_requirement: '정확한 정보를 제공해줘야해',
      },
      undefined,
    );
    if (response && response.data) {
      console.log(response);
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        console.log(response);
        showNotification('정상적으로 생성되었습니다.', 'success');
        setConversationQuestions(data);
      } else {
        showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      }
    } else {
      showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      return;
    }
  };

  return (
    <>
      <ul className='mt-1'>
        <li className='mt-1 '>
          <div className='flex flex-row h-[54px] items-center justify-between mb-1'>
            <span className='flex'>Conversation starters</span>
            <button
              className='flex items-center justify-center font-bold w-[100px] h-[52px] rounded-lg text-gray-500 bg-[#fff]'
              onClick={makeQuestions}
            >
              질문생성하기
            </button>
          </div>
          {conversationQuestions && conversationQuestions.length > 0 ? (
            <div>
              {conversationQuestions.map((question, index) => (
                <input
                  key={`question${index}`}
                  id={`question${index}`}
                  name={`question${index}`}
                  type='text'
                  className='ml-auto w-full h-[2.5rem] text-left border rounded-md mb-1'
                  placeholder='질문을 입력해주세요.'
                  value={question['question'] ?? ''}
                  maxLength={50}
                />
              ))}
            </div>
          ) : (
            <div>
              {Array.from({ length: 4 }, (_, index) => (
                <input
                  key={`question${index}`}
                  id={`question${index}`}
                  name={`question${index}`}
                  type='text'
                  className='ml-auto w-full h-[2.5rem] text-left border rounded mb-1'
                  placeholder='질문을 입력해주세요.'
                  maxLength={50}
                />
              ))}
            </div>
          )}
        </li>
      </ul>
    </>
  );
}

