import React from 'react';

const ModalFunctionsItem: React.FC<IRoundImageLinkProps> = ({
  title,
  onClick,
  imageUrl,
  text,
  source,
  isSelected,
}: IRoundImageLinkProps) => {
  return (
    <button type='button' className={`box_round_square ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className='round_square_inner'>
        <em className='round_square_title'>{title}</em>
        {text && <p>{text}</p>}
        {source && <p className='txt_gray'>{source}</p>}
      </div>
      <img className='round_square_img' src={imageUrl} alt='' />
    </button>
  );
};

export default ModalFunctionsItem;
