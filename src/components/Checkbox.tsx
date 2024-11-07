interface CheckboxProps {
  id: string;
  className?: string;
  name?: string;
  appId?: string;
  value?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
  register?: any;
  defaultChecked?: boolean;
}

function Checkbox(props: CheckboxProps) {
  return (
    <div className="form-btn">
      <input
        type="checkbox" 
        id={props.id} 
        name={props.name} 
        value={props.value}
        data-app-id={props.appId}
        className={props.className}
        disabled={props.disabled} 
        onChange={props.onChange}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        {...props.register}
      />
      <label htmlFor={props.id}>
        <span className="sr-only">선택</span>
        {props.label && props.label}
      </label>
    </div>
  );
}

export default Checkbox;
