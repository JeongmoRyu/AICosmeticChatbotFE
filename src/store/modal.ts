import { atom } from "recoil";

interface ModalType {
  type: string;
  isShow: boolean;
  data: object | ReviewOriginType;
}

const modalState = atom<ModalType>({
  key: "modalState",
  default: {
    type: '',
    isShow: false,
    data: {    
    }
  }
});

export { modalState };