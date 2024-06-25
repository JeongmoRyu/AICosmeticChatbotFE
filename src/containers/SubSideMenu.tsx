import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { hostInfoName as useHostInfoName } from 'store/ai';
export default function SubSideMenu() {
  const navigate = useNavigate();
  const hostInfoName = useRecoilValue(useHostInfoName)
  const [isActive, setIsActive] = useState(true);
  const handleClick = () => {
    setIsActive(current => !current);
    navigate(`/${hostInfoName}`);
  };
  const handleBuilderClick = () => {
    setIsActive(current => !current);
    navigate(`chatbuilder/${hostInfoName}`);
  }
  return (
    <div className='flex flex-row h-full'>
      <div className='flex flex-col items-center w-full h-full'>
        <button
          name='AD'
          className={`flex flex-row items-center justify-start mt-4 mx-2 px-4 py-2 w-48 h-12 rounded-md font-bold ${
            isActive ? 'bg-[#e2edfc]' : 'bg-white'
          } `}
          onClick={handleClick}
        >
          AIBC
        </button>
        <button
          name='Chatbuilder'
          className={`flex flex-row items-center justify-start mt-4 mx-2 px-4 py-2 w-48 h-12 rounded-md font-bold ${
            isActive ? 'bg-white' : 'bg-[#e2edfc]'
          } `}
          onClick={handleBuilderClick}
        >
          Chat Builder
        </button>
      </div>
    </div>
  );
}
