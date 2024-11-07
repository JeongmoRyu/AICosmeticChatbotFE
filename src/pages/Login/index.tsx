import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showNotification } from 'utils/common-helper';
import {
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
  hostInfoName as useHostInfoName,
  chatbotIdState as useChatbotIdState,
} from 'store/pro-ai';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTempLoginServerAxiosHooks } from 'hooks/useTempLoginServerAxiosHooks';
import { sha512 } from 'js-sha512';
import { sha256 } from 'js-sha256';
import { HOME, LOGIN } from 'data/routers';
import { CONNECTING_INFO } from 'data/hostInfo';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

const Login = () => {
  const navigate = useNavigate();
  const [textError, setTextError] = useState<string | null>(null);
  const setUserLoginState = useSetRecoilState(useUserLoginState);
  const setUserAuthority = useSetRecoilState(useUserAuthority);
  const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  const hostInfoName = useRecoilValue(useHostInfoName);
  const { sendRequest } = useTempLoginServerAxiosHooks();
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ILoginData>();

  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHost = hostname !== 'localhost' ? (port ? `${hostname}:${port}` : hostname) : window.location.hostname;
    console.log('fullHost : ', fullHost);

    if (fullHost) {
      const connectionInfo = CONNECTING_INFO[fullHost];
      setConnectionInfoState((prev) => ({
        ...prev,
        restful: connectionInfo.restful,
        socket: connectionInfo.socket,
      }));
      if (!connectionInfoState.restful) {
        navigate(LOGIN);
      }
    }
  }, []);

  const fetchEmailLogin = async (params, textString) => {
    const APICall = '/login/email4Sync';
    const text = textString.toLowerCase();
    const response = await sendRequest(
      APICall,
      'post',
      undefined,
      {
        email: params.username,
        password256: sha256(params.password),
        password512: sha512(params.password),
      },
      true,
    );
    if (response && response.status === 200 && response.data) {
      console.log('login response: ', response);
      if (response.data.result || response.data.result === 'ok') {
        if (response.data.data.access_token) {
          const data = response.data.data;
          console.log(`%c AccessToken: ${data.access_token}`, 'color:red');
          console.log(`%c Name: ${data.name}`, 'color:red');
          setUserLoginState((prev) => ({
            ...prev,
            userId: data.user_id,
            email: data.email,
            name: data.name,
            mobile: data.mobile,
            company_name: data.company_name,
            company_id: data.company_id,
            is_company_admin: data.is_company_admin,
            is_company_super_admin: data.is_company_super_admin,
            status: data.status,
            marketing_agreement_type: data.marketing_agreement_type,
            expiredDate: data.expiredDate,
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            joinType: data.join_type,
            userType: data.user_type,
            company_registration_number: data.company_registration_number,
            default_chatbot_id: data.default_chatbot_id,
            user_key: data.user_key,
          }));

          if (data.access_token && data.is_company_super_admin) {
            setUserAuthority('admin');
          } else if (data.access_token && data.is_company_admin) {
            setUserAuthority('editor');
          }

          setChatbotIdState(data.default_chatbot_id);
          navigate(HOME);
        }
      } else {
        showNotification(response.data.message, 'error');
        return;
      }
    }
  };

  const onSubmit = (data: { username: string; password: string }) => {
    setTextError(null);
    const params = { username: data.username, password: data.password };
    console.log(params);
    fetchEmailLogin(params, hostInfoName);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[url('/images/bg_login.png')] bg-no-repeat bg-cover">
      <div className='flex z-10 w-11/12 max-w-[1100px] h-5/6 max-h-[600px] bg-white rounded-2xl overflow-auto shadow-lg'>
        <div className='float-left w-full h-full'>
          <img src='/images/mStudio_logo.png' alt='logo' className='w-full h-full object-cover' />
        </div>

        <div className='float-left w-full md:w-[calc(100%-500px)] h-full p-5 box-border'>
          <form onSubmit={handleSubmit(onSubmit)} className='max-w-[350px] mx-auto'>
            <h2 className='mb-12 pt-20 text-3xl font-bold text-primary-darkblue'>Login</h2>
            <label htmlFor='username' className='block mt-5 pb-1.5 text-lg font-medium'>
              ID
            </label>
            <input
              {...register('username')}
              id='username'
              type='text'
              className='w-full h-12 px-3 py-1.5 border border-bgContent rounded-lg bg-white font-medium'
            />
            <label htmlFor='password' className='block mt-5 pb-1.5 text-lg font-medium'>
              Password
            </label>
            <input
              {...register('password')}
              id='password'
              type='password'
              className='w-full h-12 px-3 py-1.5 border border-bgContent rounded-lg bg-white font-medium'
            />
            <p className='h-11 pt-2 text-error box-border'>{errors.password?.message || textError}</p>
            <button
              type='submit'
              className='w-full h-12 mt-5 bg-primary-darkblue rounded-lg text-lg font-bold text-white hover:underline'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
