import { TextareaHTMLAttributes, useEffect, useRef } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelText?: string;
  placeholder?: string;
  isLengthVisible?: boolean;
}

const EditTextarea = ({ id, value, onChange, labelText, placeholder, isLengthVisible = true }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef.current) {
      const el = textAreaRef.current;
      el.style.height = 'auto';
      el.style.height = (el.scrollHeight > 200 ? '100' : el.scrollHeight) + 'px';
    }
  });
  return (
    <>
      <div className='textarea_box'>
        {labelText && (
          <label className='txt_label' htmlFor={id}>
            {labelText}
          </label>
        )}
        <textarea
          ref={textAreaRef}
          id={id}
          maxLength={10000}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {isLengthVisible && <p className='text_maxlength'>{value ? value.length : 0} / 10,000 자</p>}
    </>
  );
};

export default EditTextarea;
