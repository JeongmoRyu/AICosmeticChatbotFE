import EditCheckbox from './EditCheckbox';
import EditTextInputHalf from './EditTextInputHalf';
import { showNotification } from 'utils/common-helper';

interface Props {
  engineType: string;
  parameters: IEngineParameter[];
  onChange: (type: string, key: string, value: any) => void;
  fieldName?: string;
}

export default function EngineParameterInput({ engineType, parameters, onChange, fieldName = 'parameters' }: Props) {
  if (!parameters) {
    return null;
  }
  // const adjustedFieldName = engineType === 'rag.elastic_search' ? 'rag.elastic_search.parameters' : fieldName;

  return (
    <>
      {parameters.map((item) => {
        const handleParameterChange = (value) => {
          const inputValue = value;
          const numericValue = parseFloat(inputValue);
          const decimalPlaces = Math.max(
            item.range.from.toString().split('.')[1]?.length || 0,
            item.range.to.toString().split('.')[1]?.length || 2,
          );

          const isDecimalValid = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`).test(inputValue);

          const rangeToNumber =
            item.range.to === 'Num Candidates'
              ? Number(parameters.filter((i) => i.label === 'Num Candidates')[0].value)
              : Number(item.range.to);

          if (inputValue === '' || !item.range.to || (isDecimalValid && rangeToNumber >= numericValue)) {
            const updatedParameters = parameters.map((param) => {
              if (param.key === item.key) {
                return { ...param, value: inputValue };
              }
              return param;
            });
            onChange(engineType, fieldName, updatedParameters);
          } else {
            showNotification(
              `${item.range.from} ~ ${item.range.to} 사이의 숫자를 입력하세요. 소수점 ${decimalPlaces}자리까지 허용됩니다.`,
              'error',
            );
          }
        };

        const labelText = () => {
          if (item.range) {
            const form = item.range.from.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            const to = item.range.to.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return `${item.label} (${form} ~ ${to})`;
          } else {
            return '';
          }
        };

        return item.key === 'use_vector_reranker' ? (
          <EditCheckbox
            key={item.key}
            title=''
            name={item.key}
            checkList={[
              {
                value: 0,
                id: item.key,
                labelText: labelText(),
                isChecked: item.value === '1',
              },
            ]}
            onChange={() => {
              const updatedParameters = parameters.map((param) => {
                if (param.key === item.key) {
                  const newValue = param.value === '1' ? '0' : '1';
                  return { ...param, value: newValue };
                }
                // console.log(param);
                return param;
              });
              onChange(engineType, fieldName, updatedParameters);
            }}
          />
        ) : (
          <EditTextInputHalf
            key={item.key}
            labelText={labelText()}
            id={`${engineType}.parameters.${item.key}`}
            value={item.value}
            onChange={(e) => handleParameterChange(e.target.value)}
          />
        );
      })}
    </>
  );
}
