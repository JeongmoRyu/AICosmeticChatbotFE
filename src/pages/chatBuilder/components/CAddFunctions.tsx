import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { hostInfoName as useHostInfoName, AddFunctionCheckList as useAddFunctionCheckList } from 'store/ai';
export default function CAddFunctions() {
  const navigate = useNavigate();
  const hostInfoName = useRecoilValue(useHostInfoName);
  const [AddFunctionCheckList, setAddFunctionCheckList] = useRecoilState(useAddFunctionCheckList);

  const handleAddFunctions = () => {
    navigate(`/addfunctions/${hostInfoName}`);
  };
  const handleRmFunction = (functionItemToRemove) => {
    const updatedFunctionList = AddFunctionCheckList.filter(item => item !== functionItemToRemove);
    setAddFunctionCheckList(updatedFunctionList);
  };

  return (
    <div className='w-full'>
      <ul className='mt-3 mb-3'>
        <li className='mt-1'>
          {AddFunctionCheckList && AddFunctionCheckList.length > 0 ? (
            <div className='w-full flex flex-col'>
              <div className='flex flex-row justify-between items-center mb-1'>
                <span className='font-semibold'>Add functions</span>
                <button
                  className='flex items-center justify-center font-bold w-[100px] h-[40px] rounded-lg text-gray-500 bg-[#fff]'
                  onClick={handleAddFunctions}
                >
                  Choose
                </button>
              </div>
              <div className='flex flex-row'>
                <span className='flex-1 ml-2 text-gray-400'>Name</span>
                <span className='flex-1 mr-10 text-gray-400'>Category</span>

              </div>
              {AddFunctionCheckList.map((functionItem, index) => {
                return (
                  <div key={`usingFunction_${index}`} className='w-full flex justify-between rounded-2xl items-center border-gray-400 py-2 bg-white mt-1'>
                    <span className='flex-1 ml-4'>{functionItem.title}</span> 
                    <span className='flex-1 text-left'>{functionItem.category}</span>
                    <div className='border py-5 border-gray-400'>

                    </div>
                    <button
                      className='ml-1 mr-2 px-4 py-2 text-xl rounded bg-white text-gray-300'
                      onClick={() => handleRmFunction(functionItem)} 
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <span>Add functions</span>

              <button
                className='flex items-center justify-center font-bold w-[138px] h-[54px] rounded-lg text-gray-500 bg-[#fff]'
                onClick={handleAddFunctions}
              >
                Choose
              </button>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}
