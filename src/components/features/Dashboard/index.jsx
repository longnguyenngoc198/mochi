/*global chrome*/

import "./index.scss";
import mochiLogo from "assets/images/logo_navbar.svg";
import practiceIcon from "assets/images/practice_icon.png";
import learnIcon from "assets/images/learn_icon.png";
import notebookIcon from "assets/images/notbook_icon.png";
import mochiNotify from "assets/Mochi-thong-bao.png";

import communityIcon from "assets/images/Community.png";
import avaNotLogin from "assets/images/ava_not_login.png";
import avaDefault from "assets/images/default-avatar.png";
import upIcon from "assets/images/up.png";
import downIcon from "assets/images/down.png";
import mochiVer from "assets/images/mochi_v3.svg";


import { useState, useEffect, useCallback } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvatarDropDown from "./component/AvatarDropDown";
import Login from "components/GeneralPage/Login";
import { accountOperations } from "state/modules/account";
import { noteBookOperations } from "state/modules/noteBook";
import Register from "components/GeneralPage/Register";
import MainModal from "components/commons/MainModal";
import PrimaryButton from "components/commons/PrimaryButton";
function Dashboard({ children }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const noteBookState = useSelector((state) => state.noteBook);
  const accountState = useSelector((state) => state.account);
  const {
    userToken,
    avatar,
    expiredDay,
    displayName,
    isOpenLogin,
    isOpenRegister,
    dayExpire,
    isOpenExpired,
    isOpenExpireDay,
  } = accountState;
  
  const ORIGIN = process.env.REACT_APP_ORIGIN;
  const [activeTab, setActiveTab] = useState("practice");
  const [showDropDown, setShowDropDown] = useState(false);
  const [notify, setNotify] = useState({});
  console.log('accountState', accountState);
  useEffect(() => {
    const pathname = window.location.pathname;
    switch (true) {
      case pathname.includes("review"):
        setActiveTab("review");
        break;
      case pathname.includes("learn"):
        setActiveTab("learn");
        break;
      case pathname.includes("notebook"):
        setActiveTab("notebook");
        break;
      case pathname.includes("community"):
        setActiveTab("community");
        break;
      default:
        setActiveTab("review");
        break;
    }
    console.log("pathname: ", pathname);
  }, [window.location.pathname, noteBookState.isShowModalConfirmSaveNoteBook]);

  const renderDisplayName = (name) =>
    name.length > 10 ? name.substring(0, 10) + "..." : name;
  const renderAvatar = () => {
    if (userToken && avatar) {
      return <img src={avatar} alt="ava" className="user-avatar" />;
    } else if (userToken && !avatar) {
      return <img src={avaDefault} alt="ava" className="user-avatar" />;
    } else {
      return <img src={avaNotLogin} alt="ava" className="user-avatar" />;
    }
  };

  const handleChangeTab = useCallback((activeTab) => {
    if (!noteBookState.hasChange) {
      setActiveTab(activeTab);
    }
  });

  useEffect(() => {
    if (dayExpire > 0 && dayExpire <= 7) {
      dispatch(accountOperations.updateState({ isOpenExpireDay: true }));
    } else if (dayExpire <= 0 && dayExpire !== null) {
      dispatch(accountOperations.updateState({ isOpenExpired: true }));
    }
  }, [dayExpire]);


  useEffect(() => {
    const isNewSession =
      Number(window.sessionStorage.getItem("isNewSession")) > 0 ? false : true;
    console.log('isNewSession', { isNewSession });
    if (!!isNewSession) {
      window.sessionStorage.setItem("isNewSession", 1);
      dispatch(
        accountOperations.fetchListPopup((list) => {
          if (list.length > 0) {
            const activeList = list.filter((item) => item.status == 1);
            if (activeList.length > 0) {
              const randomId = Math.floor(Math.random() * activeList.length);
              setNotify(list[randomId]);
            }
          }
        })
      );
    }
  }, []);


  const baseName =
    "https://" +
    (ORIGIN.includes("localhost")
      ? ORIGIN + "/" + window.location.pathname.split("/")[1]
      : process.env.REACT_APP_ORIGIN);

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: 'url("' + baseName + '/images/BG_extension_2.png")',
      }}
    >
      <div className="navbar-container">
        <Row>
          <Col md="3" className="navbar-element navbar-logo">
            <div>
              <img
                src={mochiLogo}
                alt="logo"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = baseName)}
              />
            </div>
          </Col>
          <Col md="6" className="navbar-element navbar-tab">
            <div className="navbar--tab-wrapper">
              <NavbarItem
                route="review"
                icon={practiceIcon}
                title={t("general.review")}
                onClick={() => handleChangeTab("review")}
                activeTab={activeTab}
              />
              <NavbarItem
                route="learn"
                icon={learnIcon}
                title={t("general.learn")}
                onClick={() => handleChangeTab("learn")}
                activeTab={activeTab}
              />
              <NavbarItem
                route="notebook"
                icon={notebookIcon}
                title={t("general.notebook")}
                onClick={() => handleChangeTab("notebook")}
                activeTab={activeTab}
              />
              <NavbarItem
                route="community"
                icon={communityIcon}
                title={t("general.community")}
                onClick={() => handleChangeTab("community")}
                activeTab={activeTab}
              />
            </div>
          </Col>
          <Col md="3" className="navbar-element navbar-user">
            <div className="navbar-user-wrapper">
              <p className="navbar-user-item">
                {renderDisplayName(displayName)}
              </p>
              <div
                className={`navbar-user-item ${
                  userToken && expiredDay ? "premium" : "free"
                }`}
              >
                {renderAvatar()}
              </div>
              <div
                className="navbar-user-item"
                onClick={() => setShowDropDown(!showDropDown)}
              >
                {showDropDown ? (
                  <img src={upIcon} alt="up-icon" />
                ) : (
                  <img src={downIcon} alt="down-icon" />
                )}
              </div>
            </div>
          </Col>
        </Row>
        {showDropDown && (
          <AvatarDropDown onClose={() => setShowDropDown(!showDropDown)} />
        )}
      </div>
      <Outlet />
      <div className="mochi-version-icon">
        <img src={mochiVer} alt="icon-version" />
      </div>
      {isOpenLogin && <Login />}
      {isOpenRegister && <Register />}

      <MainModal
        show={isOpenExpireDay}
        mascot={mochiNotify}
        handleClose={() =>
          dispatch(accountOperations.updateState({ isOpenExpireDay: false }))
        }
        className="expire-modal"
      >
        <p className="expire-message">
          {t("general.accExpireSoon").replace("{x}", dayExpire)}
        </p>
        <PrimaryButton
          onClick={() => {
            window.open(
              window.MC_LANG === "vi"
                ? "https://mochidemy.com/mochian-web-vi-gia-han/"
                : "https://mochidemy.com/mochian-web-global-gia-han/",
              "_blank"
            );
          }}
          className="expire-btn"
        >
          {t("general.extendNow")}
        </PrimaryButton>
      </MainModal>

      <MainModal
        show={isOpenExpired}
        mascot={mochiNotify}
        handleClose={() =>
          dispatch(accountOperations.updateState({ isOpenExpired: false }))
        }
        className="expire-modal"
      >
        <p className="expire-message">{t("general.accExpired")}</p>
        <PrimaryButton
          onClick={() => {
            window.open(
              window.MC_LANG === "vi"
                ? "https://mochidemy.com/mochian-web-vi-gia-han/"
                : "https://mochidemy.com/mochian-web-global-gia-han/",
              "_blank"
            );
          }}
          className="expire-btn"
        >
          {t("general.extendNow")}
        </PrimaryButton>
      </MainModal>
      <MainModal
        show={Object.keys(notify).length > 0}
        mascot={notify.image}
        handleClose={() => setNotify({})}
        className="notify-modal"
      >
        <p className="notify-message">{notify.message}</p>
        <PrimaryButton
          onClick={() => {
            if (notify.landing_page !== "") {
              window.open(notify.landing_page, "_blank");
            }
            setNotify({});
          }}
          className="notify-btn"
        >
          {notify.text_button}
        </PrimaryButton>
      </MainModal>
    </div>
  );
}
export default Dashboard;
const NavbarItem = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const noteBookState = useSelector((state) => state.noteBook);
  const handleClick = () => {
    if (noteBookState.hasChange) {
      dispatch(noteBookOperations.setStatusModalConfirmNoteBook(true));
      dispatch(noteBookOperations.setRouteActive(props.route));
    } else {
      navigate(props.route);
    }
    props.onClick();
  };
  return (
    <div
      className={`navbar--tab-item ${
        props.activeTab === props.route ? "active-tab" : ""
      }`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="navbar--tab">
        <img src={props.icon} alt="tab-icon" />
        <p>{props.title}</p>
      </div>
    </div>
  );
};
