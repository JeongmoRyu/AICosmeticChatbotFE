import React, { PropsWithChildren, ReactElement, createElement } from 'react';
import ReactDOM from 'react-dom';

interface ModalSubProps {
  className?: string;
  title?: string;
}

interface ModalProps {
  isShow: boolean;
  // type: 'info' | 'success' | 'warning' | 'danger';
  // title?: string;
  // content: string | ReactElement | ReactElement[];
  footer?: string | ReactElement | ReactElement[];
  icon?: boolean;
  centered?: boolean;
  closeBtn?: boolean;
  className?: string;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void,   
}

function ModalHeader(props: ModalSubProps & PropsWithChildren) {
  return createElement(
    "div",
    {
      className: `modal-header ${props.className}`,
      title: props.title
    },
    props.children
  );
}

function ModalBody(props: ModalSubProps & PropsWithChildren) {
  return createElement(
    "div",
    {
      className: `modal-body ${props.className}`,
    },
    props.children
  );
}

function ModalFooter(props: ModalSubProps & PropsWithChildren) {
  return createElement(
    "div",
    {
      className: `modal-footer ${props.className}`,
    },
    props.children
  );
}

function Modal(props: ModalProps & PropsWithChildren) {
  return ReactDOM.createPortal(
    <div className={`modal overflow-y-auto ${props.className} ${props.isShow ? 'show' :''} ${props.centered ? 'centered' : '' }`}>
      <div className='w-full modal-dialog'>
        <div className='w-full modal-content'>
          {props.children}
        </div>
      </div>
    </div>,
    document.getElementById('modal') as Element
  )
}

export { Modal, ModalHeader, ModalBody, ModalFooter };