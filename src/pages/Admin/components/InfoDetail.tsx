import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import EditToggle from 'pages/chatUI/components/EditToggle';
import EditTextInputHalf from 'pages/chatUI/components/EditTextInputHalf';
import RadioToggle from 'pages/chatUI/components/RadioToggle';
import { userAuthority as useUserAuthority } from 'store/pro-ai';

const GENDER: toggleListProps[] = [
  { id: 'M', label: '남' },
  { id: 'F', label: '여' },
];

interface Props {
  data: UserListType | null;
  onChange: (type: string, value: any) => void;
}
export default function InfoDetail({ data, onChange }: Props) {
  const [toggleSelectGender, setToggleSelectGender] = useState('M');
  const userAuthority = useRecoilValue(useUserAuthority);
  const [reviseState, setReviseState] = useState<boolean>(false);

  useEffect(() => {
    if (data?.sex) {
      setToggleSelectGender(data.sex);
    }

    if (data?.user_key) {
      setReviseState(true);
      console.log(reviseState);
    } else {
      setReviseState(false);
      console.log(reviseState);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div className='scroll_wrap'>
      <EditTextInputHalf
        labelText='로그인ID'
        id={data.username}
        value={data.username}
        isDisabled={reviseState}
        onChange={(e) => onChange('username', e.target.value)}
      />
      <EditTextInputHalf
        labelText='비밀번호'
        id='password'
        value={data.password || ''}
        onChange={(e) => onChange('password', e.target.value)}
        isPassword={true}
      />
      <EditTextInputHalf
        labelText='이름'
        id='name'
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <div className='radio_toggle_wrap'>
        <em className='txt_label'>성별</em>
        <RadioToggle
          toggleList={GENDER}
          name='sex'
          checkedId={toggleSelectGender}
          onChange={(id) => setToggleSelectGender(id)}
        />
      </div>
      <EditTextInputHalf
        labelText='생년'
        id='birth_year'
        value={data.birth_year ? String(data.birth_year) : ''}
        onChange={(e) => onChange('birth_year', e.target.value)}
        maxLength={4}
      />

      <EditToggle
        title='Editor 권한'
        id='is_admin'
        value={!!data.is_admin}
        onChange={(val) => onChange('is_admin', val)}
      />
      {userAuthority === 'admin' && (
        <EditToggle
          title='Admin 권한'
          id='is_super_admin'
          value={!!data.is_super_admin}
          onChange={(val) => onChange('is_super_admin', val)}
        />
      )}
    </div>
  );
}
