import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';

import { userLoginState as useUserLoginState } from 'store/pro-ai';
import { showNotification } from 'utils/common-helper';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';

export const useFetchFileUpload = () => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const userLoginState = useRecoilValue(useUserLoginState);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  const multiFileUpload = (url: string, method: string, files?: FileType[]): Promise<any> => {
    // const baseURL = import.meta.env.VITE_APP_CHATPLAY_FRONT_URL;
    const baseURL = connectionInfoState.restful;

    setIsUpload(true);

    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userLoginState.accessToken}`,
    };

    const formData = new FormData();
    if (files) {
      files.forEach((file) => {
        if (file.file) {
          formData.append(`files`, file.file);
        }
      });
    }

    const config = { method, url: baseURL + url, data: formData, headers };
    const responseData = axios(config)
      .then((responseData) => {
        return responseData;
      })
      .catch((err) => {
        showNotification(err.message, 'error');
      })
      .finally(() => {
        setIsUpload(false);
      });

    return responseData;
  };

  const clearError = () => setError(null);

  const clearFiles = () => {
    setFiles([]);
  };

  return { isUpload, error, multiFileUpload, clearError, clearFiles };
};
