/*global chrome*/

import "../index.scss";
import endingAudio from "assets/audio/ending_game_learn.mp3";
import ProcessCircle from "./ProcessCircle";
import { reviewOperations } from "state/modules/review";
import { useTranslation } from "react-i18next";
import { useEffect, useCallback, useState, useRef } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import IconTickImg from "components/commons/images/iconTick.svg";
import IconWrongImg from "components/commons/images/iconWrong.svg";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
import EndGameMp3 from "components/commons/audio/Ending_game_show_result.mp3"
import { accountOperations } from "state/modules/account";
import { useDispatch, useSelector } from "react-redux";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function EndingGame1(props) {
  const dispatch = useDispatch();
  const audioClickRef = useRef();
  const reviewState = useSelector((state) => state.review);

  const listAnswerRight = reviewState["listResultGame"].filter(e => e.isCorrect == true);
  const checkPercent = (
    (listAnswerRight.length /
      reviewState["listResultGame"].length) *
    100
  );
  const percent = checkPercent == 0 ? 0 : checkPercent.toFixed(2);
  const { t } = useTranslation();
  const [textTitle, setTitle] = useState(t("general.wonderful"));
  const [showTitle, setShowTitle] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (percent < 50) {
      setTitle(t("other.youCan"));
      return;
    } else if (percent >= 50 && percent <= 80) {
      setTitle(t("other.keepGoing"));
      return;
    } else if (percent > 80) {
      setTitle(t("general.wonderful"));
      return;
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setShowTitle(true)
      delayShow(setShowProcess, () => {
        delayShow(setShowDescription, () => {
          delayShow(setShowResult, () => {
            delayShow(setShowBtn);
          });
        });
      });
    }, 500);
  }, []);

  const delayShow = useCallback((setShow, cb = () => {}) => {
    setTimeout(() => {
      console.log(4534534534534);
      setShow(true)
      cb();
    }, 500);
  });

  return (
    <div className="ending-game-wrapper">
      <audio src={endingAudio} autoPlay={true} />
      {showTitle && (
      <h5
        id="game1-review-title"
        className="ending-game-title animate__animated animate__fadeIn"
      >
        {textTitle}
      </h5>
      )}
    {showProcess && (
      <ProcessCircle
        percent={percent}
        className="game1-process-circle animate__animated animate__fadeIn"
        
      />
    )}
    {showDescription && (

      <h5
        className="ending-game-title animate__animated animate__fadeIn"
        id="game1-review-description"
      >
        {t("general.youAnswerCorrect") +
          " " +
          listAnswerRight.length +
          "/" +
          reviewState["listResultGame"].length +
          " " +
          t("general.sentences")}
      </h5>
    )}

{showResult && (

      <div
        className="ending-game__box-list-result-game-1 animate__animated animate__fadeIn"
      >
        {reviewState.listResultGame.map((element, index) => (
          <div
            style={{ display: "flex", textAlign: "left", margin: "10px 0" }}
            key={index}
          >
            {element?.isCorrect ? (
              <img src={IconTickImg} style={{ width: "25px" }}></img>
            ) : (
              <img src={IconWrongImg} style={{ width: "25px" }}></img>
            )}
            <p style={{ width: "50%", margin: "0 15px" }}>{element.hint}</p>
            <p style={{ width: "50%", margin: "0 15px" }}>
              {window.MC_LANG == "vn"
                ? element.sentence_vi
                : element.sentence_en}
            </p>
          </div>
        ))}
      </div>
)}

{showBtn && (

      <PrimaryButton
        className="ending-game-btn ending-game1-review-btn animate__animated animate__fadeIn"
        onClick={() => {
          audioClickRef.current.play();
          setTimeout(() => {
            props.setStep(2);
            dispatch(accountOperations.fetchWordStatistic());
            dispatch(reviewOperations.fetchReviewWords());
            dispatch(reviewOperations.resetGame())
            dispatch(reviewOperations.updateState({ openEndingGame: false, listResultGame: [], openGameReview: false }));
          }, 500);
        }}
      >
        {t("learn.continue")}
      </PrimaryButton>
)}
      <audio src={clickAudio} ref={audioClickRef}></audio>
      <audio src={EndGameMp3} autoPlay={true}></audio>
    </div>
  );
}

export default EndingGame1;
