import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
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
  userLoginState as useUserLoginState,
  chatbotDiffAdmnin as useChatBotDiffAdmin,
  chatbotDiffAdmnin,
  userLoginState,
  hostInfoName as useHostInfoName,
} from 'store/ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showNotification } from 'utils/common-helper';
export default function MainLayout() {
  const [, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);
  const [modalState, setModalState] = useRecoilState(useModalStore);
  const [userAdminDiff, setuserAdminDiff] = useState<boolean>(true);
  const { sendRequest } = useTempLoginServerAxiosHooks();
  const [userLoginState, setUserLoginState] = useRecoilState(useUserLoginState);
  const [hostInfoName, sethostInfoName] = useRecoilState(useHostInfoName);
  const [chatbotDiffAdmnin, setChatBotDiffAdmin] = useRecoilState(useChatBotDiffAdmin);
  useEffect(() => {
    const hostname = window.location.hostname;
    const hostparam = window.location.search;
    console.log(hostparam);
    sethostInfoName(hostparam);

    if (hostname) {
      const connectionInfo = CONNECTING_INFO[hostname];
      setConnectionInfoState((prev) => ({
        ...prev,
        restful: connectionInfo.restful,
      }));
    }
    fetchEmailLogin(hostparam);
  }, []);

  const fetchEmailLogin = async (textString) => {
    let APICall = 'login/email4Sync';
    const match = textString.match(/\?tp=megaCityLab(\d*)/);
    if (match) {
      const userSuffix = match[1];
      const AdminNum = parseInt(userSuffix, 10);
      if (!isNaN(AdminNum) && AdminNum === 2) {
        APICall += '?user=system2';
        setChatBotDiffAdmin(4);
        console.log(APICall);
      } else if (!isNaN(AdminNum) && AdminNum > 0) {
        APICall += `?user=system${userSuffix}`;
        setChatBotDiffAdmin(AdminNum);
        console.log(APICall);
      } else {
        APICall += '?user=system';
        setChatBotDiffAdmin(3);
        console.log(APICall);
      }
    }
    // if (textString !== '') {
    //   switch (textString) {
    //     case '?tp=megaCitylab':
    //       APICall += '?user=system';
    //       setChatBotDiffAdmin(3);
    //       console.log(APICall)

    //       break
    //     case '?tp=megaCitylab2':
    //       APICall += '?user=system2';
    //       setChatBotDiffAdmin(4);
    //       console.log(APICall)
    //       break
    //     }
    // }
    // if (textString === '?tp=megaCityLab') {
    //   APICall += '?user=system';
    //   setChatBotDiffAdmin(3);
    //   console.log(APICall);
    // } else if (textString === '?tp=megaCityLab2') {
    //   APICall += '?user=system2';
    //   setChatBotDiffAdmin(4);
    //   console.log(APICall);
    // }

    const response = await sendRequest(
      APICall,
      'post',
      undefined,
      {
        email: 'chatplaytest2@maum.ai',
        password256: sha256('chatplay1234'),
        password512: sha512('chatplay1234'),
      },
      true,
    );
    if (response && response.status === 200 && response.data) {
      console.log(response);
      if (response.data.result || response.data.result === 'ok') {
        if (response.data.data.access_token) {
          const data = response.data.data;
          console.log(`%c AccessToken: ${data.access_token}`, 'color:red');
          console.log(`%c Name: ${data.name}`, 'color:red');
          setUserLoginState((prev) => ({
            ...prev,
            userId: data.userId,
            email: data.email,
            name: data.name,
            mobile: data.mobile,
            company_name: data.company_name,
            company_id: data.company_id,
            is_company_admin: data.is_company_admin,
            status: data.status,
            marketing_agreement_type: data.marketing_agreement_type,
            expiredDate: data.expiredDate,
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            joinType: data.join_type,
            userType: data.user_type,
            company_registration_number: data.company_registration_number,
          }));
        }
      } else {
        // Login Fail
        showNotification(response.data.message, 'error');
        return;
      }
    }
  };

  return (
    <div className='flex flex-row w-full h-full'>
      <SideMenu />
      <div className='flex flex-col content w-full min-w-0'>
        <HeaderBar />
        <div className='flex h-full'>
          <SubSideMenu />
          <Outlet />
        </div>
      </div>
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
