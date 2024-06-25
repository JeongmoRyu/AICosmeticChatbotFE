import MaumIcons from 'utils/icon-helper';
export type ToastType = 'info' | 'success' | 'error';

interface Props {
  type: ToastType;
  message: string;
}

function ToastUI(props: Props) {
  const alertIcon = (type: ToastType) => {
    switch (type) {
      case 'info':
        return <MaumIcons icon='Info' className='w-6 h-6 text-fontColor-info font-semibold' />;
      case 'success':
        return <MaumIcons icon='CheckCircle' className='w-6 h-6 text-fontColor-success font-semibold' />;
      case 'error':
        return <MaumIcons icon='AlertTriangle' className='w-6 h-6 text-fontColor-danger font-semibold' />;
      default:
        break;
    }
  };

  return (
    <div className='toastify-content flex'>
      {alertIcon(props.type)}
      <div className='ml-4 mr-4'>
        <div className='font-semibold'>{props.message}</div>
      </div>
    </div>
  );
}

export default ToastUI;
