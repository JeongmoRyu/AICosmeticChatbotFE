import { useNavigate } from 'react-router-dom';
import RoundCard from '../components/RoundCard';
import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import EllyBanner from 'assets/images/image/EllyBanner.png';

import ico_gene from 'assets/images/image/gene@3x.png';
import ico_consulting from 'assets/images/image/consulting@3x.png';
import ico_product from 'assets/images/image/product@3x.png';
import ico_skin from 'assets/images/image/skins@3x.png';
import ico_add from 'assets/images/image/ico_add@3x.png';
import { userLoginState as useUserLoginState, hostInfoName as useHostInfoName } from 'store/ai';
import { useRecoilValue } from 'recoil';

export default function ProAI() {
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  const hostInfoName = useRecoilValue(useHostInfoName);

  const handleCreateBuilder = () => {
    navigate(`/chatbuilder/${hostInfoName}`);
  };

  const RoundCardImg = [
    { img: ico_gene, title: '유전자 검사' },
    { img: ico_consulting, title: '상담' },
    { img: ico_product, title: '제품 추천' },
    { img: ico_skin, title: '피부 정보 문답' },
  ];

  return (
    <div className='flex flex-row w-full h-full'>
      {/* content */}
      <div className='flex justify-center w-full bg-slate-100'>
        <div className='flex flex-col max-w-[880px] max-h-[1000px] w-full h-full justify-evenly'>
          <div className='flex justify-end'>
            {userLoginState.name !== 'chatplaytest1' ? (
              <button
                className='flex items-center justify-center font-bold w-[92px] h-8 rounded-lg text-white text-sm bg-primary-default'
                onClick={handleCreateBuilder}
              >
                <img className='mr-2 w-2.5 h-2.5' src={ico_new_create} alt='create' />
                Create
              </button>
            ) : null}
          </div>
          <div>
            <div className='text-2xl font-bold'>AI Chat</div>
            <div className='mt-10 flex file:justify-between bg-white p-9 gap-x-10'>
              <RoundCard to={`/chatroom/${hostInfoName}`} imageUrl={EllyBanner} altText='chat room' caption='AICHAT' />
              {userLoginState.name !== 'chatplaytest1' ? (
                <RoundCard
                  to={`/chatbuilder/${hostInfoName}`}
                  imageUrl={ico_add}
                  altText='chatbuilder'
                  caption='Chatbuilder'
                  imgClassName='h-[50%] w-[50%] object-fit self-center'
                />
              ) : null}
            </div>
          </div>
          <div>
            <div className='text-2xl font-bold'>Dialogue Bot</div>
            <div className='mt-10 flex justify-between bg-white p-9'>
              {RoundCardImg.map((card, index) => (
                <RoundCard
                  key={index}
                  to={`/chatroom/${hostInfoName}`}
                  imageUrl={card.img}
                  caption={card.title}
                  altText='Dialogue Bot'
                  imgClassName='h-[50%] w-[50%] object-fit self-center'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
