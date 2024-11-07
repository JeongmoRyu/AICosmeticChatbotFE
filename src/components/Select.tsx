import React, { useRef, useEffect, useState } from 'react';

interface SelectProps {
  ref?: any;
  id?: string;
  name?: string;
  btnName?: string;
  control?: any;
  register?: any;
  typeList: any;
  placeholder?: string | null;
  boxClassName?: string;
  buttonClassName?: string;
  value?: string;
  defaultValue?: string;
  defaultLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  error?: boolean;
  reset?: boolean;
}

function Select(props: SelectProps) {
  const selectboxRef = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedLabel, setSelectedLabel] = useState<string | undefined>('');
  //const [selectedDefaultValue, setSelectedDefaultValue] = useState<string | undefined>("");
  const [selectedValue, setSelectedValue] = useState<string | undefined>('');
  const [isSelectHide, setIsSelectHide] = useState('select-hide');
  const [selectedBtnState, setSelectedBtnState] = useState('');
  const [selectboxClass, setSelectboxClass] = useState<string | undefined>('');

  const handleSelectList = () => {
    if (isSelectHide === 'select-hide') {
      setIsSelectHide('');
      setSelectedBtnState('txt-default select-arrow-active');
      setSelectboxClass(`${props.boxClassName} select-active`);
    } else if (isSelectHide === '') {
      setIsSelectHide('select-hide');
      setSelectedBtnState('');
      setSelectboxClass(props.boxClassName);
    }
  };

  const handleOnChangeSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick && props.onClick(e);

    const currentLabel = e.currentTarget.dataset.text;
    console.log(currentLabel);
    setSelectedLabel(currentLabel);
    setIsSelectHide('select-hide');
    setSelectedBtnState('');
  };

  useEffect(() => {
    if (props?.placeholder) {
      setSelectedLabel(props.placeholder);
    } else {
      if (props?.typeList) {
        // setSelectedLabel(props.typeList[0].text);
      }
    }
    if (props?.boxClassName) {
      setSelectboxClass(props.boxClassName);
    }
    if (props?.defaultValue) {
      setSelectedValue(props.defaultValue);
    }
    if (props?.defaultLabel) {
      setSelectedLabel(props.defaultLabel);
    }
    // if(props?.value){
    //   setSelectedValue(props.value);
    // }
  }, [props.defaultValue, props.defaultLabel, props.typeList]);

  useEffect(() => {
    if (props.reset) {
      if (props?.placeholder) {
        setSelectedLabel(props.placeholder);
      } else {
        if (props?.typeList) {
          setSelectedLabel(props.typeList[0].text);
        }
      }
    }
  }, [props.reset]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (selectboxRef.current && !selectboxRef.current.contains(e.target as Node)) {
        setIsSelectHide('select-hide');
        setSelectedBtnState('');
        setSelectboxClass(props.boxClassName);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectboxRef]);

  useEffect(() => {
    if (props.error) {
      selectedBtnRef.current?.focus();
      setSelectboxClass(`${props.boxClassName} select-active !rounded`);
    } else {
      if (!props.defaultValue) {
        setSelectedLabel(props.typeList[0].text);
      }
    }
  }, []);

  return (
    <div ref={selectboxRef} className={`selectbox ${selectboxClass && selectboxClass}`}>
      <select {...props.register} id={props.id} name={props.name} defaultValue={selectedValue}>
        {props.placeholder && <option value=''>{props.placeholder}</option>}
        {props.typeList &&
          props.typeList.map((type) => {
            return (
              <option
                key={`select_${type.value}`}
                value={type.value}
                disabled={type.disabled}
                className={`${type.disabled && '!bg-secondary-gray'}`}
              >
                {type.text}
              </option>
            );
          })}
      </select>
      <button
        ref={selectedBtnRef}
        type='button'
        name={props.name}
        className={`select-selected ${selectedBtnState} font-bold !text-secondary-default`}
        onClick={handleSelectList}
      >
        {selectedLabel}
      </button>
      <div className={`select-items bg-white ${isSelectHide}`}>
        {props.placeholder && (
          <button type='button' data-value='' data-label={props.placeholder} onClick={handleOnChangeSelect}>
            {props.placeholder}
          </button>
        )}
        {props.typeList?.map((item) => (
          <button
            type='button'
            key={`btn_${item.value}`}
            data-value={item.value}
            data-text={item.text}
            name={props.btnName}
            onClick={handleOnChangeSelect}
            className={`whitespace-nowrap ${item.disabled && '!bg-secondary-gray !text-[#949CA5]'}`}
            disabled={item.disabled}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Select;
