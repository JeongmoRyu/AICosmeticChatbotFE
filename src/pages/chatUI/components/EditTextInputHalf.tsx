import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isPassword?: boolean;
  maxLength?: number;
}

export default function EditTextInputHalf({
  labelText,
  id,
  value,
  onChange,
  isDisabled,
  isPassword,
  maxLength,
}: Props) {
  return (
    <div className='input_half_box'>
      <label className='txt_label' htmlFor={id}>
        {labelText}
      </label>
      <input
        type={`${isPassword ? 'password' : 'text'}`}
        id={id}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        maxLength={maxLength}
      />
    </div>
  );
}
