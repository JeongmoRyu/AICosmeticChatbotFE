import ModalFileUpload from 'pages/Modal/ModalFileUpload';
import { useEffect, useState } from 'react';
import icon_etc from 'assets/images/icons/ico_etc_24.png';
import icon_xls from 'assets/images/icons/ico_xls_24.png';
import icon_pdf from 'assets/images/icons/ico_pdf_24.png';
import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import EditButtonHead from 'pages/chatUI/components/EditButtonHead';

interface Props {
  serverFiles: FileType[];
  onFileChange: (files: FileType[]) => void;
  onFileRemove: (removeFileId?: number) => void;
}

export default function Knowledge({ serverFiles, onFileChange, onFileRemove }: Props) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [isModalShow, setIsModalShow] = useState(false);

  useEffect(() => {
    if (serverFiles) {
      setFiles(serverFiles);
    }
  }, [serverFiles]);

  const handleFileList = (list: FileType[]) => {
    setFiles(list);
    onFileChange(list);
  };

  const getByteSize = (size: number) => {
    const byteUnits = ['KB', 'MB', 'GB', 'TB'];

    for (let i = 0; i < byteUnits.length; i++) {
      size = size / 1024;
      if (size < 1024) return size.toFixed(1) + ' ' + byteUnits[i];
    }
    return size + ' B';
  };
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xls':
      case 'xlsx':
        return icon_xls;
      case 'pdf':
        return icon_pdf;
      case 'txt':
        return icon_etc;
      default:
        return icon_etc;
    }
  };

  return (
    <div className='chat_builder_inner'>
      <EditButtonHead
        title='Knowledge'
        btnText='File upload'
        onClick={() => setIsModalShow(true)}
        icon={ico_new_create}
      />
      {files.length > 0 &&
        files.map((item, index) => (
          <div key={`${item.name}_${index}`} className={`flex ${index > 0 ? 'mt-[15px]' : 'mt-[5px]'}`}>
            <img src={getFileIcon(item.name)} alt={item.name} className='mr-2 w-5 h-5' />
            <p>
              {item.name} ({getByteSize(item.size)})
            </p>
          </div>
        ))}

      <ModalFileUpload
        isShow={isModalShow}
        files={files}
        onClose={() => setIsModalShow(false)}
        onFileUpload={handleFileList}
        onFileRemove={onFileRemove}
      />
    </div>
  );
}
