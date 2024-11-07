import React from 'react';

const PictogramItem: React.FC<IRoundImageLinkSubProps> = ({
  onClick,
  imageUrl,
  isSelected,
}: IRoundImageLinkSubProps) => {
  return (
    <button type='button' className={`box_round_square box_img ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <img className='round_square_img' src={imageUrl} alt='' />
    </button>
  );
};

export default PictogramItem;
