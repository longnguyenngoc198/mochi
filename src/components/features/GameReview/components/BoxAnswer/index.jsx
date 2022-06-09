/*global chrome*/

import "./index.scss";
import Draggable from 'react-draggable';
import { Row, Col } from "react-bootstrap";
import MainModal from "components/commons/MainModal";
import feedbackIcon from "assets/images/feedback.png";
import mascot from "assets/MochiNotFound.png";
import fillCircle from "assets/images/fill.png";
import emptyCircle from "assets/images/empty.png";
import AudioImg from "../../images/audio.svg";
import TranslateImg from "../../images/translate.svg";
import InforImg from "../../images/infor.svg";
import { learnOperations } from "state/modules/learn";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import speakerGif from "assets/images/speaker.gif";
import speaker from "assets/images/audio_icon.png";
import transIcon from "assets/images/trans_icon.png";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

import { useDispatch, useSelector } from "react-redux";
const ROOT_LINK = process.env.REACT_APP_ROOT_LINK;
const ORIGIN = process.env.REACT_APP_ORIGIN;
function BoxAnswer(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const audioRef = useRef();
  const audioClickRef = useRef();
  const [showTrans, setShowTrans] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSpeaker, setShowSpeaker] = useState("");

  const handleInputFeedback = (e) => {
    const value = e.target.value.trim();
    setFeedbackContent(value);
  };

  const handleChangeFeedback = (e) => {
    const value = e.target.value.trim();
    setFeedbackContent(value);
  };

  const handleSendError = () => {
    audioClickRef.current.play();
    dispatch(
      learnOperations.sendError(
        {
          course: Number(props.data.course_id),
          lesson: Number(props.data.lesson_id),
          content: feedbackContent,
          errors: [feedbackContent],
        },
        (status) => {
          setShowFeedback(false)
        }
      )
    );
  };

  const handleRenderValueHint = useCallback(() => {
    let result = props.data.hint.replace(
      props.data?.content,
      `<b>${props.data?.content}</b>`
    );
    return result.replace(
      props.data?.kanji,
      `<b>${props.data?.kanji}</b>`
    );
  });
  

  return (
    <div>
      <Draggable axis="y">
      <div
        className={
          props.isSuccess
            ? `box-answer modal-wrapper correct`
            : `box-answer modal-wrapper incorrect`
        }
      >
        <div className="word-modal-content">
          <p>{props.data?.content}</p>
          <p style={{ fontWeight: "bold", marginTop: "10px" }}>
            {props.data?.kanji}
          </p>
          <p style={{ marginTop: "10px" }}>
            {window.MC_LANG == "vn" ? props.data?.trans : props.data?.en_trans}
          </p>
              
          <div style={{ marginTop: "10px" }} dangerouslySetInnerHTML={{ __html: handleRenderValueHint() }} ></div>
          {showTrans && (
          <p style={{ marginTop: "10px" }}>
            {window.MC_LANG == "vn"
              ? props.data?.sentence_vi
              : props.data?.sentence_en}
          </p>
          )}
          <div style={{ marginTop: "10px" }} onClick={()=>setShowFeedback(true)}>
            <img
              src={InforImg}
              style={{ width: "22px", marginRight: "5px" }}
            ></img>
            {t("learn.report")}
          </div>
        </div>

        <div className="modal-action">
          {props.data.audio && (
            <div className="action-btn">
              <img
                src={showSpeaker ? speakerGif : speaker}
                alt="speaker"
                style={{ paddingBottom: 3 }}
                onClick={() => {
                  setShowSpeaker(true);
                  audioRef.current.play();
                  setTimeout(() => {
                    setShowSpeaker(false);
                  }, 2000);
                }}
              />
            </div>
          )}
          <div className="action-btn">
            <img
              src={transIcon}
              alt="transIcon"
              onClick={() => setShowTrans(!showTrans)}
            />
          </div>
        </div>
      </div>
      </Draggable>
      <audio src={ROOT_LINK + '/audios/question/' + props.data.audio} ref={audioRef} />


      {showFeedback && (
        <MainModal
          show={showFeedback}
          mascot={feedbackIcon}
          handleClose={() => setShowFeedback(false)}
          className="feedback-modal"
        >
          <p className="feedback-message">{t("learn.describeProblemPlease")}</p>
          <textarea
            className="feedback-content"
            placeholder={t("learn.describeDetail")}
            value={feedbackContent}
            onChange={(e) => handleInputFeedback(e)}
            onBlur={(e) => handleChangeFeedback(e)}
          ></textarea>
          <PrimaryButton
            onClick={handleSendError}
            disabled={feedbackContent === ""}
          >
            {t("learn.senMochi")}
          </PrimaryButton>
          <p className="feedback-cancel" onClick={() => setShowFeedback(false)}>
            {t("learn.cancel")}
          </p>
        </MainModal>
      )}
       <audio src={clickAudio} ref={audioClickRef}></audio>
    </div>
    // <div className={props.isSuccess ? "box-answer success" : "box-answer fail"}>
    //   <div>
    //     <p>{props.data?.content}</p>
    //     <p style={{fontWeight:"bold", marginTop:"10px"}}>{props.data?.kanji}</p>
    //     <p style={{marginTop:"10px"}}>{window.MC_LANG == 'vn' ? props.data?.trans : props.data?.en_trans}</p>
    //     <p style={{marginTop:"10px"}}>{props.data?.hint}</p>
    //     <p style={{marginTop:"10px"}}>{window.MC_LANG == 'vn' ? props.data?.sentence_vi : props.data?.sentence_en}</p>
    //     <div style={{marginTop:"10px"}}>
    //       <img src={InforImg} style={{width:"22px", marginRight:'5px'}}></img>
    //       {t('learn.report')}
    //     </div>
    //   </div>
    //   <div style={{marginLeft:"20px", width: "50px"}}>
    //       <img src={AudioImg} style={{width:"40px"}}></img>
    //       <img src={TranslateImg} style={{width:"40px", marginTop:"10px"}}></img>
    //   </div>
    // </div>
  );
}

export default BoxAnswer;
