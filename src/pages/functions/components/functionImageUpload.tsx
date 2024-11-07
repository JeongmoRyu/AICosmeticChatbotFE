import { useCallback, useEffect, useState } from 'react';
import { InputHTMLAttributes } from 'react';
import Modal from 'components/Modal';
import PictogramItem from './PictogramItem';
import { ICONS_LIBRARY_URL, PICTOGRAM_IMAGES } from 'utils/pictogram';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  serverImg?: string;
  isDisabled?: boolean;
  onImageChange?: (imageName: string | null) => void;
}

export default function FunctionImageUpload({ serverImg, isDisabled, onImageChange }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // page image
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null); // modal checked image
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    serverImg && setImageSrc(serverImg);
  }, [serverImg]);

  useEffect(() => {
    if (!isModalVisible) {
      setTempImageSrc(null);
    }
  }, [isModalVisible]);

  const toggleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, [isModalVisible]);

  const handleImageSelect = useCallback((selectedImageUrl: string) => {
    setTempImageSrc(selectedImageUrl);
  }, []);

  const handleSaveActions = useCallback(() => {
    setImageSrc(tempImageSrc);
    setIsModalVisible(false);
    if (onImageChange) {
      const imageName = tempImageSrc?.match(/[^/]+\.svg$/);
      onImageChange(imageName ? imageName[0] : null);
    }
  }, [tempImageSrc, onImageChange]);

  return (
    <div className='image_upload_wrap'>
      <button type='button' onClick={toggleModal} className={`img_box img_pictogram ${!imageSrc ? 'img_none' : ''}`}>
        {imageSrc ? (
          <img className='img' src={imageSrc} alt='' />
        ) : (
          <>
            <img src='/images/ImageUpload.png' alt='' />
            <p>Upload Files</p>
            <p>*JPEG, PNG only</p>
          </>
        )}
      </button>

      <Modal
        isShow={isModalVisible}
        title='Functions Image'
        width={680}
        onClose={toggleModal}
        okButtonText='Save'
        okButtonClick={handleSaveActions}
        okButtonDisabled={!tempImageSrc}
        cancelButtonText='Close'
        cancleButtonClick={toggleModal}
      >
        <div className='wrap_round_square'>
          {PICTOGRAM_IMAGES.map((item, index) => (
            <PictogramItem
              key={`function_image_${index}`}
              imageUrl={`${ICONS_LIBRARY_URL}${item}`}
              onClick={() => handleImageSelect(item)}
              isSelected={item === tempImageSrc}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
