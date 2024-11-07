import { ChangeEvent, useCallback, useRef } from 'react';

interface Props {
  onChangeFile: (fileList: FileType[], isDelete?: boolean) => void;
  fileList?: any[];
  textInfo?: string;
  isMultiple?: boolean;
  accept?: string;
}

const FileUploadList = ({ onChangeFile, fileList, textInfo, isMultiple, accept }: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fileIdRef = useRef(0);

  const handleUploadFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const tempFiles: FileType[] = newFiles.map((file: File) => {
        return {
          id: fileIdRef.current++,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          isNewFile: true,
        };
      });
      onChangeFile(tempFiles);
    },
    [onChangeFile],
  );

  const handleFileDelete = (file: FileType) => {
    const deleteFiles = fileList ? fileList.filter((item) => item !== file) : [];
    onChangeFile(deleteFiles, true);
  };

  return (
    <>
      <div className='file_upload_box'>
        <label htmlFor='fileUpload'>
          파일 선택
          <input
            type='file'
            id='fileUpload'
            name='files'
            multiple={isMultiple}
            accept={accept}
            ref={fileRef}
            onChange={handleUploadFile}
          />
        </label>
        {fileList && fileList.length > 0 ? (
          <ul className='file_list'>
            {fileList.map((item) => (
              <li key={item.id}>
                {item.name}
                <button type='button' className='btn_file_delete' onClick={() => handleFileDelete(item)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='file_name no_file'>선택된 파일 없음</p>
        )}
      </div>
      {textInfo && <p className='txt_file_info'>{textInfo}</p>}
    </>
  );
};
export default FileUploadList;
