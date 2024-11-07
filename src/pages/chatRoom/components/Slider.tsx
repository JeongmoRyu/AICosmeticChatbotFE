import { useEffect, useRef, useState } from 'react';
import right_arrow from 'assets/images/icons/ico_right_arrow_fill.svg';
import left_arrow from 'assets/images/icons/ico_left_arrow_fill.svg';
import left_arrow_inactive from 'assets/images/icons/ico_left_arrow.svg';
import right_arrow_inactive from 'assets/images/icons/ico_right_arrow.svg';

function Slider({ children, width }: ISliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const checkIfAtStartOrEnd = () => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth);
    };

    checkIfAtStartOrEnd();
    const currentSlider = sliderRef.current;
    currentSlider?.addEventListener('scroll', checkIfAtStartOrEnd);

    return () => {
      currentSlider?.removeEventListener('scroll', checkIfAtStartOrEnd);
    };
  }, []);

  const handleRightClick = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const newScrollPosition = scrollLeft + 300;
      sliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleLeftClick = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const newScrollPosition = scrollLeft - 300;
      sliderRef.current.scrollTo({
        left: newScrollPosition > 0 ? newScrollPosition : 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='flex items-center w-full justify-between min-w-0'>
      <button className='flex items-center justify-center w-5 h-5' onClick={handleLeftClick}>
        <img
          src={isAtStart ? left_arrow_inactive : left_arrow}
          alt='left'
          style={{
            filter: isAtStart ? 'brightness(74%) contrast(10%)' : 'brightness(0%)',
          }}
        />
      </button>
      <div
        className={`slider-container flex items-center overflow-x-auto scrollbar-hide relative p-5 ${width}`}
        ref={sliderRef}
      >
        <div className='slider flex space-x-8'>{children}</div>
      </div>
      <button className='flex items-center justify-center w-5 h-5' onClick={handleRightClick}>
        <img
          src={isAtEnd ? right_arrow_inactive : right_arrow}
          alt='right'
          style={{
            filter: isAtEnd ? 'brightness(74%) contrast(10%)' : 'brightness(0%)',
          }}
        />
      </button>
    </div>
  );
}

export default Slider;
