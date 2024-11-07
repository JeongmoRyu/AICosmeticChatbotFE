interface Props {
  title: string;
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function EditToggle({ title, id, value, onChange }: Props) {
  return (
    <div className='toggle_wrap'>
      <label className='txt_label' htmlFor={id}>
        {title}
      </label>
      <input type='checkbox' id={id} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}
