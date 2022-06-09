/*global chrome*/

import "./index.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import imageMochiSotay from "../../../../commons/images/MochiSotay.png"
import { useTranslation } from "react-i18next";
import "./index.css"
import PrimaryButton from "../../../../commons/PrimaryButton";
import { LANGUAGE_VN } from "../../../helpers.js"
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

function Community() {
  const audioRef = useRef();
  const { t } = useTranslation();
  let navigate = useNavigate();

  const handleOpenGroup = useCallback(()=>{
    handlePlayAudio();
    if(window.MC_LANG == LANGUAGE_VN){
      window.open('https://www.facebook.com/groups/MochiMochi.hoctiengNhat')
    }else{
      window.open('https://www.facebook.com/groups/mochimochi.learnkanji')
    }
  })

  const handlePlayAudio = useCallback(()=>{
    audioRef.current.play();
  })

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }} className="main-content-col">
        <div className="main-content-container">
          <div className="community_container">
            <img style={{ width: "185px" }} src={imageMochiSotay}></img>
            <p>{t("general.joinGroup")}</p>
            <PrimaryButton className="slim" onClick={handleOpenGroup}>
              {t("general.joinNow")}
            </PrimaryButton>
          </div>
        </div>
      </Col>
      <audio src={clickAudio} ref={audioRef}></audio>
    </Row>
  );
}

export default Community;
