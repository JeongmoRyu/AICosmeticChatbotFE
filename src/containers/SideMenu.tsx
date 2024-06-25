import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { hostInfoName as useHostInfoName } from 'store/ai';
import { userInfoState as useUserInfoStore } from 'store/userInfo';
import { deviceState as useDeviceState, menuStyle as useMenuStyle } from 'store/responsive';

// image
import ico_menu from 'assets/images/icons/ico_menu.svg';
import ico_menu_close from 'assets/images/icons/ico_menu_close.svg';
import ico_chat from 'assets/images/icons/ico_chat.svg';
import ico_faq from 'assets/images/icons/ico_faq.svg';
import ico_feedback from 'assets/images/icons/ico_feedback.svg';
import ico_expand from 'assets/images/icons/ico_expand.svg';
import ico_proai from 'assets/images/icons/ico_pro_ai.svg';

import { HOME } from 'data/routers';

type menuStyleType = 'MOBILE' | 'PC';
type deviceStateType = 'DESKTOP' | 'TABLET';

export default function SideMenu() {
  const { i18n } = useTranslation(['ai_chat']);

  const navigate = useNavigate();
  const location = useLocation();

  const setDeviceState = useSetRecoilState<deviceStateType>(useDeviceState);
  const [menuStyle, setMenuStyle] = useRecoilState<menuStyleType>(useMenuStyle);

  const userInfoState = useRecoilValue(useUserInfoStore);
  const hostInfoName = useRecoilValue(useHostInfoName);

  const [locationStyle, setLocationStyle] = useState<string>('');

  useEffect(() => {
    if (userInfoState && userInfoState.session_id && userInfoState.user_id) {
      if (userInfoState.user_locale === 'CN') {
        setLocationStyle('service');
      } else {
        setLocationStyle('chat');
      }
    }
  }, [userInfoState]);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === HOME) {
      setLocationStyle('proai');
    }
  }, [location]);

  const getDeviceState = () => {
    if (window.innerWidth > 1280) {
      setDeviceState('DESKTOP');
      setMenuStyle('PC');
    } else {
      setDeviceState('TABLET');
      setMenuStyle('MOBILE');
    }
  };

  useEffect(() => {
    getDeviceState();
    window.addEventListener('resize', getDeviceState);
  }, [locationStyle]);

  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = e.currentTarget.name;
    if (name) {
      switch (name) {
        case 'open':
          setMenuStyle('PC');
          break;
        case 'close':
          setMenuStyle('MOBILE');
          break;
      }
    }
  };

  const handleClickQuickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = e.currentTarget.name;
    if (name) {
      switch (name) {
        case 'faq':
          if (i18n.resolvedLanguage === 'ko') {
            console.log('.', '_blank');
          } else {
            console.log('.', '_blank');
          }
          break;
        case 'helpdesk':
          if (i18n.resolvedLanguage === 'ko') {

            console.log(
              '.',
              '_blank',
            );
          } else {
            console.log(
              '.',
              '_blank',
            );
          }
          break;
      }
    }
  };

  const goChatbot = () => {
    setLocationStyle('proai');
    navigate(`/${hostInfoName}`);
  };

  return (
    <div className='relative h-screen'>
      {/* 작게 */}
      <div className={`mobile-menu ${menuStyle !== 'MOBILE' && 'hidden'}`}>
        <nav className='flex flex-row side-nav--simple w-20'>
          <div className='w-[60px] h-full'>
            <div className='flex justify-end items-center h-16 mr-2.5'>
              <button name='open' type='button' onClick={handleClickMenu}>
                <img src={ico_menu} alt='menu' />
              </button>
            </div>
            <div className='h-[24px]'></div>
            {userInfoState.user_locale !== 'CN' && (
              <>
                <div
                  className='flex flex-row items-center hover:cursor-pointer h-12 ml-3 bg-white rounded-l-full'
                  onClick={goChatbot}
                >
                  <img className='mx-3' src={ico_chat} alt='chat' />
                  <div className='absolute left-[70px] top-[92px] hidden group-hover:block'>
                    <div className='w-20 flex justify-center items-center bg-black text-white p-2 rounded-lg text-sm'>
                      AI
                    </div>
                  </div>
                </div>
                <div className='h-[10px]'></div>
              </>
            )}
          </div>

          <div className='w-[20px] h-full'>
            <div className='h-14'></div>
            {userInfoState.user_locale !== 'CN' ? (
              <div className='w-full h-8 bg-white'>
                <div className='w-full h-8 bg-primary-default rounded-br-full'></div>
              </div>
            ) : (
              <div className='w-full h-8 bg-white'>
                <div
                  className={`w-full h-8 bg-primary-default ${locationStyle === 'service' ? 'rounded-br-full' : ''}`}
                ></div>
              </div>
            )}
            {userInfoState.user_locale !== 'CN' && (
              <>
                <div className='bg-white h-12'></div>
                <div className='h-8 bg-white'>
                  <div
                    className={`h-8 bg-primary-default ${
                      locationStyle !== 'chat' ? 'rounded-tr-3xl' : 'rounded-tr-full'
                    }`}
                  ></div>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* 크게 */}
      <div className={`pc-menu ${menuStyle !== 'PC' && 'hidden'}`}>
        <nav className='side-nav'>
          <div className='flex flex-row w-full h-full'>
            <div className='w-[180px] h-full'>
              {/* 메뉴 아이콘 */}
              <div className='flex items-center justify-end h-16  mr-[10px]'>
                <button name='close' type='button' onClick={handleClickMenu}>
                  <img src={ico_menu_close} alt='menu' />
                </button>
              </div>
              <div className='h-[24px]'></div>
              {/* AI Chat */}
              {userInfoState.user_locale !== 'CN' && (
                <>
                  <div
                    className='flex flex-row items-center hover:cursor-pointer h-12 ml-5 bg-white rounded-l-full'
                    onClick={goChatbot}
                  >
                    <img className='mx-3' src={ico_proai} alt='chat' />
                    <p className='text-black'>AI</p>
                  </div>
                  <div className='h-[10px]'></div>
                </>
              )}
            </div>

            <div className='w-[20px] h-full'>
              <div className='h-16'></div>
              {userInfoState.user_locale !== 'CN' ? (
                <div className='h-6 bg-white'>
                  <div className='h-6 bg-primary-default rounded-br-full'></div>
                </div>
              ) : (
                <div className='h-6 bg-white'>
                  <div
                    className={`h-6 bg-primary-default ${locationStyle === 'service' ? 'rounded-br-full' : ''}`}
                  ></div>
                </div>
              )}
              {userInfoState.user_locale !== 'CN' && (
                <>
                  <div className='bg-white h-12'></div>
                  <div className='h-8 bg-white'>
                    <div className='h-8 bg-primary-default rounded-tr-full'></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className='absolute w-full flex flex-row justify-center bottom-20 px-4'>
        <div className={`flex flex-col w-full ${menuStyle !== 'PC' && 'hidden'}`}>
          <button
            type='button'
            name='faq'
            className='w-[170px] flex flex-row items-center justify-between h-12 px-3 hover:bg-primary-hover hover:rounded-full'
            onClick={handleClickQuickMenu}
          >
            <div className='flex flex-row'>
              <img className='mr-2' src={ico_faq} alt='FAQ' />
              <p className='text-white font-medium'>FAQ</p>
            </div>
            <img src={ico_expand} alt='tool' />
          </button>
          <button
            type='button'
            name='helpdesk'
            className='w-[170px] flex flex-row items-center justify-between mt-4 h-12 px-3 hover:bg-primary-hover hover:rounded-full'
            onClick={handleClickQuickMenu}
          >
            <div className='flex flex-row'>
              <img className='mr-2' src={ico_feedback} alt='Helpdesk' />
              <p className='text-white font-medium'>IT Helpdesk</p>
            </div>
            <img src={ico_expand} alt='tool' />
          </button>
        </div>
        <div className={`flex flex-col w-full ${menuStyle !== 'MOBILE' && 'hidden'}`}>
          <button
            type='button'
            name='faq'
            className='relative w-12 flex flex-row justify-center items-center h-12 group hover:bg-primary-hover hover:rounded-full'
            onClick={handleClickQuickMenu}
          >
            <img src={ico_faq} alt='FAQ' />
            <div className='absolute left-14 bottom-2 hidden group-hover:block '>
              <div className='w-20 flex justify-center items-center bg-black text-white p-2 rounded-lg text-sm'>
                FAQ
              </div>
            </div>
          </button>
          <button
            type='button'
            name='helpdesk'
            className='relative w-12 flex flex-row justify-center items-center mt-4 h-12 group hover:bg-primary-hover hover:rounded-full'
            onClick={handleClickQuickMenu}
          >
            <img src={ico_feedback} alt='Helpdesk' />
            <div className='absolute left-14 bottom-2 hidden group-hover:block '>
              <div className='w-28 flex justify-center items-center bg-black text-white p-2 rounded-lg text-sm'>
                IT Helpdesk
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className='absolute w-full flex flex-row justify-center bottom-4 px-4'>
        <p className={`text-white ${menuStyle === 'PC' ? 'text-lg' : 'text-sm'}`}>{import.meta.env.VITE_APP_VERSION}</p>
      </div>
    </div>
  );
}
