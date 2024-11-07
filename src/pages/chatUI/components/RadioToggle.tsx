import { Fragment } from 'react';

interface Props {
  toggleList: toggleListProps[];
  name: string;
  checkedId: string;
  onChange: (id: string) => void;
}

export default function RadioToggle({ toggleList, name, checkedId, onChange }: Props) {
  return (
    <div className='radio_toggle'>
      {toggleList.map((item) => {
        return (
          <Fragment key={item.id}>
            <input
              type='radio'
              id={item.id}
              name={name}
              checked={item.id === checkedId}
              onChange={() => onChange(item.id)}
            />
            <label htmlFor={item.id} className='toggle_label'>
              {item.label}
            </label>
          </Fragment>
        );
      })}
      <span className='bg_glider'></span>
    </div>
  );
}
