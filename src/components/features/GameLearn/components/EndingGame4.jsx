/*global chrome*/

import "../index.scss";
import { Row, Col, ProgressBar } from "react-bootstrap";
import Countdown, { zeroPad } from "react-countdown";
import star1 from "assets//images/star/Gold1.gif";
import fillCircle from "assets/images/fill.png";
import seeYouGif from "assets/images/seeyou.gif"
import hourGlassIcon from "assets/hourglass.png";
import warningIcon from "assets/warning.png";
import { learnOperations } from "state/modules/learn";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Intro from "components/features/PageIntro/Animation/Intro"
const ORIGIN = process.env.REACT_APP_ORIGIN;
function EndingGame4(props) {
  const navigate = useNavigate
  const dispatch = useDispatch();
  const word = props.word;
  const { listQuestion } = useSelector(
    (state) => state.learn
  );
  const { reviewTime, reviewCount } = useSelector((state) => state.account);
  console.log({ reviewTime });
  // const reviewTimeObject = new Date(reviewTime);
    // const reviewTimeObject = new Date("2022-05-24T18:20:09+07:00");
  const { t } = useTranslation();
  const [showIntro,setShowIntro] = useState(false);
  const renderer = ({ days, hours, minutes, seconds }) => (
    <span>
      {zeroPad(hours + days* 24)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
  const handleOpenLearn = () => {
    window.location.href = 'https://' + process.env.REACT_APP_ORIGIN + '/learn'
  }
  return (
    <div className="ending-game-wrapper ending-game4">
      <h5 className="ending-game4-title">
        {t("general.seeAtGT")}
        <span>{t("general.goldenTime")}</span>
      </h5>
      <img src={seeYouGif} alt="see-you-again" className="ending-game4-image" />
      <p className="ending-game-message">
        {t("dashboard.wordToReview") +
          ": " +
          reviewCount +
          " " +
          t("dashboard.words")}
      </p>
      <div className="countdown-wrapper" onClick={() => setShowIntro(true)}>
        <img
          src={hourGlassIcon}
          alt="hourglass"
          className="countdown-hourglass"
        />
        <Countdown date={reviewTime} daysInHours={false} renderer={renderer} />
        <img
          src={warningIcon}
          alt="warningIcon"
          className="countdown-warning"
        />
      </div>
      <PrimaryButton className="ending-game-btn" onClick={handleOpenLearn}>
        {t("general.learn")}
      </PrimaryButton>

      {showIntro && (
        <Intro
          language={window.MC_LANG}
          languageVN="vi"
          className="intro-animation"
        />
      )}
    </div>
  );
}

export default EndingGame4;
