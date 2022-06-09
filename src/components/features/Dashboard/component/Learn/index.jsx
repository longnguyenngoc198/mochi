/*global chrome*/

import "./index.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Outlet } from "react-router-dom";
import ListCourse from "../../../ListCourse";
import mochiMascot from "../../../../../assets/Mochi-thong-bao.png";
import ReactGA from "react-ga";
import { getToken } from "firebase/messaging";
import { messaging } from "firebase-config";

import PrimaryButton from "../../../../commons/PrimaryButton";
import { LANGUAGE_VN, LANGUAGE_UK } from "../../../helpers.js";
import { learnOperations } from "../../../../../state/modules/learn";
import { useDispatch, useSelector } from "react-redux";
import ImgMochiHuongDan from "../../../../commons/images/MochiHuongDan.png";
import iconBookShelf from "./images/bookshelf.png";
import iconNext from "./images/iconNext.png";
import clickAudio from "components/commons/audio/Dashboard/click.mp3";
import { useTranslation } from "react-i18next";
import GameLearn from "components/features/GameLearn";
import { accountOperations } from "state/modules/account";
import MainModal from "../../../../commons/MainModal";

function Learn() {
  const audioClickRef = useRef();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const learnState = useSelector((state) => state.learn);
  const accountState = useSelector((state) => state.account);
  const { dayExpire, userToken } = useSelector((state) => state.account);
  const idCourseActive = window.localStorage.getItem("id_course_active");
  const [showNotifyModal, setShowNotifyModal] = useState(window.localStorage.getItem("showModalNotify") == null ? true : false);

  const titleCourseActive = window.localStorage.getItem("title_course_active");
  const [isShowModalListCourse, setIsShowModalListCourse] = useState(
    idCourseActive == null
  );
  const initFilters = {
    page: 1,
    offset: 20,
  };
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    if (learnState.course_id !== null && filters.page !== 1) {
      dispatch(
        learnOperations.fetchListLesson(
          { course_id: learnState.course_id, ...filters },
          learnState.titleCourseActive,
          "loadMore"
        )
      );
    }
  }, [filters]);
  useEffect(() => {
    if (idCourseActive !== null) {
      dispatch(
        learnOperations.fetchListLesson(
          { course_id: idCourseActive, ...initFilters },
          titleCourseActive,
          "switchCourse"
        )
      );
    }
  }, []);

  const handleScroll = (e, page) => {
    const bottom =
      (e.target.scrollHeight - e.target.scrollTop - 50) < e.target.clientHeight;
    if (bottom && learnState.paginationLesson.total > learnState.listLesson.length) {
      setFilters({ ...filters, page: page + 1 });
    }
  };
 console.log({ dayExpire });
  const handleOpenLesson = (lessonId) => {
    if(!accountState.userToken){
      dispatch(accountOperations.updateState({isOpenLogin: true}));
      return false
    }
    handlePlayAudio();

    if (dayExpire <= 0 && dayExpire !== null && userToken) {
      dispatch(accountOperations.updateState({ isOpenExpired: true }));
    } else {
      dispatch(
        learnOperations.updateState({
          currentLesson: lessonId,
          currentCourse: learnState.course_id,
        })
      );
      dispatch(
        learnOperations.fetchListQuestions(
          {
            lesson_id: lessonId,
          },
          (status) => {
            if (status) {
              const timeStart = new Date().getTime();
              dispatch(
                learnOperations.updateState({
                  openGameLearn: true,
                  gameLoading: false,
                  timeStart: timeStart,
                })
              );
            }
          }
        )
      );
    }
  };

  const handlePlayAudio = useCallback(() => {
    audioClickRef.current.play();
  }, []);
  const changeListMetaTag = () => {
    const title = window.MC_LANG === 'vi' ?
      'Danh sách khoá học tiếng Nhật của MochiMochi - kanji.mochidemy.com' :
      'All MochiMochi Japanese courses - Learn Kanji with kanji.mochidemy.com'
    const description =
      window.MC_LANG === "vi"
        ? "Khám phá các khoá học của MochiMochi - Learn Kanji"
        : "Let's explore all MochiMochi Kanji courses";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);
          document.querySelector("title").innerText = title;
  }
  const changeHomeMetaTag = () => {
    const title =
      window.MC_LANG === "vi"
        ? "Kanji.mochidemy.com - Học từ vựng Tiếng Nhật và Kanji với MochiMochi website"
        : "kanji.mochidemy.com - Learn Japanese Vocabulary and Kanji - MochiMochi Website";
    const description =
      window.MC_LANG === "vi"
        ? "Học Kanji và từ vựng tiếng Nhật dễ dàng hơn với MochiMochi! Chinh phục 1000 từ vựng trong 1 tháng chỉ với 15' học mỗi ngày"
        : "MochiMochi - The most joyful Kanji & Japanese vocabulary learning website, helping you memorize 1000 Kanji in just 1 month.";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);
    document.querySelector("title").innerText = title;
  };

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
  console.log("total_page", learnState.paginationLesson.total);
  console.log("filters_page", learnState.listLesson.length);
  return (
    <>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="main-content-col">
          <div className="main-content-container">
            <div className="learn_content_box">
              <div
                className="list_course__item-header"
                style={{ zIndex: 0, width: "300px", marginBottom: "30px" }}
              >
                <div className="list_course__item-header-left"></div>
                <div className="list_course__item-header-center">
                  {learnState.titleCourseActive}
                </div>
                <div className="list_course__item-header-right"></div>
              </div>
              {!isShowModalListCourse ? (
                <div
                  className="learn__course_detail"
                  onScroll={(e) => handleScroll(e, filters.page)}
                >
                  {learnState.listLesson.map((lesson, index) => (
                    <div
                      className="learn__course_detail_item animate__animated animate__fadeInDown"
                      key={index}
                      onClick={() => {
                        if(index < 3 && !accountState.expiredDay){
                          handleOpenLesson(lesson.id)
                        }
                      }}
                    >
                      <div className="learn__course_detail_item_avatar_box">
                        <img
                          className="learn__course_detail_item_avatar"
                          src={lesson.image}
                          alt="learn"
                        ></img>
                      </div>
                      <div className="learn__course_detail_item_content">
                        <p className="learn__course_detail_item_content_title">
                          {window.MC_LANG == "en"
                            ? lesson.en_title
                            : lesson.title}
                        </p>
                        <p className="learn__course_detail_item_content_description">
                          {window.MC_LANG == "en"
                            ? lesson.en_description
                            : lesson.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {learnState.paginationLesson.total <=  learnState.listLesson.length && (
                    <div
                      style={{
                        margin: "30px 0",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img src={ImgMochiHuongDan}></img>
                    </div>
                  )}
                </div>
              ) : (
                <ListCourse
                  languageVN={LANGUAGE_VN}
                  languageUK={LANGUAGE_UK}
                    onClose={() => {
                      setIsShowModalListCourse(false)
                      changeHomeMetaTag()
                    }}
                  initFilters={initFilters}
                  setFilters={setFilters}
                  handlePlayAudio={handlePlayAudio}
                />
              )}
            </div>
          </div>
        </Col>
        <Col
          md={{ span: 2, offset: 0 }}
          style={{ margin: "0 auto", padding: 0, minWidth: "250px" }}
        >
          <div
            className="learn__menu-course"
            onClick={() => {
              handlePlayAudio();
              setIsShowModalListCourse(true);
              changeListMetaTag();
            }}
          >
            <img src={iconBookShelf} className="icon_book_shelt"></img>
            <p
              style={{ margin: "0 10px", fontWeight: "bold", fontSize: "14px" }}
            >
              {t("general.coursesList")}
            </p>
            <img src={iconNext} className="icon_next"></img>
          </div>
        </Col>
      </Row>

      <MainModal
        mascot={mochiMascot}
        show={showNotifyModal}
        handleClose={() => {audioClickRef.current.play();setShowNotifyModal(false); window.localStorage.setItem("showModalNotify", "0")}}
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

export default Learn;
