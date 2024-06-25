import ico_chevron_left from 'assets/images/image/chevron-left@3x.png';
import { useNavigate } from 'react-router-dom';
import ico_weather from 'assets/images/image/ico_weather.png';
import ico_time from 'assets/images/image/ico_time.png';
import ico_alarm from 'assets/images/image/ico_alarm.png';
import Cfunction from './components/Cfunction';
import ico_board from 'assets/images/image/clipboard-list@3x.png';
import ico_gene from 'assets/images/image/gene@3x.png';
import ico_consulting from 'assets/images/image/consulting@3x.png';
import ico_product from 'assets/images/image/product@3x.png';
import ico_skin from 'assets/images/image/skins@3x.png';
import ico_doctor from 'assets/images/image/doctor@3x.png';
import ico_face from 'assets/images/image/face@3x.png';
import ico_info from 'assets/images/image/info@3x.png';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  hostInfoName as useHostInfoName,
  AddFunctionCheckList as useAddFunctionCheckList
} from 'store/ai';

export default function AddFunctions() {
  const navigate = useNavigate();
  const [selectedDialogueBot, setSelectedDialogueBot] = useState<FUNCTION_CHECK_LIST[]>([]);
  const [selectedInternalService, setSelectedInternalService] = useState<FUNCTION_CHECK_LIST[]>([]);
  const [selectedInternalSystem, setSelectedInternalSystem] = useState<FUNCTION_CHECK_LIST[]>([]);
  const [externalFunctionData, setExternalFunctionData] = useState<FUNCTION_CHECK_LIST[]>([]);
  const hostInfoName = useRecoilValue(useHostInfoName);
  const [AddFunctionCheckList, setAddFunctionCheckList] = useRecoilState(useAddFunctionCheckList);

  const handleBacktoChatBuilder = () => {
    navigate(`/chatbuilder/${hostInfoName}`);
  };

  useEffect(() => {
    if (AddFunctionCheckList.length > 0) {
      const dialogueBotItems = AddFunctionCheckList.filter(item => item.category === 'Dialog');
      setSelectedDialogueBot(dialogueBotItems);
      
      const internalServiceItems = AddFunctionCheckList.filter(item => item.category === '내부서비스');
      setSelectedInternalService(internalServiceItems);
      
      const internalSystemItems = AddFunctionCheckList.filter(item => item.category === '내부시스템');
      setSelectedInternalSystem(internalSystemItems);
      
      const externalFunctionItems = AddFunctionCheckList.filter(item => item.category === '외부기능');
      setExternalFunctionData(externalFunctionItems);
    }
  }, []);

  const handleSaveFunctions = () => {
    const combinedFunctionList = [
      ...selectedDialogueBot,
      ...selectedInternalService,
      ...selectedInternalSystem,
      ...externalFunctionData,
    ];
    setAddFunctionCheckList(combinedFunctionList);

    navigate(`/chatbuilder/${hostInfoName}`);
    console.log('navigate clear');
  };

  const handleDialogueBotClick = (bot: { name: string; category: string; id: number; title: string; source?:string; text?:string; img?:string; }) => {
    const index = selectedDialogueBot.findIndex((item) => item.name === bot.name);
    if (index > -1) {
      setSelectedDialogueBot(selectedDialogueBot.filter((item) => item.id !== bot.id));
    } else {
      setSelectedDialogueBot([...selectedDialogueBot, bot]);
    }
  };
  const handleInternalServiceClick = (bot: { name: string; category: string; id: number; title: string; source?:string; text?:string; img?:string; }) => {
    const index = selectedInternalService.findIndex((item) => item.id === bot.id);
    if (index > -1) {
      setSelectedInternalService(selectedInternalService.filter((item) => item.id !== bot.id));
    } else {
      setSelectedInternalService([...selectedInternalService, bot]);
    }
  };
  const handleInternalSystemClick = (bot: { name: string; category: string; id: number; title: string; source?:string; text?:string; img?:string; }) => {
    const index = selectedInternalSystem.findIndex((item) => item.id === bot.id);
    if (index > -1) {
      setSelectedInternalSystem(selectedInternalSystem.filter((item) => item.id !== bot.id));
    } else {
      setSelectedInternalSystem([...selectedInternalSystem, bot]);
    }
  };
  const handleExternalFunctionClick =(bot: { name: string; category: string; id: number; title: string; source?:string; text?:string; img?:string; }) => {
    const index = externalFunctionData.findIndex((item) => item.id === bot.id);
    if (index > -1) {
      setExternalFunctionData(externalFunctionData.filter((item) => item.id !== bot.id));
    } else {
      setExternalFunctionData([...externalFunctionData, bot]);
    }
  };

  const ExternalFunctionData = [
    {
      img: ico_weather,
      title: '날씨 알림',
      name: 'weather',
      source: 'By 기능의 출처.com',
      text: '기능에 대한 설명이 들어갑니다.',
      category: '외부기능',
      id: 1
    },
    {
      img: ico_time,
      title: '시계',
      name: 'time',
      source: 'By 기능의 출처.com',
      text: '기능에 대한 설명이 들어갑니다.',
      category: '외부기능',
      id: 2
    },
    {
      img: ico_alarm,
      title: '리마인더',
      name: 'alarm',
      source: 'By 기능의 출처.com',
      text: '기능에 대한 설명이 들어갑니다.',
      category: '외부기능',
      id: 3
    },
  ];
  const InternalServiceFunctionData = [
    {
      img: ico_doctor,
      title: '닥터',
      source: 'Corp',
      text: 'AI 피부 진단 시스템',
      name: 'doctor',
      category: '내부서비스',
      id: 7
    },
  ];

  const DialogueBotData = [
    { img: ico_gene, title: '유전자 검사', name: 'gene', category: 'Dialog',   id: 9  },
    { img: ico_consulting, title: '상담', name: 'consulting' , category: 'Dialog', id:10},
    { img: ico_product, title: '제품 추천', name: 'product', category: 'Dialog' , id:11},
    { img: ico_skin, title: '피부 정보 문답', name: 'skin' , category: 'Dialog', id:12},
  ];

  return (
    <div className='flex flex-row w-full h-full '>
      {/* content */}
      <div className='flex flex-col items-start justify-center w-full h-full bg-slate-100'>
        <div className='flex flex-col items-center justify-center w-full px-20'>
          <div className='flex justify-between w-full h-[54px] mt-10'>
            <div className='ml-4'>
              <button className='flex flex-row h-[54px] item-center justify-center' onClick={handleBacktoChatBuilder}>
                <img src={ico_chevron_left} alt='backtochat' className='w-6 h-7 item-center justify-center' />
                <span className='font-bold text-xl hover:underline cursor-pointer'>Chat builder</span>
              </button>
            </div>
            <button
              className='flex items-center justify-center font-bold w-20 h-8 rounded-md text-white bg-primary-default'
              onClick={handleSaveFunctions}
            >
              <span>Save</span>
            </button>
          </div>

          <div className='overflow-y-auto px-20'>
            <div className='mt-10 ml-10 mb-10'>
              <div className='text-2xl font-bold mb-8'>Dialogue Bot</div>
              <div className='flex flex-wrap gap-10'>
                {DialogueBotData.map((card, index) => (
                  <Cfunction
                    key={`dialog_${index}`}
                    imageUrl={card.img}
                    altText='chat room'
                    title={card.title}
                    imgClassName='h-[50%] w-[50%] object-fit self-center'
                    onClick={() => handleDialogueBotClick(card)}
                    isSelected={selectedDialogueBot.some(item => item.id === card.id)}  
                  />
                ))}
              </div>
            </div>
            <div className='ml-10 mb-5'>
              <div className='text-2xl font-bold mb-8'>내부 기능</div>
              <div className='mt-5'>
                <div className='mb-4'>서비스</div>
                <div className='flex flex-wrap gap-10'>
                  {InternalServiceFunctionData.map((card, index) => (
                    <Cfunction
                      key={`internalservice_${index}`}
                      imageUrl={card.img}
                      altText='chat room'
                      title={card.title}
                      text={card.text}
                      source={card.source}
                      imgClassName='h-[50%] w-[50%] object-fit self-center'
                      onClick={() => handleInternalServiceClick(card)}
                      isSelected={selectedInternalService.some(item => item.id === card.id)}  

                    />
                  ))}
                </div>
              </div>
            </div>
            <div className='ml-10 mb-5 mt-5'>
              <div className='text-2xl font-bold mb-8'>외부 기능</div>
              <div className='mt-5 flex flex-wrap gap-10'>
                {ExternalFunctionData.map((card, index) => (
                  <Cfunction
                    key={`external_${index}`}
                    imageUrl={card.img}
                    altText='chat room'
                    title={card.title}
                    text={card.text}
                    source={card.source}
                    onClick={() => handleExternalFunctionClick(card)}
                    isSelected={externalFunctionData.some(item => item.id === card.id)}  
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
