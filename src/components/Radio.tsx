interface RadioProps {
  id: string;
  name: string;
  value: string;
  label?: string;
  labelNoSpace?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  disabled?: boolean;
  labelClassName?: string;
}

function Radio(props: RadioProps) {
  return (
    <div className="flex items-center">
      <input
        id={props.id}
        type="radio"
        name={props.name}
        className="form-check-input"
        value={props.value}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        {...props.register}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      {props.label && (
        <label
          htmlFor={props.id}
          className={`form-check-label ml-2 ${
            props.labelNoSpace ? "" : "md:ml-3"
          } ${props.labelClassName && props.labelClassName}`}
        >
          {props.label}
        </label>
      )}
    </div>
  );
}

export default Radio;
