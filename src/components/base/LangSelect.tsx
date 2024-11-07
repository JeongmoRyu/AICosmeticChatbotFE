import { useState, useEffect } from 'react';
import i18n from 'i18next';

import { useRecoilState } from 'recoil';
import { language } from 'store/language';

import { PAGE_LANGUAGE_TYPE } from 'data/options';
import { useTransition } from 'hooks/useTransition';

interface LangSelectProps {
  // onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isShow?: boolean;
}

function LangSelect(props: LangSelectProps) {
  const { transSetState } = useTransition();
  const [selectLang, setSelectLang] = useRecoilState(language);

  // useEffect(() => {
  //   switch(selectLang){
  //     case "KOR":
  //       i18n.changeLanguage("ko");
  //       break;
  //     case "ENG":
  //       i18n.changeLanguage("en");
  //       break;
  //     // case "JPN":
  //     //   i18n.changeLanguage("ja");
  //     //   break;
  //     default:
  //       break;
  //   }
  // }, []);

  const changeLangEvent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const currentLangValue = e.currentTarget.dataset.value;
    const currentLangLabel = e.currentTarget.dataset.label;
    transSetState(() => {
      setSelectLang(currentLangLabel);
      i18n.changeLanguage(currentLangValue);
    });
  };

  return (
    <div className='lang'>
      <div className='dropdown-wrap'>
        <button type='button' name='language' className='dropdown-toggle'>
          <span className='selected'>KOR</span>
        </button>
        {/* <div className={`dropdown dropdown-menu ${props.isShow ? 'show' : 'hidden'}`}>
          <ul>
            {PAGE_LANGUAGE_TYPE &&
              PAGE_LANGUAGE_TYPE.map((item) => {
                return (
                  <li key={item.value}>
                    <a href='#' data-value={item.value} data-label={item.label} onClick={changeLangEvent}>
                      {item.label}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default LangSelect;
