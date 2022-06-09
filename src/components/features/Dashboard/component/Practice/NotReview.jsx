
import mochiIcon from "assets/Mochi1.png";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
import "./index.scss";
import { useState, useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import PrimaryButton from "components/commons/PrimaryButton";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

function NotLoginReview(props) {
  const audioRef = useRef()
  const { t } = useTranslation();
  const navigate = useNavigate()
  const accountState = useSelector((state) => state.account);
  const [selectDefaultDict, setSelectDefaultDict] = useState();

  return (
    <div className="not-review-wrapper">
     
      <div className="not-review-content">
        <img src={mochiIcon} alt="mochi" className="not-review-mochi-icon" />
        <p className="not-review-title">{t("dashboard.activeGoldenTime")}</p>
        <PrimaryButton
          onClick={() => {
            audioRef.current.play();
            setTimeout(() => {navigate("/learn")},100)
          }}
        >
          {t("dashboard.learnNewWord")}
        </PrimaryButton>
      </div>
      <audio src={clickAudio} ref={audioRef}></audio>
    </div>
  );
}

export default NotLoginReview;
