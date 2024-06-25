import React from 'react';



const Cfunction: React.FC<IRoundImageLinkProps> = ({
  imageUrl,
  altText = '',
  title,
  text,
  source,
  imgClassName,
  onClick,
  isSelected,
}) => {
  return (
    <div
      className={`w-[20rem] h-[10rem] flex items-center justify-center hover:bg-primary-default cursor-pointer hover:text-white ${
        isSelected ? 'bg-primary-default text-white' : 'bg-white text-black'
      }`}
      onClick={onClick}
    >
      <div className='flex items-center justify-center ml-5 flex-grow-0 flex-shrink-0 basis-1/3'>
        <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
          <img src={imageUrl} alt={altText} className={imgClassName} />
        </div>
      </div>

      <div className='flex-1 flex flex-col justify-center ml-3 mr-1'>
        <span className='font-bold text-lg'>{title}</span>
        <span className='mb-3'>{text}</span>
        <span className='text-sm text-gray-400'>{source}</span>
      </div>
    </div>
  );
};

export default Cfunction;
