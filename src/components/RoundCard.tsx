import React from 'react';
import { Link } from 'react-router-dom';


const RoundCard: React.FC<RoundImageLinkProps> = ({ to, imageUrl, altText = '', caption, imgClassName }) => {
  return (
    <div className='w-fit'>
      <Link to={to}>
        <div className='flex flex-col justify-center items-center'>
          <div
            className={`w-[10rem] h-[10rem] rounded-full border border-fontColor-gray-500 flex items-center justify-center`}
          >
            <img src={imageUrl} alt={altText} className={imgClassName} />
          </div>
          {caption && <div className='mt-2'>{caption}</div>}
        </div>
      </Link>
    </div>
  );
};

export default RoundCard;
