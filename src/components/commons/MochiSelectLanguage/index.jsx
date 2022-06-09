/*global chrome*/

import "./styles.css";
import { useState, useEffect, useCallback } from "react";
import i18next from "i18next";
import imgVn from "../images/vn.png";
import imgEng from "../images/uk.png";
import iconArrowDown from "../icon/arrow-down.png";
import iconArrowUp from "../icon/arrrow-up.png";


function MochiSelectLanguage({ selected, handleChangeLanguage, languageVN, languageUK }) {
  const [isOpen, setIsOpen] = useState(false);
  const isEnglish = selected !== languageVN;
  console.log('isEnglish= ', isEnglish);
  
  const handleSelect = useCallback((type) => {
    handleChangeLanguage(type)
  });
  return (
    <>
      {isOpen ? (
        <div
          style={{
            background: "rgb(255 244 202)",
            height: "84px",
            borderRadius: "11px",
          }}
          // onClick={() => setIsOpen(!isOpen)}
        >
          {/* vi */}
          <div
            className="mochi_select_btn_language"
            style={{
              background: "rgba(255, 237, 166, 1)",
              justifyContent: "space-between",
            }}
            onClick={() => handleSelect(isEnglish ? languageUK : languageVN)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className="mochi_select_flag"
                src={isEnglish ? imgEng : imgVn}
              ></img>
              <p>{isEnglish ? "English" : "Tiếng Việt"}</p>
            </div>
            <img className="mochi_select_arrow" src={iconArrowUp}></img>
          </div>
          
          {/* EN */}
          <div
            className="mochi_select_btn_language"
            style={{ position: "absolute" }}
            onClick={() => handleSelect(isEnglish ? languageVN : languageUK)}
          >
            <img
              className="mochi_select_flag"
              src={isEnglish ? imgVn : imgEng}
            ></img>
            <p>{isEnglish ? "Tiếng Việt" : "English"}</p>
          </div>
        </div>
      ) : (
        <div
          className="mochi_select_btn_language"
          style={{
            background: "rgba(255, 237, 166, 1)",
            justifyContent: "space-between",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
           <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className="mochi_select_flag"
              src={isEnglish ? imgEng : imgVn}
            ></img>
          <p>{isEnglish ? "English" : "Tiếng Việt"}</p>
          </div>
          <img className="mochi_select_arrow" src={iconArrowDown}></img>
        </div>
      )}
    </>
  );
}

export default MochiSelectLanguage;
