import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface BackdropProps {
  isShow: boolean;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
}

function Backdrop(props: BackdropProps) {
  useEffect(() => {
    if (!props.isShow) return;
    // 스크롤 방지 ON
    document.body.style.overflow = 'hidden';

    return () => {
      // 스크롤 방지 OFF
      document.body.style.overflow = 'unset';
    };
  }, [props.isShow]);

  return ReactDOM.createPortal(
    <div className={`${props.isShow ? `backdrop !block ${props.className}` : 'invisible-and-take-no-space'}`} onClick={props.onClick}></div>,
    document.getElementById('backdrop') as Element
  )
}

export default Backdrop;