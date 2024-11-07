interface Props {
  title: string;
  name: string;
  checkList: CheckListType[];
  onChange: (id: string) => void;
}

export default function EditCheckbox({ title, name, checkList, onChange }: Props) {
  return (
    <div className='checkbox_wrap'>
      <em className='box_title'>{title}</em>
      {checkList.map((item) => (
        <div className='checkbox' key={`${name}_${item.id}`}>
          <input
            type='checkbox'
            name={name}
            id={`${item.id}`}
            checked={item.isChecked}
            onChange={(e) => onChange(item.id)}
          />
          <label htmlFor={`${item.id}`}>{item.labelText}</label>
        </div>
      ))}
    </div>
  );
}
