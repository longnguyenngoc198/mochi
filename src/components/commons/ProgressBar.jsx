/*global chrome*/

import "./index.scss";
import { Row,Col } from "react-bootstrap";
import iconExit from "assets/images/icon_exit.png"
import mascot from "assets/images/out.png";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import mochiProgress from "assets/images/progress_mochi.png";
import { useEffect, useRef, useState } from "react";
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
const ORIGIN = process.env.REACT_APP_ORIGIN;
function ProgressBar(props) {
  const audioClickRef = useRef();
  const { t } = useTranslation();
  const [showModal,setShowModal] = useState(false)
  const [grow, setGrow] = useState('');
  
  const trackRef = useRef()
  const getWidth = (currentPage,totalPage) => {
      return Math.floor(currentPage/totalPage* 100)
  }
  useEffect(() => {
    setGrow(`
  @keyframes react-grow-${props.currentPage} {
      0%   { width: ${getWidth(props.currentPage, props.totalPage) * 0}%; }
      25%   { width: ${getWidth(props.currentPage, props.totalPage) * 0.25}%; }
      50%   { width: ${getWidth(props.currentPage, props.totalPage) * 0.5}%; }
      75%   { width: ${getWidth(props.currentPage, props.totalPage) * 0.75}%; }
      100%   { width: ${getWidth(props.currentPage, props.totalPage) * 1}%; }
    }
  `);
  }, [props]);
  return (
    <div className="game-progressbar-container">
      <img
        src={iconExit}
        alt="exit"
        className="game-exit-icon"
        onClick={() => setShowModal(true)}
      />
      <div className="game-progressbar-wrapper">
        <style children={grow} />
        <div
          className="game-progressbar-bar"
          style={{
            width: getWidth(props.currentPage, props.totalPage) + "%",
            animationDuration: "0.5s",
            animationIterationCount: 1,
            animationName: "react-grow-" + props.currentPage,
            animationTimingFunction: "linear",
          }}
        >
          <img src={mochiProgress} alt="exit" className="progress-mascot" />
        </div>
        <div className="game-progressbar-track" ref={trackRef}></div>
      </div>
      <div className="progress-bar-modal">
        <MainModal
          mascot={mascot}
          show={showModal}
          handleClose={() => {audioClickRef.current.play();setShowModal(false)}}
          className="progress-bar-modal"
        >
          <div className="notify-wrapper">
            <p>
              <strong>{t("learn.finishLesson")}</strong>
            </p>
            <PrimaryButton
              className="notify-btn"
              onClick={() => {
                audioClickRef.current.play();
                setShowModal(false)}
              }
            >
              {t("learn.continueLearn")}
            </PrimaryButton>
            <SecondaryButton onClick={()=>{ audioClickRef.current.play();setTimeout(()=>{props.onClose()},500)}} className="exit-btn">
              {t("learn.exit")}
            </SecondaryButton>
          </div>
        </MainModal>
      </div>
      <audio src={clickAudio} ref={audioClickRef}></audio>
    </div>
  );
}

export default ProgressBar;
