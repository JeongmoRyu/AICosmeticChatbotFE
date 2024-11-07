import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { useDeviceChecker } from './useDeviceChecker';

export const useTransition = () => {
  const navigate = useNavigate();
  const deviceInfo = useDeviceChecker();

  const transNavigate = (url: string | number, obj?: any) => {
    // console.log('transNavigate');
    // console.log(obj);
    if (deviceInfo.device !== 'w' && deviceInfo.device !== 'm') {
      if (typeof url === 'string') {
        if (obj) {
          navigate(url, obj);
        } else {
          navigate(url as string);
        }
      }
    } else {
      document.startViewTransition(() => {
        if (typeof url === 'string') {
          navigate(url, obj && obj);
        } else {
          navigate(-1);
        }
      });
    }
  };

  const transSetState = (func) => {
    if (deviceInfo.device !== 'w' && deviceInfo.device !== 'm') {
      flushSync(func());
    } else {
      document.startViewTransition(() => flushSync(func()));
    }
  };

  return { transNavigate, transSetState };
};
