import ico_chevron_left from 'assets/images/image/chevron-left@3x.png';
import ico_chevron_down from 'assets/images/image/chevron-down@3x.png';
import Instructions from './components/Instructions';
import CAddFunctions from './components/CAddFunctions';
import ConversationStarter from './components/ConversationStarter';
import Knowledge from './components/Knowledge';
import AddActions from './components/AddActions';
import TestChatting from './components/TestChatting';
import { useNavigate } from 'react-router-dom';
import { hostInfoName as useHostInfoName, AddFunctionCheckList as useAddFunctionCheckList } from 'store/ai';
import { useRecoilState, useRecoilValue } from 'recoil';
export default function ChatBuilder() {
  const navigate = useNavigate();
  const hostInfoName = useRecoilValue(useHostInfoName);
  const [AddFunctionCheckList, setAddFunctionCheckList] = useRecoilState(useAddFunctionCheckList);

  const handleBacktoAIBC = () => {
    setAddFunctionCheckList([]);

    navigate(`/${hostInfoName}`);
    
  };
  const handleSaveChatBuilder = () => {
    setAddFunctionCheckList([]);

    navigate(`/${hostInfoName}`);
    console.log('navigate clear');
  };
  return (
    <div className='flex flex-row w-full h-full '>
      {/* content */}
      <div className='flex flex-col items-start justify-center w-full h-full bg-slate-100'>
        <div className='flex flex-col justify-center w-full px-10'>
          <div className='flex justify-between'>
            <div className='ml-4'>
              <button className='flex flex-row h-[54px] item-center justify-center' onClick={handleBacktoAIBC}>
                <img src={ico_chevron_left} alt='backtochat' className='w-6 h-7 item-center justify-center' />
                <span className='font-bold text-xl hover:underline cursor-pointer'>AIBC</span>
              </button>
            </div>
            <button
              className='flex items-center justify-center font-bold w-24 h-8 rounded-md text-white bg-primary-default text-sm'
              onClick={handleSaveChatBuilder}
            >
              Save
              <img className='w-5 h-6 item-center justify-center ml-1' src={ico_chevron_down} alt='save' />
            </button>
          </div>
          <div className='flex justify-center mt-4 h-[calc(100vh-14rem)]'>
            {/* chatBuilder */}
            <div className='flex flex-col items-start overflow-y-auto w-1/2 pr-5'>
              <Instructions />
              <CAddFunctions />
              <ConversationStarter />
              <Knowledge />
              <AddActions />
            </div>

            {/* test chatting */}
            <div className='relative flex flex-col w-1/2 items-start'>
              <TestChatting />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
