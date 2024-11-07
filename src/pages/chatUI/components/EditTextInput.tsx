import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  labelText?: string;
  placeholder?: string;
  isEssential?: boolean;
}

export default function EditTextInput({ id, value, onChange, isDisabled, labelText, placeholder, isEssential }: Props) {
  return (
    <div className='input_box'>
      {labelText && (
        <label className='txt_label' htmlFor={id}>
          {labelText} {isEssential && <span className='txt_essential'>*</span>}
        </label>
      )}
      <input type='text' id={id} value={value} onChange={onChange} disabled={isDisabled} placeholder={placeholder} />
    </div>
  );
}
