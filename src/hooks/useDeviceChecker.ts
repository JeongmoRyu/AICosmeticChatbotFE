import { useEffect, useState } from 'react';

interface DeviceInfo {
  device: string;
  browser: string;
}

export const useDeviceChecker = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    device: '',
    browser: '',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;

    let device = '';
    if (/Android/i.test(userAgent)) {
      device = 'a';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      device = 'i';
    } else if (/Windows NT/i.test(userAgent)) {
      device = 'w';
    } else if (/Mac OS X/i.test(userAgent)) {
      device = 'm';
    }

    let browser = '';
    if (/Chrome/i.test(userAgent)) {
      browser = 'c';
    } else if (/Safari/i.test(userAgent)) {
      browser = 's';
    } else if (/Firefox/i.test(userAgent)) {
      browser = 'f';
    } else if (/Edg\//i.test(userAgent)) {
      browser = 'e';
    }

    setDeviceInfo({ device, browser });
  }, []);

  return deviceInfo;
};
