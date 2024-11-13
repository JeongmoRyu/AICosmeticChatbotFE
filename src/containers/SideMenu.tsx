import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import { userInfoState as useUserInfoStore } from 'store/userInfo';
import { deviceState as useDeviceState, menuStyle as useMenuStyle } from 'store/responsive';

// image
import logo from 'assets/images/logos/logo_symbol_new.svg';
import ico_menu from 'assets/images/icons/ico_menu.svg';
import ico_menu_close from 'assets/images/icons/ico_menu_close.svg';
import ico_chat from 'assets/images/icons/ico_chat.svg';
import ico_faq from 'assets/images/icons/ico_faq.svg';
import ico_feedback from 'assets/images/icons/ico_feedback.svg';
import ico_expand from 'assets/images/icons/ico_expand.svg';
import ico_proai from 'assets/images/icons/ico_pro_ai.svg';

import { HOME } from 'data/routers';
import { GNB } from 'data/gnb';

type menuStyleType = 'MOBILE' | 'PC';
type deviceStateType = 'DESKTOP' | 'TABLET';

export default function SideMenu() {
  const { i18n } = useTranslation(['ai_chat']);

  const navigate = useNavigate();
  const location = useLocation();

  const setDeviceState = useSetRecoilState<deviceStateType>(useDeviceState);
  const [menuStyle, setMenuStyle] = useRecoilState<menuStyleType>(useMenuStyle);

  const userInfoState = useRecoilValue(useUserInfoStore);

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
            window.open('http://wiki-digit.amorepacific.com:8090/pages/viewpage.action?pageId=189578741', '_blank');
          } else {
            window.open('http://wiki-digit.amorepacific.com:8090/x/l9AUDg', '_blank');
          }
          break;
        case 'helpdesk':
          if (i18n.resolvedLanguage === 'ko') {
            window.open(
              'https://ithelpdesk.amorepacific.com/hc/ko/requests/new?ticket_form_id=4411395228185&ts=AP%20ChatGPT',
              '_blank',
            );
          } else {
            window.open(
              'https://ithelpdesk.amorepacific.com/hc/en-us/requests/new?ticket_form_id=4411395228185&ts=AP%20ChatGPT',
              '_blank',
            );
          }
          break;
      }
    }
  };

  const goChatbot = () => {
    setLocationStyle('proai');
    navigate(HOME);
  };

  const handleClickLogo = (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    window.location.href = 'https://maum.ai/';
  };

  return (
    <div id='channel' className='active'>
      <div className='channel-logo'>
        <button name='logo'>
        {/* <button name='logo' onClick={handleClickLogo}> */}
          <img src={logo} alt='maum.ai' />
        </button>
      </div>
      <div className='flex flex-col justify-between h-full pb-10'>
        {/* <div>
          <ul className='channel-nav'>
            {GNB &&
              GNB.map((item) => (
                <li key={item.pathname}>
                  <span data-path={item.path} className={`${item.class} ${item.path === 'maumChatbot' && 'active'}`}>
                    {item.name}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className='channel-nav'>
          <span data-path={'contactUs'} className='contact'>
            {'Contact Us'}
          </span>
        </div> */}
      </div>
    </div>
  );
}
