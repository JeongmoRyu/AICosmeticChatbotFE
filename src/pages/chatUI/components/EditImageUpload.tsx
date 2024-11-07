import React, { useRef, useCallback, useState, useEffect } from 'react';
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onChangeImage: (imageFile: FileType) => void;
  serverImg?: string;
  isDisabled?: boolean;
}

export default function EditImageUpload({ onChangeImage, serverImg, isDisabled }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    serverImg && setImageSrc(serverImg);
  }, [serverImg]);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setImageSrc(result);
      };
      reader.readAsDataURL(file);
      onChangeImage && onChangeImage({ id: 0, name: file.name, size: file.size, type: file.type, file: file });
    },
    [onChangeImage],
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  return (
    <div className='image_upload_wrap'>
      <input type='file' accept='image/*' name='thumbnail' ref={inputRef} onChange={onUploadImage} />

      <button type='button' onClick={onUploadImageButtonClick} className={`img_box ${!imageSrc ? 'img_none' : ''}`}>
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
    </div>
  );
}
