import logo from 'assets/images/logos/logo_symbol_new.svg';
import { LOGIN } from 'data/routers';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
  chatbotIdState as useChatbotIdState,
  initialUserLoginState,
  DEFAULT_CHATBOT_ID,
} from 'store/pro-ai';

export default function SignOut() {
  const navigate = useNavigate();
  const setUserLoginState = useSetRecoilState(useUserLoginState);
  const setUserAuthority = useSetRecoilState(useUserAuthority);
  const setChatbotIdState = useSetRecoilState(useChatbotIdState);

  const handleLoginClick = () => {
    setUserLoginState(initialUserLoginState);
    setUserAuthority('');
    setChatbotIdState(DEFAULT_CHATBOT_ID);
    navigate(LOGIN);
  };
  return (
    <div className='flex py-10 w-screen h-screen bg-[#f4f6f8] overflow-y-auto text-center'>
      <div className='w-fit h-fit m-auto'>
        <img className='w-96 pb-9' src={logo} alt='logo' />
        <div className='w-24 m-auto border-solid border border-slate-300 rounded-full'></div>
        <div className='text-3xl pt-9 pb-5 font-bold text-neutral-500'>Chathub</div>
        <div className='text-base text-neutral-500'>사용자 요청에 의해 로그아웃 되었습니다</div>
        <div className='text-base text-neutral-500'>
          사용을 원하실 경우{' '}
          <button onClick={handleLoginClick} className='text-blue-500 hover:underline'>
            Login
          </button>
          을 진행하시고 이용해주세요
        </div>
      </div>
    </div>
  );
}
