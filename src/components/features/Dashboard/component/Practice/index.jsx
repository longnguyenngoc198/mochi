/*global chrome*/

import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/commons/PrimaryButton";
import NotReview from "./NotReview";
import Countdown, { zeroPad } from "react-countdown";
import hourGlassIcon from "../../../../../assets/hourglass.png";
import warningIcon from "../../../../../assets/warning.png";
import mochiMascot from "../../../../../assets/Mochi-thong-bao.png";
import bellIcon from "../../../../../assets/images/alarm.svg";
import MainModal from "../../../../commons/MainModal";
import SecondaryButton from "../../../../commons/SecondaryButton";
import { reviewOperations } from "state/modules/review";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
import bannerVi from "assets/images/BannerVN.svg";
import bannerEn from "assets/images/BannerEN.svg";
import { getToken } from "firebase/messaging";
import { messaging } from "firebase-config";
import { accountOperations } from "state/modules/account";
import ReactGA from "react-ga";
const ORIGIN = window.location.origin;
function Practice() {
  const audioClickRef = useRef();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const accountState = useSelector((state) => state.account);
  const {
    userToken,
    totalWord,
    statistic,
    reviewCount,
    reviewTime,
    streakDay,
    dayExpire,
    expiredDay,
  } = accountState;
  const reviewTimeObject = new Date(reviewTime);
  const now = new Date();
  const isShowCountDown = reviewTimeObject.getTime() - now.getTime() > 0;
  const [showNotifyModal, setShowNotifyModal] = useState(window.localStorage.getItem("showModalNotify") == null ? true : false);

  const getMaxCount = (list) => {
    const maxCount = list.reduce(function (prev, current) {
      return prev.count > current.count ? prev : current;
    });
    return maxCount;
  };
  const renderer = ({ hours, minutes, seconds }) => (
    <span>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  const handleAccessNotify = () => {
    window.localStorage.setItem("showModalNotify", "0");
    audioClickRef.current.play();
    ReactGA.event({
      category: "welcome_screen",
      action: "click_allow_notice",
      label: "notification_allow",
    });
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      const notification = new Notification("Notification from Mochien");
      
      notification.onshow = () => {
        getToken(messaging, {
          vapidKey: process.env.REACT_APP_KEY_FIREBASE,
        })
          .then((currentToken) => {
            console.log({ currentToken });
            dispatch(
              accountOperations.addDevice({
                device: currentToken,
                lang: "vn",
                device_type: 3,
              })
            );
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
          });
      };
      
      notification.onclick = function (event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        console.log({ event });
        
      };
      setShowNotifyModal(false);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          const notification = new Notification("Notification from Mochien");
          notification.onshow = () => {
            getToken(messaging, {
              vapidKey: process.env.REACT_APP_KEY_FIREBASE,
            })
              .then((currentToken) => {
                console.log({ currentToken });
                dispatch(
                  accountOperations.addDevice({
                    device: currentToken,
                    lang: "vn",
                    device_type: 3,
                  })
                );
              })
              .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
                // ...
              });
          };
          notification.onclick = function (event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            console.log({ event });
          };
          setShowNotifyModal(false);
        }
      });
    }
  };
  const baseName =
    "https://" +
    (ORIGIN.includes("localhost")
      ? process.env.REACT_APP_ORIGIN +
        "/" +
        window.location.pathname.split("/")[1]
      : process.env.REACT_APP_ORIGIN);
  return (
    <>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="main-content-col">
          <div className="main-content-container">
            <div className="not-review-banner">
              {userToken &&
                !expiredDay && (
                  <img
                    src={window.MC_LANG === "vi" ? bannerVi : bannerEn}
                    alt="icon"
                    onClick={() => {
                      window.open(
                        window.MC_LANG === "vi"
                          ? "https://mochidemy.com/mochien-web-vi-LP/"
                          : "https://mochidemy.com/mochien-web-global-LP/",
                        "_blank"
                      );
                    }}
                  />
                )}
            </div>
            {totalWord == 0 && <NotReview userToken={userToken} />}
            {totalWord > 0 && (
              <div>
                {statistic?.length && (
                  <div className="chart-wrapper">
                    <div className="vertical-wrapper">
                      {statistic.map((item) => {
                        const maxHeight = 250;
                        const maxCount = getMaxCount(statistic);
                        let itemCountRate = 0;
                        if (item.proficiency == maxCount.proficiency) {
                          itemCountRate = maxHeight;
                        } else {
                          itemCountRate =
                            (item.count / maxCount.count) * maxHeight;
                        }
                        return (
                          <div
                            key={item.proficiency}
                            className={`vertical-bar color-${item.proficiency} animate__slideInUp`}
                            style={{ height: itemCountRate }}
                          >
                            <p
                              className={`count-bar ${
                                window.MC_LANG === "en" ? "en" : ""
                              }`}
                            >
                              {item.count} {t("dashboard.words")}
                            </p>
                            <p className="label-bar">{item.proficiency}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="horizon-bar"></div>
                    <div className="label-wrapper"></div>
                    <p className="total-review-word">
                      {t("dashboard.wordToReview")}: {reviewCount}{" "}
                      {t("dashboard.words")}
                    </p>
                    {isShowCountDown ? (
                      <div className="countdown-wrapper">
                        <img
                          src={hourGlassIcon}
                          alt="hourglass"
                          className="countdown-hourglass"
                        />
                        <Countdown
                          date={reviewTimeObject}
                          daysInHours={false}
                          renderer={renderer}
                        />
                        <img
                          src={warningIcon}
                          alt="warningIcon"
                          className="countdown-warning"
                        />
                      </div>
                    ) : (
                      <PrimaryButton
                        className="review-now-btn"
                        onClick={() => {
                          audioClickRef.current.play();
                          if (
                            dayExpire <= 0 &&
                            dayExpire !== null &&
                            userToken
                          ) {
                            dispatch(
                              accountOperations.updateState({
                                isOpenExpired: true,
                              })
                            );
                          } else {
                            setTimeout(() => {
                              dispatch(
                                reviewOperations.updateShowGameReview(true)
                              );
                            }, 500);
                          }
                        }}
                      >
                        {t("dashboard.reviewNow").toUpperCase()}
                      </PrimaryButton>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
        <Col md={3}>
          {userToken && (
            <div className="badge-wrapper">
              <div
                className="badge-total-wrapper"
                style={{
                  backgroundImage:
                    'url("' + baseName + '/images/totalDays.svg")',
                }}
              >
                {/* <img src={totalDayImg} alt="total-day" /> */}
                <div className="badge-total-text">
                  <p className="badge-total-text-first">
                    {t("dashboard.youLearned")}
                  </p>
                  <p className="badge-total-text-second">
                    {totalWord} {t("dashboard.words")}
                  </p>
                </div>
              </div>

              <div
                className="badge-steak-wrapper"
                style={{
                  backgroundImage:
                    'url("' + baseName + '/images/streakday.svg")',
                }}
              >
                {/* <img src={steakDayImg} alt="steak-day" /> */}
                <div className="badge-steak-text">
                  <p className="badge-steak-text-first">
                    {t("dashboard.learnContinuously")}
                  </p>
                  <p className="badge-steak-text-second">
                    {streakDay.data} {t("dashboard.days")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="notify-btn-wrapper">
            <SecondaryButton
              className="notify-btn"
              onClick={() => {
                audioClickRef.current.play();
                setShowNotifyModal(true);
              }}
            >
              <img src={bellIcon} alt="bell" />
              <p>{t("dashboard.turnOnGoldenTime")}</p>
            </SecondaryButton>
          </div>
        </Col>
      </Row>

      <MainModal
        mascot={mochiMascot}
        show={showNotifyModal}
        handleClose={() => {
          audioClickRef.current.play();
          setShowNotifyModal(false);
          window.localStorage.setItem("showModalNotify", "0");
        }}
      >
        <div className="notify-content">
          <p>{t("general.askGoldenTime")}</p>
          <PrimaryButton onClick={handleAccessNotify}>
            {t("general.allowNotification")}
          </PrimaryButton>
        </div>
      </MainModal>
      <audio src={clickAudio} ref={audioClickRef}></audio>
    </>
  );
}

export default Practice;
