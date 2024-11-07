import useEmbeddingCheck from 'hooks/useEmbeddingCheck';
// import MainToggleMenu from 'pages/chatRoom/components/MainToggleMenu';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from 'utils/common-helper';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
// import Modal from 'components/Modal';
import { CHATBUILDER } from 'data/routers';


const EmbeddingCheckRoundCard: React.FC<RoundImageLinkProps> = ({
  cardItem,
  to,
  cardClick,
  imgClassName,
  navigateOptions,
  isToggleBtnVisible,
  onDeleteSuccess,
  setIsModalVisible,
  setChatbotItemState,
}) => {
  const navigate = useNavigate();
  const { entryEmbeddingCheck } = useEmbeddingCheck([cardItem]);
  const { sendRequestProAI } = useProAIRestfulCustomAxios();

  const handleClick = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.card-action-btn')) {
      return;
    }

    const isComplete = await entryEmbeddingCheck(cardItem.id);
    console.log(isComplete);

    if (isComplete) {
      cardClick && cardClick();
      to && navigate(to, { state: navigateOptions });
    } else {
      showNotification('Embedding이 진행 중입니다. 다른 챗봇을 이용해주세요', 'error');
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    }
  };

  const onClickEditChatbotToggle = () => {
    navigate(CHATBUILDER, { state: navigateOptions });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');

    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${hour}:${minute}`;
  };

  const onClickDeleteToggle = () => {
    setChatbotItemState && setChatbotItemState(cardItem);
    console.log(cardItem.id);
    setIsModalVisible && setIsModalVisible(true);
  };

  return (

    <>
      <div
        className={`card sv-card desktop:max-w-[360px] bg-white`}
        // className={`card sv-card desktop:max-w-[360px] bg-white ${isModalVisible ? 'pointer-events-none' : ''}`}
        onClick={handleClick}
      >
        <div>
          <div className='p-6 lowere-part cursor-pointer'>
            <div className='flex flex-row justify-between items-start title-wrap'>
              <div className='flex flex-col w-full'>
                <div className='flex flex-row justify-between items-center'>
                  <div className='icon overflow-hidden text-white border border-[#D0D9E3]'>
                    <img
                      src={cardItem.image}
                      alt={cardItem.name}
                      className={`w-full h-full ${imgClassName ? imgClassName : ''}`}
                    />
                  </div>
                </div>
                <div className="ml-[5px] w-full">
                  <p className="font-bold text-lg text-black mt-[10px] truncate max-w-full" title={cardItem.name}>
                    {cardItem.name.length > 36 ? `${cardItem.name.slice(0, 35)}...` : cardItem.name}
                  </p>
                  {/* <p className='font-bold text-lg mb-1 text-black mt-3'>{cardItem.name}</p> */}
                  <div className='h-full min-h-5 mt-auto'></div>
                  <div className='smp'>
                    <div className='flex flex-col'>
                      <div className='flex'>
                        <p className='text-gray-500 w-16'>생성자</p>
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
                        <p className='text-xs text-gray-500 w-16'>최근 수정</p>
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
        </div>

        {isToggleBtnVisible && (
          <div className='absolute top-6 right-6 flex space-x-[10px] z-10'>
            {/* <div className='absolute top-6 right-4 flex space-x-[10px] z-10'> */}
            <button
              onClick={onClickEditChatbotToggle}
              className='card-action-btn px-2.5 py-1.5 flex items-center justify-center bg-white text-black text-[14px] font-medium rounded-[4px] border border-bd-gray hover:bg-[#F2F3F7] whitespace-nowrap'
              // className='card-action-btn w-[80px] h-[30px] flex items-center justify-center bg-white text-black text-xs font-medium rounded-[4px] border border-bd-gray hover:bg-[#F2F3F7]'
            >
              수정
            </button>
            <button
              onClick={onClickDeleteToggle}
              className='card-action-btn px-2.5 py-1.5 flex items-center justify-center bg-white text-black text-[14px] font-medium rounded-[4px] border border-bd-gray hover:bg-[#F2F3F7] whitespace-nowrap'
              // className='card-action-btn w-[80px] h-[30px] flex items-center justify-center bg-white text-black text-sm font-medium rounded-[4px] border border-bd-gray hover:bg-[#F2F3F7]'
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EmbeddingCheckRoundCard;
