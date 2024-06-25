import { toast, ToastOptions, Bounce } from 'react-toastify';
import ToastUI, { ToastType } from 'components/ToastUI';

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  transition: Bounce,
  rtl: false,
  closeButton: true,
};

export const showNotification = (message: string, type: ToastType) => {
  console.log(message);
  toast(<ToastUI message={message} type={type} />, toastOptions);
};
