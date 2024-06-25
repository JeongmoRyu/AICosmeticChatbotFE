import i18n from "i18next";

import { useRecoilState } from "recoil";
import { language } from "store/language";

import { PAGE_LANGUAGE_TYPE } from "data/options";

interface LangSelectProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isShow?: boolean;
}

function LangSelect(props: LangSelectProps) {
  const [selectLang, setSelectLang] = useRecoilState(language);

  const changeLangEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentLangValue = e.currentTarget.dataset.value;
    const currentLangLabel = e.currentTarget.dataset.label;
    
    setSelectLang(currentLangLabel)
    i18n.changeLanguage(currentLangValue);    
  }

  return (
    <div className="lang z-50">
      <div className="dropdown-wrap">
        <button type="button" name="language" className="dropdown-toggle" onClick={props.onClick}>
          <span className="selected">{selectLang}</span>
        </button>
        <div className={`dropdown dropdown-menu ${props.isShow ? 'show' : 'hidden'}`}>
          <ul>
            {PAGE_LANGUAGE_TYPE && PAGE_LANGUAGE_TYPE.map((item) => {
              return (
                <li key={item.value}>
                  <button className="w-full" data-value={item.value} data-label={item.label} onClick={changeLangEvent}>{item.label}</button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LangSelect;
