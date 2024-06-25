import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useResetRecoilState, useRecoilValue } from 'recoil';

import { userInfoState as useUserInfoStore } from 'store/userInfo';
import { deviceState } from 'store/responsive.ts';
import { HOME, SIGN_OUT, CHATROOM, CHATBUILDER, ADDFUNCTIONS } from 'data/routers';

import logo from 'assets/images/logo/logo.svg';
import ico_close from 'assets/images/image/close.png'
import logoutImg from 'assets/images/icons/ico_logout.svg';
import ico_user from 'assets/images/icons/ico_user_b.svg';
import { setNssoConfiguration, getNssoUserAttributeList, getNssoUserAttribute } from "script/nsso";
import { hostInfoName as useHostInfoName } from 'store/ai';

export default function HeaderBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState<string>('');
  const userInfoState = useRecoilValue(useUserInfoStore);
  const resetUserInfoState = useResetRecoilState(useUserInfoStore);
  const currentDeviceState = useRecoilValue(deviceState);
  const hostInfoName = useRecoilValue(useHostInfoName);

  useEffect(() => {
    if (location) {
      const pathname = location.pathname;
      if (pathname) {
        switch (pathname) {
          case HOME:
            setTitle('AI');
            break;
          case CHATROOM:
            setTitle('CHATROOM');
            break;
          case CHATBUILDER:
            setTitle('CHATBUILDER');
            break;
          case ADDFUNCTIONS:
            setTitle('ADDFUNCTIONS');
            break;
        }
      }
    }
  }, [location]);

  const logout = () => {
    resetUserInfoState();
    navigate(SIGN_OUT);
  };

  const handleClickSSOAuth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('*** Call setNssoConfiguration ***');
    setNssoConfiguration(
      'ssourl',
      callbackLogonFail,
      callbackLogonSuccess,
      callbackReceiveTfa,
      callbackReceiveDuplication,
      callbackSsoUnavailable
    )
  }
  const handleClickAllAt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(getNssoUserAttributeList())
  }
  const handleClickUserAt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const orgcode = getNssoUserAttribute('orgcode');
    const companycode = getNssoUserAttribute('companycode');
    const email = getNssoUserAttribute('email');
    const name = getNssoUserAttribute('name');
    const pwddt = getNssoUserAttribute('pwddt');

    console.log(orgcode);
    console.log(companycode);
    console.log(email);
    console.log(name);
    console.log(pwddt);
  }

  function callbackLogonFail() {
    console.log("로그인 실패")
  }

  function callbackLogonSuccess() {
    console.log("로그인 성공")
  }

  function callbackReceiveTfa() {
    console.log("2차 인증 필요")
  }

  function callbackReceiveDuplication() {
    console.log("중복 로그인")
  }

  function callbackSsoUnavailable() {
    console.log("SSO 서비스 장애")
  }

  return (
    <div className={'flex flex-row h-16 w-full items-center border border-b-slate-300 z-50'}>
      <div className={`flex w-72 justify-center items-center m-1 ${currentDeviceState === 'TABLET' ? 'hidden' : ''}`}>
        <Link to={`/${hostInfoName}`}>
          <img src={ico_close} alt='logo' />
        </Link>
      </div>
      <div className='h-10 border border-r-slate-300'></div>
      <div className='flex w-full flex-row items-center justify-between m-8'>
        <div className='text-xl font-bold text-gray-500'>{title}</div>
        <div className='flex flex-row justify-center items-center'>
          <button className="mr-2" onClick={handleClickSSOAuth}>          
            SetSSO
          </button>
          <button className="mr-2" onClick={handleClickAllAt}>          
            AllAt
          </button>
          <button className="mr-5" onClick={handleClickUserAt}>          
            UserAt
          </button>
          <img className='ml-3' src={ico_user} alt='user' />
          <p className='m-3'>{userInfoState.user_id}</p>
          <div
            className='flex flex-row px-4 py-3 rounded-lg hover:cursor-pointer hover:bg-secondary-hover'
            onClick={logout}
          >
            <img src={logoutImg} alt='logout' />
            <p className='ml-2'>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
}
