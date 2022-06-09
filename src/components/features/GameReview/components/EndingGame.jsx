/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import mascot from "assets/MochiNotFound.png";
import fillCircle from "assets/images/fill.png";
import emptyCircle from "assets/images/empty.png";
import { learnOperations } from "state/modules/learn";
import { accountOperations } from "state/modules/account";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import EndingGame1 from "./EndingGame1";
import EndingGame2 from "./EndingGame2";
import EndingGame3 from "./EndingGame3";
import EndingGame4 from "./EndingGame4";
import { getCookie } from "utils/helpers";
import { reviewOperations } from "state/modules/review";

const ORIGIN = process.env.REACT_APP_ORIGIN;
function EndingGame(props) {
  const dispatch = useDispatch();
  const word = props.word;
  const { currentLesson, currentCourse, listLearned, learnTime } = useSelector(
    (state) => state.learn
  );
  const { reviewTime } = useSelector((state) => state.account);
  const reviewTimeObject = new Date(reviewTime);
  const now = new Date();
  const isShowCountDown = reviewTimeObject.getTime() - now.getTime() > 0;
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);
  const [step, setStep] = useState(1);
  const [showEndGame3, setShowEndGame3] = useState(false);
  const timeLearnInDay = getCookie("timesLearn");
  const reviewState = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(reviewOperations.updateLevelWord(reviewState.listreviewed, (countLvUp)=>{
      if(countLvUp > 0){
        setShowEndGame3(true)
      }
    }));
  }, []);
    
  return (
    <div className="ending-game-container">
      <div className="ending-game-content">
        {updating && (
          <div className="updating-wrapper">
            <img src={mascot} alt="mascot" className="updating-mochi" />
            <p>
              {t("general.updateGT")} <span>{t("general.goldenTime")}</span>
            </p>
            <div className="loading-wrapper">
              <img src={fillCircle} alt="fill" />
              <img src={emptyCircle} alt="empty" />
              <img src={emptyCircle} alt="empty" />
            </div>
          </div>
        )}
        {Number(timeLearnInDay) !== 1 && !showEndGame3 && !isShowCountDown && <EndingGame1 setStep={(val) => setStep(val)} currentGame={props.currentPage} handleChangeGame={props.handleChangeGame}/>}
        {Number(timeLearnInDay) == 1 && !showEndGame3 && !isShowCountDown && (
          <EndingGame2
            setStep={(val) => setStep(val)}
            isShowCountDown={isShowCountDown}
            timeLearnInDay={timeLearnInDay}
            currentGame={props.currentPage}
            handleChangeGame={props.handleChangeGame}
          />
        )}
         {/* {Number(timeLearnInDay) === 1 && ( */}
        {Number(timeLearnInDay) !== 1 && showEndGame3 && !isShowCountDown & (
          <EndingGame3
            setStep={(val) => setStep(val)}
            isShowCountDown={isShowCountDown}
            currentGame={props.currentPage}
            handleChangeGame={props.handleChangeGame}
          />
        )}
        {Number(timeLearnInDay) !== 1 && !showEndGame3 && isShowCountDown &&(
          <EndingGame4 setStep={(val) => setStep(val)} currentGame={props.currentPage} handleChangeGame={props.handleChangeGame}/>
        )}
      </div>
    </div>
  );
}

export default EndingGame;
