import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAuthority as useUserAuthority } from 'store/pro-ai';
import { ACCOUNT_ADMIN, CHATBUILDER, CHATROOM, EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD, EMBEDDING_RANKER, FUNCTIONS, HOME } from 'data/routers';
import ico_open from 'assets/images/icons/ico_open.svg';
import logo from 'assets/images/logos/logo_symbol_new.svg';
import ico_company from 'assets/images/icons/ico_company.svg';

type MenuType = 'maumGPT' | 'businessGPT' | '';

interface MenuListType {
  id: MenuType;
  text: string;
  subList: { id: string; text: string; ico: string; movePage: string; isNewbadge?: boolean }[];
}

export default function SubSideMenu() {
  const navigate = useNavigate();
  const userAuthority = useRecoilValue(useUserAuthority);
  const [openMenu, setOpenMenu] = useState<MenuType>('maumGPT');
  const [onSubMenu, setOnSubMenu] = useState('chathub');
  const location = useLocation();

  useEffect(() => {
    if (location) {
      const pathname = location.pathname;
      if (pathname) {
        switch (pathname) {
          case HOME:
            setOnSubMenu('chathub');
            break;
          case CHATROOM:
            setOnSubMenu('chathub');
            break;
          case CHATBUILDER:
            setOnSubMenu('chathub');
            break;
          case FUNCTIONS:
            setOnSubMenu('chathub');
            break;
          case ACCOUNT_ADMIN:
            setOnSubMenu('Admin');
            break;
          case EMBEDDING_RANKER:
            setOnSubMenu('embeddingRanker');
            break;
          case EMBEDDING_HISTORY:
            setOnSubMenu('embeddingRanker');
            break;
          case EMBEDDING_LEADERBOARD:
            setOnSubMenu('embeddingRanker');
            break;
        }
      }
    }
    // if (userLoginState.accessToken) {
    //   setLoginstate(true);
    // } else {
    //   setLoginstate(false);
    //   navigate(LOGIN);
    // }
  }, [location]);





  const menuList: MenuListType[] = [
    {
      id: 'maumGPT',
      text: 'maum GPT',
      subList: [
        { id: 'chathub', text: 'Chathub', ico: logo, movePage: HOME },
        // { id: 'embeddingRanker', text: 'Embedding Ranker', ico: logo, movePage: EMBEDDING_HISTORY },
        ...(userAuthority ? [{ id: 'embeddingRanker', text: 'Embedding Ranker', ico: logo, movePage: EMBEDDING_HISTORY }] : []),
      ],
    },
    // {
    //   id: 'businessGPT',
    //   text: '기업용 GPT',
    //   subList: [
    //     { id: 'hrdkorea', text: '한국산업인력공단', ico: ico_company, movePage: EMBEDDING_RANKER },
    //     { id: 'hrdkorea2', text: '한국산업인력공단2', ico: ico_company, movePage: EMBEDDING_RANKER, isNewbadge: true },
    //   ],
    // },
  ];

  const handleOpenMenu = (id: MenuType) => {
    if (id === openMenu) {
      setOpenMenu('');
    } else {
      setOpenMenu(id);
    }
  };

  const handleGoPage = (id, goPage) => {
    console.log(id, goPage);
    // setOnSubMenu(id);
    navigate(goPage);
  };

  return (
    <div id='gnb'>
      <nav className='gpt-nav'>
        {/* {userAuthority && (
          <button
            type='button'
            className='bg-[left_1.25rem_center] bg-[url(/src/assets/images/icons/ico_plus.svg)] bg-primary-default bg-no-repeat pl-12 rounded-xl w-full h-14 font-bold text-base text-left text-white'
            onClick={() => navigate(CHATBUILDER)}
          >
            New chat
          </button>
        )} */}
        <div className='mt-4 max-h-[calc(100vh-12rem)] overflow-y-auto'>
          <ul className='flex flex-col navbar side-nav'>
            {menuList.map((item) => (
              <li className='mb-1 w-full' key={`sideMenu_${item.id}`}>
                <div className={`rounded-xl ${openMenu === item.id ? 'side-menu-wrap--active' : ''}`}>
                  <button
                    type='button'
                    className={`flex w-full items-center px-5 py-4 rounded-lg text-default text-base font-bold side-menu transition ease-in-out ${openMenu === item.id ? 'side-menu--active' : ''}`}
                    onClick={() => handleOpenMenu(item.id)}
                  >
                    <div className='side-menu__title'>
                      {item.text}
                      <img
                        className={`side-menu__sub-icon w-[14px] ${openMenu === item.id ? 'rotate-180' : ''}`}
                        src={ico_open}
                        alt=''
                      />
                    </div>
                  </button>
                  {openMenu === item.id && item.subList.length > 0 && (
                    <div className='sub-menu'>
                      {item.subList.map((v) => (
                        <div className='mb-1.5 px-2 py-1 w-full' key={`subMenu_${v.id}`}>
                          <button
                            type='button'
                            className={`flex w-full rounded-lg py-[5px] pr-[7px] pl-[10px] text-left font-bold ${onSubMenu === v.id ? 'bg-white text-[#111]' : 'text-[#5B636D] hover:opacity-100 hover:bg-white transition ease-in-out'}`}
                            onClick={() => handleGoPage(v.id, v.movePage)}
                          >
                            <img
                              className={`mr-2 w-[20px] h-[20px] hover:grayscale-0 ${onSubMenu === v.id ? '' : 'invert-[50%] grayscale-[50%]'}`}
                              src={v.ico}
                              alt=''
                            />
                            <span className='flex-1'>{v.text}</span>
                            {v.isNewbadge && <span className='badge mt-[1px]'></span>}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {userAuthority && (
        <Link to={ACCOUNT_ADMIN} className='btn_admin'>
          Account Registration
        </Link>
      )}
    </div>
  );
}
