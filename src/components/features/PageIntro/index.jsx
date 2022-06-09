/*global chrome*/

import "./index.css";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import AnimationMochiHello from "./Animation/MochiHello";
import PrimaryButton from "../../commons/PrimaryButton";
import ButtonCustom from "../../commons/ButtonCustom";
import MochiSelectLanguage from "../../commons/MochiSelectLanguage";
import Intro from "./Animation/Intro";
import ListCourse from "../ListCourse";
import background from "./images/background.png";
import imgLogoWhite from "./images/logoWhite.svg";
import imgVn from "../../commons/images/vn.png";
import imgEng from "../../commons/images/uk.png";
import {LANGUAGE_VN, LANGUAGE_UK} from "../helpers.js"
import ReactGA from "react-ga";
import { accountOperations } from "state/modules/account";
import Login from "components/GeneralPage/Login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function PageIntro() {
  ReactGA.initialize(process.env.REACT_APP_GA, {
    debug: true,
    titleCase: false,
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(() => {
      startAnimation();
    }, 1500);
  }, []);

  const [isSelectLanguage, setIsSelectLanguage] = useState(
    window.MC_LANG
  );
  const [selectedLanguage, setSelectedLanguage] = useState(window.MC_LANG);
  const [page,setPage] = useState("hello");
  const [showLogin, setShowLogin] = useState(false);
  

  function startAnimation() {
    let start = Date.now();
    let timer = setInterval(function () {
      let timePassed = Date.now() - start;
      if (timePassed >= 500) {
        clearInterval(timer);
        return;
      }
      draw(timePassed);
    }, 20);
  }
  console.log({selectedLanguage});
  console.log("MC_LANG",window.MC_LANG);

  function draw(timePassed) {
    document.querySelector(".intro_content_language").style.opacity = "1";
    document.querySelector(".intro_content").style.marginLeft =
      250 - timePassed / 2 + "px";
  }

  const handleChangeLanguage = useCallback((LANGUAGE) => {
    setIsSelectLanguage(true);
    setSelectedLanguage(LANGUAGE);
    localStorage.setItem("mc_lang", LANGUAGE);
    i18next.changeLanguage(LANGUAGE);
  });
  const handleOpenLogin = () => {
    window.localStorage.setItem("mc_first_access", "0");
    const urlHrefLast = window.location.href[window.location.href.length - 1];
    dispatch(accountOperations.updateState({ isOpenLogin: true}));
    navigate("/review")
  }
  return (
    <>
      {page == "intro" && (
        <Intro
          languague={selectedLanguage}
          languageVN={LANGUAGE_VN}
          languageUK={LANGUAGE_UK}
          setPage={setPage}
        />
      )}
      {page == "hello" && (
        <div
          className="intro_backdrop"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
          }}
        >
          <div className="intro_header">
            <img style={{ width: "220px" }} src={imgLogoWhite}></img>
            {isSelectLanguage && (
              <div style={{ display: "flex" }}>
                <b style={{ margin: "10px 20px 0 0" }}>
                  {t("general.chooseLang")} 
                 
                </b>
                <MochiSelectLanguage
                  selected={selectedLanguage}
                  handleChangeLanguage={handleChangeLanguage}
                  languageVN={LANGUAGE_VN}
                  languageUK={LANGUAGE_UK}
                />
              </div>
            )}
          </div>
          <div className="intro_content">
            <AnimationMochiHello />
            {isSelectLanguage ? (
              <div className="intro_content_language">
                <p>{t("general.memorize1000Month")}</p>
                <div style={{ marginTop: "30px" }}>
                  <PrimaryButton
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      ReactGA.event({
                        category: "welcome_screen",
                        action: "click_start_now",
                        label: "first_open",
                      });
                      setPage("intro");
                    }}
                  >
                    {t("general.getStarted")}
                  </PrimaryButton>
                  <ButtonCustom
                    style={{
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 1)",
                      marginTop: "10px",
                      color: "black",
                    }}
                    onClick={handleOpenLogin}
                  >
                    {t("general.haveAcc")}
                  </ButtonCustom>
                </div>
              </div>
            ) : 
            
            (<div className="intro_content_language">
                <p>{t("general.chooseLang")}</p>
                <div style={{ marginTop: "30px" }}>
                  <div
                    className="intro_btn_language"
                    onClick={() => {
                      handleChangeLanguage(LANGUAGE_VN);
                    }}
                  >
                    <img src={imgVn}></img>
                    <p>Tiếng Việt</p>
                  </div>
                  <div
                    className="intro_btn_language"
                    onClick={() => {
                      handleChangeLanguage(LANGUAGE_UK);
                    }}
                    s
                    style={{ marginTop: "10px" }}
                  >
                    <img src={imgEng}></img>
                    <p>English</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PageIntro;
