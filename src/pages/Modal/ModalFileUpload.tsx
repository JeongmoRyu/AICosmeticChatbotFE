import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Modal from 'components/Modal';
import ico_upload from '../../assets/images/icons/ico_upload.svg';

const MAX_FILE_NAME_LENGTH = 300;
// const MAX_FILE_COUNT = 100;
const MAX_TOTAL_SIZE = 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'xls', 'xlsx', 'txt'];

interface Props {
  isShow: boolean;
  files: FileType[];
  onClose: () => void;
  onFileUpload: (files: FileType[]) => void;
  onFileRemove: (removeFileId?: number) => void;
}

function ModalFileUpload({ isShow, files, onClose, onFileUpload, onFileRemove }: Props) {
  const [fileList, setFileList] = useState<FileType[]>([]);
  const fileIdRef = useRef(0);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFileList(files);
  }, [files]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    // const currentFileNum = newFiles.length;
    // const addFileNum = MAX_FILE_COUNT - fileList.length;

    // if (currentFileNum > addFileNum) {
    //   alert(`첨부파일은 최대 ${MAX_FILE_COUNT}개 까지 첨부 가능합니다.`);
    //   return;
    // }

    const validFiles = newFiles.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ALLOWED_EXTENSIONS.includes(extension || '');
    });

    if (validFiles.length !== newFiles.length) {
      alert(
        `지원되지 않는 파일 형식이 포함되어 있습니다. (${ALLOWED_EXTENSIONS.join(', ')}) 파일만 업로드 가능합니다.`,
      );
    }

    const longFileName = newFiles.find((file) => file.name.length > MAX_FILE_NAME_LENGTH);
    if (longFileName) {
      alert(`파일명이 ${MAX_FILE_NAME_LENGTH}글자를 넘었습니다.`);
      return;
    }

    const newTotalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    const existingTotalSize = fileList.reduce((acc, file) => acc + file.size, 0);
    if (newTotalSize + existingTotalSize > MAX_TOTAL_SIZE * 1024 * 1024) {
      alert(`총 파일 크기는 ${MAX_TOTAL_SIZE}MB를 넘을 수 없습니다.`);
      return;
    }

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

    setFileList((prevFileList) => [...prevFileList, ...tempFiles]);
    if (fileUploadRef.current) {
      fileUploadRef.current.files = null;
      fileUploadRef.current.value = '';
    }
  };

  const handleFileRemove = (id: number) => {
    const tempList = fileList?.filter((item) => item.id !== id && item);
    setFileList(tempList);
    onFileRemove(id);
  };

  const handleOnCancelClick = () => {
    setFileList(files);
    !fileList && onFileUpload([]);
    onClose();
    onFileRemove(undefined);
  };

  const handleOnSaveClick = () => {
    onFileUpload(fileList);
    onClose();
  };

  return (
    <Modal
      isShow={isShow}
      title='파일 등록'
      onClose={onClose}
      okButtonText='Save'
      okButtonClick={handleOnSaveClick}
      okButtonDisabled={!fileList}
      cancelButtonText='Close'
      cancleButtonClick={handleOnCancelClick}
      width={430}
    >
      <p>RAG 챗봇을 구현하기 위해 파일을 등록하는 단계입니다.</p>
      <p>임베딩하기 위한 파일을 선택후 [Save] 버튼을 눌려주세요.</p>

      <div className='btn_file_wrap'>
        <label htmlFor='file_upload' className='btn_file'>
          <img src={ico_upload} alt='' />
          파일 업로드
          <input
            ref={fileUploadRef}
            type='file'
            multiple
            id='file_upload'
            accept='.pdf,.xls,.xlsx,.txt'
            onChange={handleFileChange}
          />
        </label>
      </div>
      <div className='file_list_box'>
        {!fileList.length ? (
          <p className='txt_center'>
            등록된 파일이 없습니다.
            <br />
            파일을 업로드 해주세요
          </p>
        ) : (
          <ul>
            {fileList.map((item) => (
              <li key={`file_${item.id}`}>
                {item.name}
                <button type='button' className='btn_file_delete' onClick={() => handleFileRemove(item.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

export default ModalFileUpload;
