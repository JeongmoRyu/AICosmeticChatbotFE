// import MainToggleMenu from 'pages/chatRoom/components/MainToggleMenu';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');

  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${hour}:${minute}`;
};



const RoundCard: React.FC<RoundImageLinkProps> = ({
  cardItem,
  to,
  cardClick,
  imgClassName,
  navigateOptions,
  // isToggleBtnVisible,
  // onDeleteSuccess
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    cardClick && cardClick();
    to && navigate(to, { state: navigateOptions });
  };

  return (
    // <div className='p-[15px] w-[25%] relative'>
    <div className="card sv-card desktop:max-w-[360px] h-full bg-white">
      <button type='button' className="w-full text-left" onClick={handleClick}>
        <div className="p-6  lowere-part">

          <div className="flex flex-row justify-between items-start title-wrap">
            <div className='flex flex-col'>
              <div className="chathubicon p-1.5 text-white border border-[#D0D9E3]">
                <img src={cardItem.image} alt={cardItem.name} className={`w-full h-auto object-contain ${imgClassName ? imgClassName : ''}`} />
              </div>
              <div className="ml-[5px] w-full">
                <p className="font-bold text-lg text-black mt-[10px] truncate max-w-full" title={cardItem.name}>
                  {cardItem.name.length > 36 ? `${cardItem.name.slice(0, 35)}...` : cardItem.name}
                </p>
                {/* <p className="font-bold text-lg mb-1 text-black mt-3">{cardItem.name}</p> */}
                <div className='h-full min-h-5 mt-auto'></div>
                <div className='smp'>
                  <div className='flex flex-col'>
                    <div className='flex'>
                      {/* <p className='text-xs text-gray-500 w-16'>생성자</p> */}
                      {cardItem.user_name != null ? (
                        <p className='w-16'>생성자</p>
                      ) : cardItem.user_id != null ? (
                        <p className='w-16'>생성자</p>
                      ) : Number(cardItem.user_key) === 0 ? (
                        <p className='w-16'></p>
                      ) : (
                        <p className='w-16'></p>
                      )}
                      {cardItem.user_name != null ? (
                          <p>{cardItem.user_name}</p>
                        ) : cardItem.user_id != null ? (
                          <p>{cardItem.user_id}</p>
                        ) : Number(cardItem.user_key) === 0 ? (
                          <p></p>
                        ) : (
                          <p></p>
                        )}
                    </div>
                    <div className='flex mt-[5px]'>
                      {/* <p className='text-xs text-gray-500 w-16'>최근 수정</p> */}
                      {cardItem.updated_at != null ? (
                      <p className='w-16'>최근 수정</p>
                    ) : Number(cardItem.user_key) === 0 ? (
                      <p className='w-16'></p>
                      ) : (
                        <p className='w-16'></p>
                      )}
                      {cardItem.updated_at != null ? (
                        <p>{formatDate(cardItem.updated_at)}</p>
                      ) : Number(cardItem.user_key) === 0 ? (
                        <p></p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* </div> */}
          </div>

        </div>
      </button>
    </div>
  );
};

export default RoundCard;
