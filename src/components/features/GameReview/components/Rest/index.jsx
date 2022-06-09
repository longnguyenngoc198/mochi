/*global chrome*/

import "./index.scss";

import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import MochiCauCaImg from "../../images/Mochi-cau-ca.gif";
import PrimaryButton from "components/commons/PrimaryButton";
import { reviewOperations } from "state/modules/review";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

import { useDispatch, } from "react-redux";
function Rest(props) {
  const audioClickRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowBtn(true);
    }, 5000);
  }, []);
  return (
    <div className="game-1-container">
      <div className="game-content">
        <div
          className="card-wrapper"
          style={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{t("general.relax")}</p>
          <img
            style={{ width: "240px", marginTop: "20px" }}
            src={MochiCauCaImg}
          ></img>
          {showBtn && (
            <div style={{ width: "200px", position: "absolute", bottom: 20 }}>
              <PrimaryButton
                style={{ textAlign: "center" }}
                onClick={() => {
                  audioClickRef.current.play();
                  setTimeout(()=>{
                    dispatch(
                      reviewOperations.updateState({ showMochiCauCa: false })
                    );
                  }, 500)
                  
                }}
              >
                {t("learn.continue")}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
      <audio src={clickAudio} ref={audioClickRef}></audio>
    </div>
  );
}

export default Rest;
