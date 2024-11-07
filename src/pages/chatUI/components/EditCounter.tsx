interface Props {
  title: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  step?: number;
}

export default function EditCounter({ title, id, value, onChange, step }: Props) {
  const handleSubtract = () => {
    if (+value > 0) {
      const newValue = (+value - (step ? step : 1)).toFixed(1);
      onChange(newValue);
    }
  };
  // const handleAdd = () => onChange(String(+value + (step ? step : 1)));
  const handleAdd = () => {
    const newValue = (+value + (step ? step : 1)).toFixed(1);
    onChange(String(newValue));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <div className='counter_wrap'>
      <label className='txt_label' htmlFor={id}>
        {title}
      </label>
      <div>
        <button type='button' className='btn_subtract' onClick={handleSubtract}>
          -
        </button>
        <input type='text' id={id} value={value} onChange={handleChange} disabled={!!step} />
        <button type='button' className='btn_add' onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  );
}
