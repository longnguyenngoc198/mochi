/*global chrome*/

import "./index.scss";
import closeIcon from "assets/close-info.png";
import mascot from "assets/Mochi-chi-dan.png";

import mochiModal from "assets/Mochi-thong-bao.png";
import defaultAva from "assets/default-avatar.png";
import startDayIcon from "assets/start-day-icon.png";
import expiredDayIcon from "assets/expired-day-icon.png";
import emailIcon from "assets/email.png";
import translateIcon from "assets/images/translate.png";
import fbIcon from "assets/images/fb-group.png";
import chatIcon from "assets/images/chat.png";
import qaIcon from "assets/images/qa.png";
import upIcon from "assets/images/up-black.png";
import downIcon from "assets/images/down-black.png";
import vnFlag from "assets/images/vietnam.png";
import enFlag from "assets/images/en.png";
import avaNotLogin from "assets/images/not-login.svg";
import editIcon from "assets/images/icon_edit.svg";

import { useState, useEffect, useRef, useCallback } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/commons/PrimaryButton";
import Button from "components/commons/Button";
import { accountOperations } from "state/modules/account";
import MainModal from "components/commons/MainModal";
import i18next from "i18next";
import clickSound from "components/commons/audio/Dashboard/click.mp3";
import SecondaryButton from "components/commons/SecondaryButton";

