import React from 'react';
import ico_warning from 'assets/images/icons/ico_warning1.svg';
// import ico_warning from 'assets/images/icons/ico_warning1.svg';


const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');

  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${hour}:${minute}`;
};



const RoundCardForbidden: React.FC<RoundImageLinkProps> = ({ cardItem, imgClassName, isToggleBtnVisible }) => {
  return (
    <>
      <div className="card sv-card desktop:max-w-[360px] bg-white">
        <button type='button' className="w-full h-full text-left">
          <div className="p-6  lowere-part">

            <div className="flex flex-row justify-between items-start title-wrap">
              <div className='flex flex-col w-full'>

                <div className='flex flex-row justify-between items-center'>
                  <div className='icon overflow-hidden text-white border border-[#D0D9E3]'>
                    <img
                      src={cardItem.image}
                      alt={cardItem.name}
                      className={`w-full h-full ${imgClassName ? imgClassName : ''}`}
                    />
                    <span className='flex absolute bg-[rgba(0,0,0,0.5)] w-[40px] h-[40px] flex-col items-center justify-center'>
                      <img
                        src={ico_warning}
                        alt=''
                        className='max-w-none w-full h-full brightness-0 invert'
                      />
                    </span>
                    {/* <span className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <img
                      src={ico_warning}
                      alt=''
                      className='w-1/2 h-1/2 object-contain brightness-100'
                    />
                  </span> */}
                  </div>
                  <div className='lower-embedding-part'>
                    <div className='flex flex-col'>
                      <p className='mt-8'>*챗봇 생성중...
                        {(cardItem.total_count || cardItem.total_count == 0) &&
                          (cardItem.cnt_error || cardItem.cnt_error == 0) &&
                          (cardItem.cnt_wait || cardItem.cnt_wait == 0) &&
                          (cardItem.cnt_complete || cardItem.cnt_complete == 0) &&
                          ` (${cardItem.total_count - cardItem.cnt_wait}/${cardItem.total_count})`}
                      </p>
                    </div>
                  </div>
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

            </div>

          </div>
        </button>

        {isToggleBtnVisible && (
          <div className='absolute top-6 right-6 flex space-x-[10px] z-10'>
            {/* <div className='absolute top-6 right-4 flex space-x-[10px] z-10'> */}
            <button
              className='card-action-btn px-2.5 py-1.5 flex items-center justify-center bg-[#F4F5F8] text-[#888888] text-[14px] font-medium rounded-[4px] border border-bd-gray whitespace-nowrap'
            // className='card-action-btn w-[80px] h-[30px] flex items-center justify-center bg-[#F4F5F8] text-[#888888] text-sm font-medium rounded-[4px] border border-bd-gray'
            >
              수정
            </button>
            <button
              className='card-action-btn px-2.5 py-1.5 flex items-center justify-center bg-[#F4F5F8] text-[#888888] text-[14px] font-medium rounded-[4px] border border-bd-gray whitespace-nowrap'
            // className='card-action-btn w-[80px] h-[30px] flex items-center justify-center bg-[#F4F5F8] text-[#888888] text-sm font-medium rounded-[4px] border border-bd-gray'
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RoundCardForbidden;
