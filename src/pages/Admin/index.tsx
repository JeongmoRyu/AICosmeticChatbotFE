import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useProAIRestfulCustomAxios } from 'hooks/useProAIRestfulCustomaxios';
import {
  isLoadingState as useIsLoadingState,
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
} from 'store/pro-ai';
import { showNotification } from 'utils/common-helper';
import Radio from 'components/Radio';
import ico_new_create from 'assets/images/icons/ico_new_create.svg';
import InfoDetail from './components/InfoDetail';
import { sha512 } from 'js-sha512';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from 'data/routers';

const DEFAULT_USER_DATA: UserListType = {
  username: '',
  password: '',
  name: '',
  sex: 'M',
  birth_year: '',
  is_admin: false,
  is_super_admin: false,
};

export default function Admin() {
  const { sendRequestProAI } = useProAIRestfulCustomAxios();
  const [isLoadingState, setIsLoadingState] = useRecoilState(useIsLoadingState);
  const [userList, setUserList] = useState<UserListType[]>([]);
  const [userDatileData, setUserDatileData] = useState<UserListType | null>(null);
  const [selectUserId, setSelectUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const userAuthority = useRecoilValue(useUserAuthority);
  const userLoginState = useRecoilValue(useUserLoginState);
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setIsLoadingState(true);
    const response = await sendRequestProAI('/login/account/list', 'get');
    if (response && response.data?.result) {
      if (response.data.code !== 'F002') {
        const { data } = response.data;
        const tempList: UserListType[] = [];
        data.map((item) =>
          tempList.push({
            user_key: item.user_key,
            username: item.username,
            password: item.password,
            name: item.name,
            sex: item.sex,
            birth_year: item.birth_year,
            is_admin: item.is_admin,
            is_super_admin: item.is_super_admin,
          }),
        );
        setUserList(tempList);
      } else {
        showNotification(response.data.message, 'error');
        navigate(LOGIN);
      }
    } else {
      setIsLoadingState(false);
      showNotification('서버로부터 정상적인 계정 정보 데이터를 받지 못했습니다.', 'error');
      return navigate(-1);
    }
    setIsLoadingState(false);
  };

  const handleSaveApi = async () => {
    setIsLoadingState(true);
    const method = userDatileData?.user_key ? 'put' : 'post';
    const putData = {
      ...userDatileData,
      password: userDatileData?.password ? sha512(userDatileData?.password) : '',
    };
    console.log(putData);
    const response = await sendRequestProAI('/login/account', method, undefined, putData);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        showNotification(`${method === 'put' ? '수정' : '생성'} 완료되었습니다.`, 'success');
        method === 'post' && handleSidebarClose();
        getList();
      } else {
        showNotification(
          response.data.message
            ? response.data.message
            : `정상적으로 ${method === 'put' ? '수정' : '생성'}을 실패하였습니다.`,
          'error',
        );
      }
    } else {
      showNotification(`정상적으로 ${method === 'put' ? '수정' : '생성'}을 실패하였습니다.`, 'error');
      isLoadingState && setIsLoadingState(false);
      return;
    }
    setIsLoadingState(false);
  };

  const handleDeleteApi = async () => {
    if (userDatileData?.user_key) {
      setIsLoadingState(true);
      const response = await sendRequestProAI(`/login/account/${userDatileData.user_key}`, 'delete');
      if (response && response.data && response.data.code === 'F000') {
        showNotification('정상적으로 삭제 완료되었습니다.', 'success');
        handleSidebarClose();
        getList();
      } else {
        showNotification(response.data.message ? response.data.message : '정상적으로 삭제를 실패하였습니다.', 'error');
      }
      isLoadingState && setIsLoadingState(false);
      return;
    }
  };

  const handleValueChange = (type: string, value: any) => {
    if (type === 'is_super_admin' && value) {
      setUserDatileData((prev) => {
        if (!prev) return null;
        return { ...prev, is_super_admin: true, is_admin: true };
      });
    } else if (type === 'is_admin' && !value) {
      setUserDatileData((prev) => {
        if (!prev) return null;
        return { ...prev, is_super_admin: false, is_admin: false };
      });
    } else if (userDatileData !== null) {
      setUserDatileData((prev) => {
        if (!prev) return null;
        return { ...prev, [type]: value };
      });
    }
  };

  const handleUserSelect = (id: string) => {
    setIsMine(userLoginState.userId === id);

    setSelectUserId(id);
    const tempData = userList.filter((item) => item.username === id)[0];
    setUserDatileData(tempData);
  };

  // const handleUserCreate = () => {
  //   setSelectUserId('');
  //   console.log(selectUserId)
  //   setUserDatileData(DEFAULT_USER_DATA);

  //   setTimeout(() => {
  //     setSelectUserId('');
  //     console.log(selectUserId)
  //     setUserDatileData(DEFAULT_USER_DATA);
  //   }, 50);
  // };
  const handleUserCreate = () => {
    setSelectUserId('');
    setUserDatileData(DEFAULT_USER_DATA);
  };

  const handleSidebarClose = () => {
    setSelectUserId(null);
    setUserDatileData(null);
  };

  const userListLayout = () => {
    let users: UserListType[] = [];
    if (userAuthority === 'editor') {
      users = userList.filter((item) => !item.is_super_admin);
    } else {
      users = userList;
    }

    return users.map((item) => {
      const id = `${item.user_key}_${item.username}`;
      return (
        <tr key={id}>
          <td className='cell_checked'>
            <Radio
              id={id}
              name='userList'
              isChecked={item.username == selectUserId}
              onChange={() => handleUserSelect(item.username)}
            />
            <input type='radio' id={id} />
          </td>
          <td className='cell_name'>
            <label htmlFor={id}>{item.name}</label>
          </td>
          <td className='cell_birth'>
            <label htmlFor={id}>{item.birth_year}</label>
          </td>
          <td className='cell_id'>
            <label htmlFor={id}>{item.username}</label>
          </td>
          <td className='cell_admin'>
            <label htmlFor={id}>{item.is_super_admin ? 'Admin' : item.is_admin ? 'Editor' : '-'}</label>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='page_admin'>
      <div className='admin_content'>
        <div className='head_warp'>
          <button type='button' className='btn_type blue' onClick={handleUserCreate}>
            <img src={ico_new_create} alt='' />
            계정 새로 만들기
          </button>
        </div>
        <div className='table_list'>
          <div className='table_list_inner'>
            <table>
              <caption className='screen_hide'>User List</caption>
              <colgroup>
                <col className='cell_checked' />
                <col className='cell_name' />
                <col className='cell_birth' />
                <col className='cell_id' />
                <col className='cell_admin' />
              </colgroup>
              <thead>
                <tr>
                  <th scope='col' className='cell_checked'>
                    <span className='screen_hide'>선택여부</span>
                  </th>
                  <th scope='col' className='cell_name'>
                    이름
                  </th>
                  <th scope='col' className='cell_birth'>
                    생년
                  </th>
                  <th scope='col' className='cell_id'>
                    ID
                  </th>
                  <th scope='col' className='cell_admin'>
                    권한
                  </th>
                </tr>
              </thead>
              <tbody>{userListLayout()}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`sidebar ${selectUserId !== null ? 'open' : ''}`}>
        <div className='sidebar_head'>
          <button onClick={handleSidebarClose} className='btn_close'>
            닫기
          </button>
        </div>

        <InfoDetail data={userDatileData} onChange={handleValueChange} />

        <div className='bottom_box'>
          {!isMine && userDatileData?.user_key && (
            <button type='button' className='btn_type red' onClick={handleDeleteApi}>
              Delete
            </button>
          )}
          <button type='button' className='btn_type blue' onClick={handleSaveApi}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
