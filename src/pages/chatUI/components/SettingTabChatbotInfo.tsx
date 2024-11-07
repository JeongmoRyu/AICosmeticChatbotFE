import EditTextInput from './EditTextInput';
import EditImageUpload from './EditImageUpload';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import { useRecoilValue } from 'recoil';

interface Props {
  name: string;
  description: string;
  onChange: (type: string, key: string, value: any) => void;
  onChangeImage: (imageFile: FileType) => void;
  id?: number;
}
export default function SettingTabChatbotInfo({ name, description, onChange, onChangeImage, id }: Props) {
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  return (
    <>
      <em className='txt_label'>Chatbot Image</em>
      <EditImageUpload
        serverImg={id ? `${connectionInfoState.restful}/chatbotinfo/image/${id}` : ''}
        onChangeImage={onChangeImage}
      />
      <EditTextInput
        labelText='Name'
        id='name'
        value={name || ''}
        onChange={(e) => onChange('name', '', e.target.value)}
      />
      <EditTextInput
        labelText='Description'
        id='description'
        value={description || ''}
        onChange={(e) => onChange('description', '', e.target.value)}
      />
    </>
  );
}
