import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetRecoilState, useRecoilValue } from 'recoil';

import { userInfoState as useUserInfoStore } from 'store/userInfo';
import { userLoginState as useUserLoginState } from 'store/pro-ai';
import { HOME, SIGN_OUT, CHATROOM, CHATBUILDER, FUNCTIONS, LOGIN, ACCOUNT_ADMIN, EMBEDDING_RANKER, EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';

// import LangSelect from 'components/base/LangSelect';
import UserNav from 'components/base/UserNav';

export default function HeaderBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState<string>('');
  const resetUserInfoState = useResetRecoilState(useUserInfoStore);
  const userLoginState = useRecoilValue(useUserLoginState);
  const resetUserLoginState = useResetRecoilState(useUserLoginState);
  const [loginstate, setLoginstate] = useState<boolean>(true);

  const handleLogin = () => {
    if (!userLoginState.accessToken) {
      navigate(LOGIN);
    } else {
      resetUserInfoState();
      resetUserLoginState();
      navigate(SIGN_OUT);
    }
  };

  useEffect(() => {
    if (location) {
      const pathname = location.pathname;
      if (pathname) {
        switch (pathname) {
          case HOME:
            setTitle('Chathub');
            break;
          case CHATROOM:
            setTitle('Chat Room');
            break;
          case CHATBUILDER:
            setTitle('Chat Builder');
            break;
          case FUNCTIONS:
            setTitle('Functions');
            break;
          case ACCOUNT_ADMIN:
            setTitle('Admin');
            break;
          case EMBEDDING_RANKER:
            setTitle('Embedding Ranker');
            break;
          case EMBEDDING_HISTORY:
            setTitle('Embedding History');
            break;
          case EMBEDDING_LEADERBOARD:
            setTitle('Embedding Leaderboard');
            break;
        }
      }
    }
    if (userLoginState.accessToken) {
      setLoginstate(true);
    } else {
      setLoginstate(false);
      navigate(LOGIN);
    }
  }, [location, userLoginState]);

  return (
    <div className='header-wrap'>
      <div className='float-left flex items-center h-16 pl-4 bg-[url(assets/images/icons/ico_navi_Home.svg)] bg-no-repeat bg-[center_left] z-[12]'>
        <div className='bc'>
          <span className='text-gray text-sm'>Onpromise &gt;</span>
          {/* <span className='text-gray text-sm'>maum Chatbot &gt;</span> */}
          <span className='text-gray text-sm font-bold'>{title}</span>
        </div>
      </div>
      <header>
        <div className='flex flex-1 justify-end'>
          {/* <LangSelect isShow={false} /> */}
          <UserNav isShow={false} />
          <button
            onClick={handleLogin}
            className='flex items-center justify-center ml-2.5 px-4 py-2 border border-transparent rounded font-medium transition-all duration-300 hover:border-bgContent hover:bg-primary1-light'
          >
            <img src='/images/icon_logout.svg' alt='' className='mr-2 align-middle' />
            {loginstate ? '로그아웃' : '로그인'}
          </button>
        </div>
      </header>
    </div>
  );
}
