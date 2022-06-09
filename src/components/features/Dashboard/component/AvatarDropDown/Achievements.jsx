/*global chrome*/

import "./index.scss";
import closeIcon from "assets/close-info.png";
import mochiModal from "assets/mochi-chuc-mung.png";
import defaultAva from "assets/default-avatar.png";
import memoIcon from "assets/images/memo-arch.png";
import notebookLv1 from "assets/images/notebook/level1.png";
import notebookLv2 from "assets/images/notebook/level2.png";
import notebookLv3 from "assets/images/notebook/level3.png";
import notebookLv4 from "assets/images/notebook/level4.png";
import trophyLv1 from "assets/images/trophy/lv1.png";
import trophyLv2 from "assets/images/trophy/lv2.png";
import trophyLv3 from "assets/images/trophy/lv3.png";
import trophyLv4 from "assets/images/trophy/lv4.png";
import trophyLv5 from "assets/images/trophy/lv5.png";
import trophyLv6 from "assets/images/trophy/lv6.png";
import streakdayLv0 from "assets/images/streakday/lv0.png";
import streakdayLv1 from "assets/images/streakday/lv1.png";
import streakdayLv2 from "assets/images/streakday/lv2.png";
import streakdayLv3 from "assets/images/streakday/lv3.png";
import streakdayLv4 from "assets/images/streakday/lv4.png";






import workIcon from "assets/images/work-hard-arch.png";
import avaNotLogin from "assets/images/not-login.svg";
import { useState, useEffect } from "react";
import { Col, Row, Form, ProgressBar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/commons/PrimaryButton";
import Button from "components/commons/Button";
import { accountOperations } from "state/modules/account";

import MainModal from "components/commons/MainModal";
import i18next from "i18next";
// import PrimaryButton from "../../../commons/PrimaryButton";
function Achievements(props) {
  const { t } = useTranslation();
  const [showModal,setShowModal] = useState(false);
  const dispatch = useDispatch();
  const accountState = useSelector((state) => state.account);

  const {
    avatar,
    expiredDay,
    userToken,
    countProficiency,
    statistic,
    streakDay,
    countWord,
  } = accountState;
  const handleOpenLogin = () => {
    dispatch(accountOperations.updateState({ isOpenLogin: true }));
  };
  const handleOpenRegister = () => {
    dispatch(accountOperations.updateState({ isOpenRegister: true }));
  };
  const getLevelOfNotebook = (countProficiency) => {
    const countWord = countProficiency.data
    switch (true) {
      case countWord < 700:
        return notebookLv1;
      case countWord >= 700 && countWord < 2500:
        return notebookLv2;
      case countWord >= 2500 && countWord < 10000:
        return notebookLv3;
      case countWord >= 10000:
        return notebookLv4;
      default:
        return notebookLv1;
    }
  };
  const getLevelOfMemo = (statistic) => {
    
    let countWord = 0;
    statistic.forEach(item => {
      if (item.proficiency === 4 || item.proficiency === 5) {
        countWord += item.count
      }
    })
    switch (true) {
      case countWord < 700:
        return trophyLv1;
      case countWord >= 700 && countWord < 2500:
        return trophyLv2;
      case countWord >= 2500 && countWord < 10000:
        return trophyLv3;
      case countWord >= 10000 && countWord < 50000:
        return trophyLv4;
      case countWord >= 50000 && countWord < 100000:
        return trophyLv5;
      case countWord >= 100000:
        return trophyLv6;
      default:
        return trophyLv1;
    }
  };
  const getLevelOfSteak = (streakDay) => {
    let countStreak = streakDay.data;
    switch (true) {
      case countStreak < 5:
        return streakdayLv0;
      case countStreak >= 5 && countStreak < 25:
        return streakdayLv1;
      case countStreak >= 25 && countStreak < 100:
        return streakdayLv2;
      case countStreak >= 100 && countStreak < 500:
        return streakdayLv3;
      case countStreak >= 500:
        return streakdayLv4;
      default:
        return streakdayLv0;
    }
  };
  return (
    <div className="general-page-container">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="general-title-wrapper" onClick={props.onClose}>
            <img src={closeIcon} alt="close-icon" className="page-close-icon" />
            <p className="page-title">{t("dashboard.achievements")}</p>
          </div>

          <div className="user-info-wrapper">
            <div className="avatar-wrapper">
              <div
              // className={`user-avatar ${expiredDay ? "paid-bg" : "free-bg"}`}
              >
                {userToken ? (
                  <img
                    src={avatar ? avatar : defaultAva}
                    alt="avatar"
                    className={`user-avatar ${
                      expiredDay ? "paid-bg" : "free-bg"
                    }`}
                  />
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
          </div>
          {!userToken && (
            <div className="not-login-wrapper">
              <p>{t("info.messageLogin")}</p>
              <PrimaryButton
                className="not-login-btn"
                onClick={handleOpenLogin}
              >
                {t("info.login")}
              </PrimaryButton>
              <Button onClick={handleOpenRegister} className="not-login-btn">
                {t("info.createAcc")}
              </Button>
            </div>
          )}
          {userToken && (
            <>
              <div className="achievements-context">
                <div className="achievements-item">
                  <img
                    src={getLevelOfNotebook(countProficiency)}
                    alt="notebook"
                    className="notebook-icon achievement-icon"
                  />
                  <div className="achievements-title">
                    <h5>{t("learn.levelNotebook")}</h5>
                    <p>
                      {countProficiency.data}/{countProficiency.next_level}{" "}
                      {t("dashboard.words")}
                    </p>
                    <ProgressBar
                      now={Math.floor(
                        (countProficiency.data / countProficiency.next_level) *
                          100
                      )}
                    />
                  </div>
                </div>
                <div className="achievements-item">
                  <img
                    src={getLevelOfMemo(statistic)}
                    alt="memoIcon"
                    className="memo-icon achievement-icon"
                  />
                  <div className="achievements-title">
                    <h5>{t("learn.levelMemo")}</h5>
                    <p>
                      {countWord.data}/{countWord.next_level}{" "}
                      {t("dashboard.words")}
                    </p>
                    <ProgressBar
                      now={Math.floor(
                        (countWord.data / countWord.next_level) * 100
                      )}
                    />
                  </div>
                </div>
                <div className="achievements-item">
                  <img
                    src={getLevelOfSteak(streakDay)}
                    alt="workIcon"
                    className="workIcon achievement-icon"
                  />
                  <div className="achievements-title">
                    <h5>{t("learn.learnHard")}</h5>
                    <p className="continuous-days">
                      {streakDay.data} {t("learn.continueDays")}
                    </p>
                    {/* <ProgressBar now={10} /> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
      <MainModal
        mascot={mochiModal}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <div className="notify-wrapper">
          <p>
            <strong>{t("dashboard.activeSuccess")}</strong>
          </p>
          <PrimaryButton
            className="notify-btn"
            onClick={() => setShowModal(false)}
          >
            {t("general.learn")}
          </PrimaryButton>
        </div>
      </MainModal>
    </div>
  );
}

export default Achievements;
const SettingItems = (props) => {
  return (
    <div className="acc-settings-item" onClick={props.onClick}>
      <img src={props.image} alt="icon" />
      <p>{props.title}</p>
    </div>
  );
};
