import React, { useState, useEffect, useRef } from 'react';


// interface IEngineData {
//   id: number;
//   name: string;
//   parameters: IEngineParameter[];
// }

interface Props {
  engineList: ILLMEngineData[];
  labelText: string;
  name: string;
  activeEngineId: number;
  onChangeEngine: (engineId: number) => void;
  onChangeParameters: (parameters: IEngineParameter[]) => void;
}

const EditSelectBoxWithParameters = ({
  engineList,
  labelText,
  name,
  activeEngineId,
  onChangeEngine,
  onChangeParameters,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  const currentEngine = engineList.find((engine) => engine.id === activeEngineId);

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

  const handleEngineSelect = (engineId: number) => {
    setIsOpen(false);
    onChangeEngine(engineId);

    const selectedEngine = engineList.find((engine) => engine.id === engineId);
    if (selectedEngine) {
      onChangeParameters(selectedEngine.parameters);
    }
  };

  return (
    <div className='select_wrap'>
      <span className='txt_label' onClick={onOpen}>
        {labelText}
      </span>

      <div className={`select_box ${isOpen && 'open'}`} ref={selectBoxRef}>
        <button type='button' onClick={onOpen}>
          {currentEngine?.name || 'Select an engine'}
          <span className='icon'>{isOpen ? '닫힘' : '열림'}</span>
        </button>

        <ul className='select_list'>
          {engineList.map((engine) => (
            <li key={engine.id}>
              <input
                type='radio'
                id={`${name}_${engine.id}`}
                name={name}
                checked={activeEngineId === engine.id}
                onChange={() => handleEngineSelect(engine.id)}
              />
              <label htmlFor={`${name}_${engine.id}`}>{engine.name}</label>
            </li>
          ))}
        </ul>
      </div>

      {currentEngine && currentEngine.parameters.length > 0 && (
        <div className='parameters_wrap'>
          {currentEngine.parameters.map((param) => (
            <div key={param.key} className='parameter_item'>
              <label>{param.label}</label>
              <input
                type='text'
                value={param.value}
                onChange={(e) => {
                  const updatedParameters = currentEngine.parameters.map((p) =>
                    p.key === param.key ? { ...p, value: e.target.value } : p
                  );
                  onChangeParameters(updatedParameters);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditSelectBoxWithParameters;
