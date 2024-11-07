import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from 'store/userInfo';
import { modalState as useModalStore } from 'store/modal';
import SideMenu from 'containers/SideMenu';
import HeaderBar from 'containers/HeaderBar';
import Backdrop from 'components/Backdrop';
import { CONNECTING_INFO } from 'data/hostInfo';
import SubSideMenu from 'containers/SubSideMenu';
import { useTempLoginServerAxiosHooks } from 'hooks/useTempLoginServerAxiosHooks';
import { sha512 } from 'js-sha512';
import { sha256 } from 'js-sha256';
import {
  // userLoginState as useUserLoginState,
  // chatbotDiffAdmnin as useChatBotDiffAdmin,
  hostInfoName as useHostInfoName,
  roomStatusState as useRoomStatusState,
  isLoadingState as useIsLoadingState,
} from 'store/pro-ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showNotification } from 'utils/common-helper';
import { TailSpin } from 'react-loader-spinner';
import { HOME } from 'data/routers';
export default function MainLayout() {
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);
  const [modalState, setModalState] = useRecoilState(useModalStore);
  const [, sethostInfoName] = useRecoilState(useHostInfoName);
  const [userAdminDiff, setuserAdminDiff] = useState<boolean>(true);
  const { sendRequest } = useTempLoginServerAxiosHooks();
  // const setUserLoginState = useSetRecoilState(useUserLoginState);
  // const setChatBotDiffAdmin = useSetRecoilState(useChatBotDiffAdmin);
  const roomStatusState = useRecoilValue(useRoomStatusState);
  const isLoadingState = useRecoilValue(useIsLoadingState);
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHost = window.location.hostname;
    if (hostname !== 'localhost') {
      const fullHost = port ? `${hostname}:${port}` : hostname;
      console.log(fullHost)

      if (fullHost) {
        const connectionInfo = CONNECTING_INFO[fullHost];
        setConnectionInfoState((prev) => ({
          ...prev,
          restful: connectionInfo.restful,
          socket: connectionInfo.socket,          
        }));
        if (!connectionInfoState.restful) {
          navigate(HOME);
        }
      }
    } else {
      if (fullHost) {
        const connectionInfo = CONNECTING_INFO[fullHost];
        setConnectionInfoState((prev) => ({
          ...prev,
          restful: connectionInfo.restful,
          socket: connectionInfo.socket,
        }));
        if (!connectionInfoState.restful) {
          navigate(HOME);
        }
      }
    }
  }, []);

    // if (hostname !== 'localhost') {
    //   const fullHost = port ? `${hostname}:${port}` : hostname; 
    //   console.log(fullHost)
    // }
    // const hostparam = window.location.search;
    // console.log('hostparam: ', hostparam);
    // sethostInfoName(hostparam);

    // if (fullHost) {
    //   const connectionInfo = CONNECTING_INFO[fullHost];
    //   setConnectionInfoState((prev) => ({
    //     ...prev,
    //     restful: connectionInfo.restful,
    //   }));
    //   if (!connectionInfoState.restful) {
    //     navigate(HOME);
    //   }
    // }
    // fetchEmailLogin(hostparam); 테스트(mainlayout을 사용하지 않은 상태)

  // const fetchEmailLogin = async (textString) => {
  //   let APICall = '/login/email4Sync';
  //   const text = textString.toLowerCase();
  //   const match = text.match(/\?tp=mstudio(\d*)/);
  //   if (match) {
  //     const userSuffix = match[1];
  //     const AdminNum = parseInt(userSuffix, 10);
  //     if (!isNaN(AdminNum) && AdminNum === 2) {
  //       APICall += '?user=system2';
  //       setChatBotDiffAdmin(4);
  //       console.log('1 APICall: ', APICall);
  //     } else if (!isNaN(AdminNum) && AdminNum > 0) {
  //       APICall += `?user=system${userSuffix}`;
  //       setChatBotDiffAdmin(AdminNum);
  //       console.log('2 APICall: ', APICall);
  //     } else {
  //       APICall += '?user=system';
  //       setChatBotDiffAdmin(3);
  //       console.log('3 APICall: ', APICall);
  //     }
  //   }
  //   const response = await sendRequest(
  //     APICall,
  //     'post',
  //     undefined,
  //     {
  //       email: 'chatplaytest2@maum.ai',
  //       password256: sha256('chatplay1234'),
  //       password512: sha512('chatplay1234'),
  //     },
  //     true,
  //   );
  //   if (response && response.status === 200 && response.data) {
  //     console.log('login response: ', response);
  //     if (response.data.result || response.data.result === 'ok') {
  //       if (response.data.data.access_token) {
  //         const data = response.data.data;
  //         console.log(`%c AccessToken: ${data.access_token}`, 'color:red');
  //         console.log(`%c Name: ${data.name}`, 'color:red');
  //         setUserLoginState((prev) => ({
  //           ...prev,
  //           userId: data.userId,
  //           email: data.email,
  //           name: data.name,
  //           mobile: data.mobile,
  //           company_name: data.company_name,
  //           company_id: data.company_id,
  //           is_company_admin: data.is_company_admin,
  //           status: data.status,
  //           marketing_agreement_type: data.marketing_agreement_type,
  //           expiredDate: data.expiredDate,
  //           refreshToken: data.refresh_token,
  //           accessToken: data.access_token,
  //           joinType: data.join_type,
  //           userType: data.user_type,
  //           company_registration_number: data.company_registration_number,
  //         }));
  //       }
  //     } else {
  //       // Login Fail
  //       showNotification(response.data.message, 'error');
  //       return;
  //     }
  //   }
  // };

  return (
    <div id='wrapper'>
      <SideMenu />
      <div id='container'>
        <HeaderBar />
        <div id='contents'>
          <SubSideMenu />
          <div className='overflow_contents'>
            <Outlet />
          </div>
        </div>
      </div>

      {(roomStatusState.chatUiState === 'ING' || isLoadingState) && (
        <div className='flex justify-center items-center z-[15] fixed top-0 left-0 w-full h-full bg-black bg-opacity-20'>
          <TailSpin
            height='80'
            width='80'
            color='#4262FF'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}

      <Backdrop
        isShow={modalState.isShow}
        onClick={() => {
          setModalState((prev) => ({
            ...prev,
            type: '',
            isShow: false,
            data: {},
          }));
        }}
      />
    </div>
  );
}
