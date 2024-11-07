import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

function Card({ img = '', title = '', text = '', onClick, isDisabled, serverImg }: ICardProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  useEffect(() => {
    serverImg && setImageSrc(serverImg);
  }, [serverImg]);

  return (
    <button
      className={`w-[16rem] ${isDisabled ? 'opacity-50' : ''} transition duration-200 transform hover:-translate-y-1 `}
      onClick={onClick}
      style={isDisabled ? { pointerEvents: 'none' } : {}}
    >
      <div className='img_box img_round_square'>
        {imageSrc ? (
          <img className='w-full h-full object-cover' src={imageSrc} alt='' />
        ) : (
          <img className='w-full h-full object-cover' src={`${connectionInfoState.restful}/file/image/0`} alt='' />
        )}
      </div>
      <div className='mb-5'></div>
      <div className='p-4 border bg-white border-bd-gray03 rounded-3xl'>
        <h1 className='text-base font-semibold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-center'>
          {title}
        </h1>
        <p className='text-primary-default text-base font-normal text-center truncate-multiline'>{text}</p>
      </div>
    </button>
  );
}

export default Card;
