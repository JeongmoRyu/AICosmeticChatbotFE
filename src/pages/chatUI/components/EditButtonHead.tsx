interface Props {
  title: string;
  btnText: string;
  onClick: () => void;
  icon?: string;
}

export default function EditButtonHead({ title, btnText, onClick, icon }: Props) {
  return (
    <div className='button_head_wrap'>
      <span className='txt_label'>{title}</span>
      <button type='button' className='btn_type white' onClick={onClick}>
        {icon && <img src={icon} alt='' />}
        {btnText}
      </button>
    </div>
  );
}
