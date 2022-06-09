/*global chrome*/

import "./index.scss";

import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import MoChiVoTayImg from "../../images/Mochi-vo-tay.gif";
import PrimaryButton from "components/commons/PrimaryButton";
import { reviewOperations } from "state/modules/review";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

import { useDispatch, useSelector } from "react-redux";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Mobilization(props) {
  const dispatch = useDispatch();
  const audioClickRef = useRef();
  const { t } = useTranslation();
  const audioRef = useRef();
  const [showTrans, setShowTrans] = useState(false);
  const [showSpeaker, setShowSpeaker] = useState("");
  return (
    <div className="game-1-container">
      <div className="game-content">
        <div className="card-wrapper" style={{ height: "80vh", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <p style={{fontWeight:"bold"}}>{t('learn.keepGoing')}</p>
          <img style={{width: "240px", marginTop:"20px"}} src={MoChiVoTayImg}></img>
          <div style={{width:"200px", position: "absolute", bottom:20}}>
            <PrimaryButton style={{textAlign:"center"}} 
              onClick={() => {
                audioClickRef.current.play();
                setTimeout(()=>{
                  dispatch(
                    reviewOperations.updateState({ showMochiDongVien: false })
                  );
                }, 500)
            }}>{t("learn.continue")}
            </PrimaryButton>
            </div>
        </div>
      </div>
      <audio src={clickAudio} ref={audioClickRef}></audio>
    </div>
  );
}

export default Mobilization;
