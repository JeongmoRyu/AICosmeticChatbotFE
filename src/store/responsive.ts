import { atom } from 'recoil';

type menuStyleType = 'MOBILE' | 'PC';
type deviceStateType = 'DESKTOP' | 'TABLET';

const deviceState = atom<deviceStateType>({
  key: 'deviceState',
  default: 'DESKTOP',
});

const menuStyle = atom<menuStyleType>({
  key: 'menuStyle',
  default: 'PC',
});

export { deviceState, menuStyle };
