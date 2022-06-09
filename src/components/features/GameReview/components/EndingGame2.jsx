/*global chrome*/

import "../index.scss";
import { Row, Col, ProgressBar } from "react-bootstrap";
import goldStar1 from "assets/images/star/Gold1.gif";
import goldStar2 from "assets/images/star/Gold2.gif";
import goldStar3 from "assets/images/star/Gold3.gif";
import goldStar4 from "assets/images/star/Gold4.gif";
import goldStar5 from "assets/images/star/Gold5.gif";
import silverStar1 from "assets/images/star/Silver1.gif";
import silverStar2 from "assets/images/star/Silver2.gif";
import silverStar3 from "assets/images/star/Silver3.gif";
import silverStar4 from "assets/images/star/Silver4.gif";
import silverStar5 from "assets/images/star/Silver5.gif";
import greenStar1 from "assets/images/star/green1.gif";
import greenStar2 from "assets/images/star/green2.gif";
import greenStar3 from "assets/images/star/green3.gif";
import greenStar4 from "assets/images/star/green4.gif";
import greenStar5 from "assets/images/star/green5.gif";
import fillCircle from "assets/images/fill.png";
import streakdayIcon from "assets/images/streakday-icon.png";
import endingAudio from "assets/audio/ending_game_learn.mp3";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
import { accountOperations } from "state/modules/account";


import { learnOperations } from "state/modules/learn";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { reviewOperations } from "state/modules/review";
import { useDispatch, useSelector } from "react-redux";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function EndingGame2(props) {
  const audioClickRef = useRef();
  const dispatch = useDispatch();
  const isShowCountDown = props.isShowCountDown;
  const { listQuestion } = useSelector(
    (state) => state.learn
  );
  const reviewState = useSelector((state) => state.review);

  const { streakDay } = useSelector((state) => state.account);

  const { t } = useTranslation();
    const [star, setStar] = useState(silverStar1);

  useEffect(() => {
    let tempStar = null;
    switch (streakDay.current_level) {
      case 0:
        tempStar = silverStar1;
        break;
      case 1:
        tempStar = silverStar2;
        break;
      case 2:
        tempStar = silverStar3;
        break;
      case 3:
        tempStar = silverStar4;
        break;
      case 4:
        tempStar = silverStar5;
        break;
      case 5:
        tempStar = goldStar1;
        break;
      case 6:
        tempStar = goldStar2;
        break;
      case 7:
        tempStar = goldStar3;
        break;
      case 8:
        tempStar = goldStar4;
        break;
      case 9:
        tempStar = goldStar5;
        break;
      case 10:
        tempStar = greenStar1;
        break;
      case 11:
        tempStar = greenStar2;
        break;
      case 12:
        tempStar = greenStar3;
        break;
      case 13:
        tempStar = greenStar4;
        break;
      case 14:
        tempStar = greenStar5;
        break;
      default:
        tempStar = greenStar5;
        break;
    }
    setStar(tempStar);
  },[streakDay]);
  const handleContinue = () => {
    audioClickRef.current.play();
    if (isShowCountDown) {
      props.setStep(4)
    }
    else {
      setTimeout(() => {
        dispatch(reviewOperations.resetGame())
        dispatch(accountOperations.fetchWordStatistic());
        dispatch(reviewOperations.fetchReviewWords());
        dispatch(reviewOperations.updateState({ openEndingGame: false, listResultGame: [], openGameReview: false }));
      }, 500);
    }
  }
  return (
    <div className="ending-game-wrapper">
      <audio src={endingAudio} autoPlay={true} />

      <h5 className="ending-game3-title">
        {t("dashboard.learnContinuously") +
          " " +
          (Object.keys(streakDay).length > 0 ? streakDay.data : 0) +
          " " +
          t("dashboard.days")}
      </h5>
      <img
        src={streakdayIcon}
        alt="streakdayIcon"
        className="ending-game3-image"
      />
      <img src={star} alt="star1" className="ending-game-star" />
      <div className="ending-game3-progress">
        <ProgressBar now={streakDay.data / streakDay.next_level * 100} />
      </div>
      <p className="ending-game-message">
        {t("general.continueLearn")}
      </p>
      <PrimaryButton className="ending-game-btn" onClick={handleContinue}>
        {t("learn.continue")}
      </PrimaryButton>
      <audio src={clickAudio} ref={audioClickRef}></audio>
    </div>
  );
}

export default EndingGame2;
