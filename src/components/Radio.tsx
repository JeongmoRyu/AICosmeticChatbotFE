interface RadioProps {
  id: string;
  name: string;
  labelText?: string;
  onChange: (id: string) => void;
  register?: any;
  isChecked?: boolean;
  disabled?: boolean;
}

function Radio({ id, name, labelText, onChange, isChecked, disabled }: RadioProps) {
  return (
    <div className='radio_warp'>
      <input type='radio' name={name} id={id} checked={isChecked} onChange={() => onChange(id)} disabled={disabled} />
      {labelText && <label htmlFor={id}>{labelText}</label>}
    </div>
  );
}

export default Radio;
