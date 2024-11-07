import { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from "recoil";
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

type HeaderType = {
  'Content-Type'?: string;
  'Access-Control-Allow-Origin'?: string;
  authorization?: string;
  userId?: string;
};

export const useTempLoginServerAxiosHooks = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  const restfulHeader = {
    'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": '*',
  };

  const sendRequest = async (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: any,
    withCredentials?: boolean,
  ): Promise<any> => {
    
    // const baseURL = import.meta.env.VITE_APP_LOGIN_SERVER_URL;
    const baseURL = connectionInfoState.restful;

    setIsLoading(true);

    console.log('sendRequest URL:' + baseURL + url);
    console.log('restful URL:' + connectionInfoState.restful);
    console.log('socket URL:' + connectionInfoState.socket);

    const config = { method, url: baseURL + url, data, headers, withCredentials };
    const responseData = await axios(config)
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .catch((err) => {
        setError(err.message);
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return responseData;
  };

  const clearError = () => setError(null);

  return { isLoading, error, sendRequest, clearError };
};



// const fetchUserInfo = async (sessionId: string) => {
//   console.log('*** Session Id ***');
//   console.log(sessionId);

//   const params = {
//     session_id: sessionId,
//     user_id: userId
//   };

//   const response = await sendRequestToRest('/history/user', 'get', undefined, undefined, params);
//   console.log(response);
//   if(response && response.data && response.data.result) {
//     console.log(response.data.data);   
//     if(response.data.code !== 'S001') {

//       let userLocale = '';
//       let userLang = '';
//       const userId = response.data.data;
//       console.log(selectLang);
//       if(userId && typeof userId === 'string') {
//         if(userId === 'maum_admin_id') {
//           userLocale = 'AP';
//           userLang = 'KOR';            
//         } else {
//           userLocale = userId.substring(0, 2);
//           //userLocale = 'MA';
//           if(userLocale === 'AP') {
//             userLang = 'KOR';
//           } else {
//             userLang = 'ENG';
//           }            
//         }

//         if(!selectLang) {
//           if(userLang) {
//             setSelectLang(userLang)
//             i18n.changeLanguage(userLang); 
//           }
//         }

//         setUserInfoState((prev) => ({
//           ...prev,
//           user_id: response.data.data,
//           user_locale: userLocale
//         }));

//         if(userLocale === 'CN') {
//           navigate(AI_SERVICE);
//         }
//       }
//     } else {
//       showNotification(response.data.message, 'error');
//       resetUserInfoState();
//       navigate(SIGN_OUT);
//     }
//   } else {
//     showNotification('해당 세션에 로그인 정보가 존재하지 않습니다. 다시 접속해 주세요.', 'error');
//     resetUserInfoState();
//     navigate(SIGN_OUT);
//     return;
//   }
// };
