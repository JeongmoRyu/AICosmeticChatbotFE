import { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import { userLoginState as useUserLoginState } from 'store/ai';

type HeaderType = {
  'Content-Type'?: string;
};

export const useProAIRestfulCustomAxios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const userLoginState = useRecoilValue(useUserLoginState);

  const restfulHeader = {
    'Content-Type': 'application/json',
    //"Access-Control-Allow-Origin": '*',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  const sendRequestProAI = (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: unknown,
    params?: any,
  ): Promise<any> => {
    //const baseURL = import.meta.env.VITE_APP_RESTFUL_URL;
    const baseURL = connectionInfoState.restful;
    setIsLoading(true);

    let config;

    if (method === 'get' || method === 'delete') {
      config = { method, url: baseURL + url, params, headers };
    } else {
      config = { method, url: baseURL + url, data, headers };
    }

    console.log(config);

    const responseData = axios(config)
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          setError(err.message);
          if (err.response) {
            console.log(err.message);
          }
        }
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return responseData;
  };

  const clearError = () => setError(null);

  return { isLoading, error, sendRequestProAI, clearError };
};
