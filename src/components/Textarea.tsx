import React, { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string | JSX.Element;
  className?: string;
  boxClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {  
      onChange, 
      onBlur,   
      id,
      label,
      className,
      boxClassName,
      value,
      readOnly,
      ...args
    },
    ref,
  ) => {
    return (
      <>
        {label && (
          <label htmlFor={id} className='form-label'>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`form-control multi h-36 w-full ${boxClassName}`}
          defaultValue={value}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          {...args}
        />
      </>
    );
  }
);

export default Textarea;
