import React, { PropsWithChildren, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import amore_close from 'assets/images/image/amore_close.png';

interface ModalProps {
  isShow: boolean;
  title?: string | ReactElement;
  width?: number;
  onClose?: (e?: React.MouseEvent<HTMLElement>) => void;
  okButtonText?: string;
  okButtonDisabled?: boolean;
  okButtonClick?: () => void;
  cancelButtonText?: string;
  cancleButtonClick?: () => void;
}

export default function Modal({
  isShow,
  title,
  width,
  onClose,
  okButtonText,
  okButtonDisabled,
  okButtonClick,
  cancelButtonText,
  cancleButtonClick,
  children,
}: ModalProps & PropsWithChildren) {
  if (!isShow) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className='modal_wrap'>
      <div className='modal_inner' style={{ width: width ? `${width}px` : 'fit-content' }}>
        {typeof title === 'string' ? (
          <div className='modal_head'>
            <strong>{title}</strong>
            <button type='button' className='btn_modal_close' onClick={onClose}>
              <img src={amore_close} alt='닫기' />
            </button>
          </div>
        ) : (
          title
        )}
        <div className='modal_content'>{children}</div>
        {(okButtonText || cancelButtonText) && (
          <div className='modal_foot'>
            {cancelButtonText && (
              <button type='button' className='btn_type white' onClick={cancleButtonClick}>
                {cancelButtonText}
              </button>
            )}
            {okButtonText && (
              <button type='button' className='btn_type blue' onClick={okButtonClick} disabled={okButtonDisabled}>
                {okButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal') as Element,
  );
}
