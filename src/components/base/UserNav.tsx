import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserNavProps {
  isShow?: boolean;
}

function UserNav(props: UserNavProps) {
  const { t } = useTranslation(['header']);

  const [accountInitial, setAccountInitial] = useState<string>('');

  return (
    <div className='user z-50'>
      <div className='dropdown-wrap'>
        <button name='user' type='button' className='btn-toggle profile'>
          U
        </button>
      </div>
    </div>
  );
}

export default UserNav;
