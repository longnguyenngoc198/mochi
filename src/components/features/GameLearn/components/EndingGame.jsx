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
  const timeLearnInDay = !!getCookie("timesLearn") ? getCookie("timesLearn") : 1 ;

    useEffect(() => {
      dispatch(
        learnOperations.finishLesson(
          {
            lesson_id: currentLesson,
            course_id: currentCourse,
            word_ids: listLearned,
            time_learn: learnTime,
          },
          (status) => {
            if (status) {
              setUpdating(false)
              dispatch(accountOperations.fetchUserGoal());
              
            }
          }
        )
      );
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
        {step === 1 && <EndingGame1 setStep={(val) => setStep(val)} />}
        {step === 2 && (
          <EndingGame2
            setStep={(val) => setStep(val)}
            isShowCountDown={isShowCountDown}
            timeLearnInDay={timeLearnInDay}
          />
        )}
        {step === 3 && Number(timeLearnInDay) === 1 && (
          <EndingGame3
            setStep={(val) => setStep(val)}
            isShowCountDown={isShowCountDown}
          />
        )}
        {step === 4 && !isShowCountDown && (
          <EndingGame4 setStep={(val) => setStep(val)} />
        )}
      </div>
    </div>
  );
}

export default EndingGame;
