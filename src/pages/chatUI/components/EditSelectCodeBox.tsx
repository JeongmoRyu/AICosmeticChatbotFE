import { useEffect, useRef, useState } from 'react';

// const MEMORY_OPTION: SelectListType[] = [
//   { value: 0, id: 'buffer_memory', text: 'buffer memory' },
//   { value: 1, id: 'window_memory', text: 'window memory' },
// ];
// const ENDPOINT_OPTION: SelectListType[] = [{ value: 1, id: 'elastic.m-studio', text: 'elastic.m-studio' }];

interface Props {
  // type: 'memory' | 'endpoint' | '';
  labelText: string;
  name: string;
  activeValue: string;
  onChange: (value: string, parameters?: IEngineParameter) => void;
  list?: SelectListCodeType[];
  isHalf?: boolean;
}

const EditSelectCodeBox = ({ labelText, name, activeValue, onChange, list, isHalf }: Props) => {
// const EditSelectCodeBox = ({ type, labelText, name, activeValue, onChange, list, isHalf }: Props) => {
  const selectList = list ? list : [];
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  const onOpen = () => setIsOpen(!isOpen);

  const handleClickOutside = (e: MouseEvent) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`select_wrap ${isHalf ? 'select_half_wrap' : ''}`}>
      <span className='txt_label' onClick={onOpen}>
        {labelText}
      </span>

      <div className={`select_box ${isOpen ? 'open' : ''}`} ref={selectBoxRef}>
        <button type='button' onClick={onOpen}>
          {selectList?.find((item) => item.value === activeValue)?.text}
          <span className='icon'>{isOpen ? '닫힘' : '열림'}</span>
        </button>

        <ul className='select_list'>
          {selectList?.map((item) => (
            <li key={item.value}>
              <input
                type='radio'
                id={`${name}_${item.value}`}
                name={name}
                checked={activeValue === item.value}
                onChange={() => (setIsOpen(false), onChange(item.value, item.parameters))}
              />
              <label htmlFor={`${name}_${item.value}`}>{item.text}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditSelectCodeBox;
