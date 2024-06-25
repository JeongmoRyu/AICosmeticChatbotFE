import { createElement, createRef, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import Litepicker from 'litepicker';
import 'litepicker/dist/plugins/ranges';

// interface ILPOptionButtonText {
//   apply?: string;
//   cancel?: string;
//   previousMonth?: string;
//   nextMonth?: string;
//   reset?: string;
// }

interface DatePickerOptions {
  resetButton?: boolean;
  position?: string;
  lang?: string;
  splitView: boolean;
  autoApply: boolean;
  autoRefresh: boolean;
  singleMode: boolean;
  allowRepick: boolean;
  numberOfColumns: number;
  numberOfMonths: number;
  showWeekNumbers: boolean;
  format: string;
  maxDays?: number;
  dropdowns: {
    minYear: number;
    maxYear: number | null;
    months: boolean;
    years: boolean;
  };
  plugins?: string[];
  ranges?: {
    autoApply?: boolean;
    position?: string;
    customRanges?: object;
  };
  buttonText?: any;
}

interface DatePickerProps {
  value: string;
  className: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  options: DatePickerOptions;
  children?: JSX.Element;
  disabled?: boolean;
  basedate?: string;
}

function DatePicker(props: DatePickerProps) {
  const initialRender = useRef(true);
  const litepickerRef = createRef();
  const tempValue = useRef(props.value);

  const getDateFormat = (format: string) => {
    return format ? format : 'D MMM, YYYY';
  };

  const setValue = (props: DatePickerProps) => {
    const format = getDateFormat(props.options.format as string);
    if (!props.value.length) {
      let date = dayjs().format(format);

      if (props.basedate && props.basedate === 'today') {
        date +=
          !props.options.singleMode && props.options.singleMode !== undefined ? ' - ' + dayjs().format(format) : '';
        props.onChange(date);
      } else if (props.basedate && props.basedate === 'onemonth') {
        date =
          !props.options.singleMode && props.options.singleMode !== undefined
            ? dayjs().add(-30, 'day').format(format) + ' - ' + dayjs().format(format)
            : '';
        props.onChange(date);
      } else if (props.basedate && props.basedate === 'threemonth') {
        date =
          !props.options.singleMode && props.options.singleMode !== undefined
            ? dayjs().add(-90, 'day').format(format) + ' - ' + dayjs().format(format)
            : '';
        props.onChange(date);
      } else if (props.basedate && props.basedate === 'month') {
        const minusDays = dayjs().get('date') - 1;
        date =
          !props.options.singleMode && props.options.singleMode !== undefined
            ? dayjs().add(-minusDays, 'day').format(format) + ' - ' + dayjs().format(format)
            : '';
        props.onChange(date);
      } else {
        date =
          !props.options.singleMode && props.options.singleMode !== undefined
            ? dayjs().add(-6, 'day').format(format) + ' - ' + dayjs().format(format)
            : '';
        props.onChange(date);
      }
    }
  };

  const init = (el: any, props: DatePickerProps) => {
    const format = getDateFormat(props.options.format);
    el.litePickerInstance = new Litepicker({
      element: el,
      ...props.options,
      format: format,
      setup: (picker: any) => {
        picker.on('selected', (startDate, endDate) => {
          let date = dayjs(startDate.dateInstance).format(format);
          date += endDate !== undefined ? ' - ' + dayjs(endDate.dateInstance).format(format) : '';
          props.onChange(date);
        });
      },
    });
  };

  const reInit = (el: any, props: DatePickerProps) => {
    el.litePickerInstance.destroy();
    init(el, props);
  };

  useEffect(() => {
    if (initialRender.current) {
      setValue(props);
      init(litepickerRef.current, props);
      initialRender.current = false;
    } else {
      if (tempValue.current !== props.value) {
        reInit(litepickerRef.current, props);
      }
    }

    tempValue.current = props.value;
  }, [props.value]);

  const { options, value, onChange, ...computedProps } = props;

  return createElement(
    'input',
    {
      ...computedProps,
      ref: litepickerRef,
      type: 'text',
      value: props.value,
      onChange: props.onChange,
    },
    props.children,
  );
}

export default DatePicker;
