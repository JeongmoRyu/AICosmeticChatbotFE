import { useEffect, useRef, useState } from 'react';

interface Props {
  label: string;
  smallText: string;
  min: number;
  max: number;
  initialValue: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
}

export default function DragSlider({ label, smallText, min, max, initialValue, onChange, isDisabled }: Props) {
  const [value, setValue] = useState<number>(initialValue);
  const sliderRef = useRef<HTMLInputElement>(null);
  const valueLabelRef = useRef<HTMLDivElement>(null);
  const spot1Ref = useRef<HTMLSpanElement>(null);
  const spot2Ref = useRef<HTMLSpanElement>(null);
  const spot3Ref = useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = useState([false, false, false]);

  useEffect(() => {
    updateSlider(value);
  }, [value]);

  const updateSlider = (val: number) => {
    const percentage = ((val - min) / (max - min)) * 100;

    if (sliderRef.current) {
      // 1 ~ 10 = percentage+2 / 10 ~ 30 = percentage+1
      // 70 ~ 80 = percentage-1 / 80 ~ 100 = percentage-3
      const bgLeftPercentage =
        percentage <= 10
          ? percentage + 2
          : percentage <= 30
            ? percentage + 1
            : percentage >= 80
              ? percentage - 3
              : percentage >= 70
                ? percentage - 1
                : percentage;
      sliderRef.current.style.background = `linear-gradient(to right, #4262FF ${bgLeftPercentage}%, #d0d9e3 ${percentage}%)`;
    }

    if (valueLabelRef.current) {
      valueLabelRef.current.style.left = `calc(${percentage}% + (${8 - percentage * 0.15}px))`;
      valueLabelRef.current.textContent = parseInt(String(val)).toLocaleString();
    }

    if (percentage >= 74) {
      spot3Ref.current && setIsActive([true, true, true]);
    } else if (percentage >= 47) {
      spot2Ref.current && setIsActive([true, true, false]);
    } else if (percentage >= 22) {
      spot1Ref.current && setIsActive([true, false, false]);
    } else {
      setIsActive([false, false, false]);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onChange(newValue); 
    // setValue(parseInt(e.target.value));
  };

  return (
    <div className='drag_slider_box'>
      <em className='txt_label'>
        {label}
        <span>{smallText}</span>
      </em>
      <div className='drag'>
        <div className='drag_bar'>
          <input
            type='range'
            min={min}
            max={max}
            value={value}
            onChange={handleSliderChange}
            className='slider'
            step={50}
            ref={sliderRef}
          />
          <span ref={spot1Ref} className={`spot ${isActive[0] ? 'active' : ''}`}></span>
          <span ref={spot2Ref} className={`spot ${isActive[1] ? 'active' : ''}`}></span>
          <span ref={spot3Ref} className={`spot ${isActive[2] ? 'active' : ''}`}></span>
          <div className='drag_fill' ref={valueLabelRef}>
            {value}
          </div>
        </div>
        <span className='txt_min'>{parseInt(String(min)).toLocaleString()}</span>
        <span className='txt_max'>{parseInt(String(max)).toLocaleString()}</span>
      </div>
    </div>
  );
}