// import PrimaryButton from "../../../commons/PrimaryButton";
function AccSettings(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const ORIGIN = process.env.REACT_APP_ORIGIN
  const avaRef = useRef();
  const audioRef = useRef();

  const [showOption, setShowOption] = useState(false);
  const [showModalName, setShowModalName] = useState(false);
  const [showModalAva, setShowModalAva] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [avaBase64, setAvaBase64] = useState("");

  const [selectedLang, setSelectedLang] = useState(window.MC_LANG);
  const accountState = useSelector((state) => state.account);

  const { displayName, avatar, expiredDay, email, startDay, userToken } =
    accountState;
  const handleSelectLang = (newLang) => {
    setShowOption(false);
    setSelectedLang(newLang);
    localStorage.setItem("mc_lang", newLang);
    i18next.changeLanguage(newLang);
    window.MC_LANG = newLang;
  };
  const handleChangeName = (event) => {
    const value = event.target.value;
    setNameValue(value);
    if (value.length < 3 || value.length > 15) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };
  const handleUploadFile = (event) => {
    event.persist();
    const file = avaRef.current.files[0];
    if (file.size >= 1000000) {
      setShowModalAva(true);
    } else {
      var reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = function () {
        const convertImg = btoa(reader.result);
        const base64Img = "data:image/png;base64, " + convertImg;
        dispatch(
          accountOperations.updateUserInfo({ avatar: base64Img }, (status) => {
            if (status) {
              dispatch(accountOperations.fetchProfile());
            }
          })
        );
        setAvaBase64(base64Img);
      };
      reader.onerror = function () {
        console.log("there are some problems");
      };
    }
  };
  const handleOpenLogin = () => {
    dispatch(accountOperations.updateState({isOpenLogin: true}));
  }
  const handleOpenRegister = () => {
    dispatch(accountOperations.updateState({ isOpenRegister: true }));
  };
  const handleUpdateName = useCallback((newName) => {
    dispatch(
      accountOperations.updateUserInfo({ display_name: newName }, (status) => {
        if (status) {
          setShowModalName(false);
          dispatch(accountOperations.fetchProfile());
        }
      })
    );
  },[]);
  const handleLogOut = () => {
    document.cookie =
      "mc_tk=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "timesLearn=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.localStorage.removeItem("mc_lang");
    window.localStorage.removeItem("title_course_active");
    window.localStorage.removeItem("id_course_active");
    window.localStorage.removeItem("mc_first_access");
    window.localStorage.removeItem("showModalNotify");
    window.localStorage.removeItem("listCorrect");


    window.location.reload();
  };
  const changeFAQMetaTag = () => {
    const title =
      window.MC_LANG === "vi"
        ? "Danh sách câu hỏi thường gặp về MochiMochi"
        : "Frequently Asked Questions - MochiMochi Learn Kanji";
    const description =
      window.MC_LANG === "vi"
        ? "Trước khi liên hệ đội ngũ hỗ trợ của MochiMochi, bạn hãy xem qua những câu hỏi thường gặp (FAQ) để có được câu trả lời nhanh nhất."
        : "Welcome to MochiMochi! Have a question? Here are some of the most common questions and answers about MochiMochi";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);
    document.querySelector("title").innerText = title;
  };
  console.log({ userToken });
  return (
    <div className="general-page-container">
      <audio src={clickSound} ref={audioRef} />

      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="general-title-wrapper" onClick={props.onClose}>
            <img src={closeIcon} alt="close-icon" className="page-close-icon" />
            <p className="page-title">{t("dashboard.accSetting")}</p>
          </div>

          <div className="user-info-wrapper">
            <div className="avatar-wrapper">
              <div className={`user-avatar-wrapper`}>
                {userToken ? (
                  <>
                    <img
                      src={avaBase64 ? avaBase64 : avatar ? avatar : defaultAva}
                      alt="avatar"
                      className={`user-avatar ${
                        expiredDay ? "paid-bg" : "free-bg"
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="ava-upload"
                      ref={avaRef}
                      onChange={handleUploadFile}
                    />
                    <img
                      src={editIcon}
                      alt="edit"
                      className="edit-btn"
                      onClick={() => avaRef.current.click()}
                    />
                  </>
                ) : (
                  <img
                    src={avaNotLogin}
                    alt="avatar"
                    className={`user-avatar free-bg not-login`}
                  />
                )}
              </div>
              <div
                className={`user-account ${
                  expiredDay ? "paid-bg" : "free-bg"
                } ${!userToken ? "not-login" : ""}`}
              >
                {userToken ? (
                  <p>{expiredDay ? "Premium Account" : "Free User"}</p>
                ) : (
                  <p>Guest account</p>
                )}
              </div>
            </div>
            {userToken && (
              <div className="info-wrapper">
                <div className="info-name-wrapper">
                  <h5 className="info-name">{displayName.toUpperCase()}</h5>
                  <img
                    src={editIcon}
                    alt="edit"
                    className="edit-btn"
                    onClick={() => setShowModalName(true)}
                  />
                </div>
                <div className="info-email info-div">
                  <img src={emailIcon} className="info-icon" alt="email"></img>
                  <p className="info-content">
                    <strong>Email:</strong> {email}
                  </p>
                </div>
                <div className="info-start-day info-div">
                  <img
                    src={startDayIcon}
                    className="info-icon"
                    alt="startDay"
                  ></img>
                  <p className="info-content">
                    <strong>{t("general.activeDate")}:</strong> {startDay}
                  </p>
                </div>
                {expiredDay && (
                  <div className="expiredDayIcon-expired-day info-div">
                    <img
                      src={expiredDayIcon}
                      className="info-icon"
                      alt="expiredDay"
                    ></img>
                    <p className="info-content">
                      <strong>{t("general.expireDate")}:</strong> {expiredDay}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <> */}
          <div className="acc-settings-wrapper">
            <div className="acc-settings-language">
              <SettingItems
                image={translateIcon}
                title={t("general.chooseLang")}
              />
              <div className="language-select">
                {!showOption ? (
                  <div
                    className="language-select-first"
                    onClick={() => setShowOption(true)}
                  >
                    <img
                      src={selectedLang === "en" ? enFlag : vnFlag}
                      alt="flag"
                    />
                    <p>
                      {selectedLang === "en"
                        ? t("general.english")
                        : t("general.vietnamese")}
                    </p>
                    <img src={downIcon} alt="flag" />
                  </div>
                ) : (
                  <div className="language-select-second">
                    <div
                      className="language-select-second-vn"
                      onClick={() => handleSelectLang("vi")}
                    >
                      <img src={vnFlag} alt="flag" />
                      <p>{t("general.vietnamese")}</p>
                      <img src={upIcon} alt="flag" />
                    </div>
                    <div
                      className="language-select-second-en"
                      onClick={() => handleSelectLang("en")}
                    >
                      <img src={enFlag} alt="flag" />
                      <p>{t("general.english")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <SettingItems
              image={fbIcon}
              title={t("general.joinMemberGroup")}
              onClick={() => {
                window.open(
                  window.MC_LANG === "en"
                    ? "https://www.facebook.com/groups/mochimochi.learnkanji"
                    : "https://www.facebook.com/groups/MochiMochi.hoctiengNhat",
                  "_blank"
                );
              }}
            />
            <SettingItems
              image={chatIcon}
              title={t("general.chatMochi")}
              onClick={() => {
                window.open(
                  window.MC_LANG === "en"
                    ? "https://m.me/mochiglobal"
                    : "https://m.me/mochidemy",
                  "_blank"
                );
              }}
            />
            <SettingItems
              image={qaIcon}
              title={t("general.FAQ")}
              onClick={() => {
                props.setPage("FAQ");
                changeFAQMetaTag();
              }}
            />
          </div>
          {!userToken && (
            <div className="not-login-wrapper">
              <SecondaryButton
                className="not-login-btn login-button-settings"
                onClick={handleOpenLogin}
              >
                {t("info.login")}
              </SecondaryButton>
              <SecondaryButton
                className="not-login-btn register-button-settings"
                onClick={handleOpenRegister}
              >
                {t("info.createAcc")}
              </SecondaryButton>
            </div>
          )}
          {userToken && (
            <div>
              <p className="logout-btn" onClick={handleLogOut}>
                {t("info.logOut")}
              </p>
            </div>
          )}
          {/* </> */}
        </Col>
      </Row>

      <MainModal
        mascot={mascot}
        show={showModalName}
        handleClose={() => setShowModalName(false)}
      >
        <div className="edit-name-wrapper">
          <input
            type="text"
            className="edit-name-input"
            onChange={handleChangeName}
            placeholder={t("general.enterNewName")}
            value={nameValue}
          />
          {nameError && <p className="name-error">*{t("general.nameMess")}</p>}
          <PrimaryButton
            className="edit-btn"
            disabled={nameError || nameValue === ""}
            onClick={() => handleUpdateName(nameValue)}
          >
            {t("general.saveChange")}
          </PrimaryButton>
          <p className="cancel-btn" onClick={() => setShowModalName(false)}>
            {t("general.cancel")}
          </p>
        </div>
      </MainModal>
      <MainModal
        mascot={mochiModal}
        show={showModalAva}
        handleClose={() => {
          if (avaRef.current?.files.length > 0) {
            avaRef.current.value = "";
          }
          setShowModalAva(false);
        }}
      >
        <div className="edit-ava-wrapper">
          <p className="edit-ava-text">{t("general.uploadMess")}</p>
          <PrimaryButton
            className="edit-btn"
            disabled={nameError}
            onClick={() => {
              if (avaRef.current?.files.length > 0) {
                avaRef.current.value = "";
              }
              setShowModalAva(false);
            }}
          >
            {t("general.gotIt")}
          </PrimaryButton>
        </div>
      </MainModal>
    </div>
  );
}

export default AccSettings;
const SettingItems = (props) => {
  return (
    <div className="acc-settings-item" onClick={props.onClick}>
      <img src={props.image} alt="icon" />
      <p>{props.title}</p>
    </div>
  );
};
