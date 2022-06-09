/*global chrome*/

import "../index.scss";
import { Row, Col, ProgressBar } from "react-bootstrap";

import star1 from "assets//images/star/Gold1.gif";
import mochiIcon from "assets/Mochi-meomeo2.png";
import checkIcon from "assets/check.png";
import uncheckIcon from "assets/uncheck.png";
import notebookIcon from "assets/images/notebook-icon.png";
import { learnOperations } from "state/modules/learn";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function EndingGame2(props) {
  const dispatch = useDispatch();
  const { timeLearnInDay, isShowCountDown, setStep} = props;

  const { learnTime, listQuestion, listLearned } = useSelector((state) => state.learn);
  const { lastTimeReview } = useSelector((state) => state.review);
  

  const { t } = useTranslation();
  const [listSelected,setListSelected] = useState([2]);
  const handleToggleCheck = (id) => {
    const tempList = [...listSelected]
    let newList = []
    if (tempList.indexOf(id) >= 0) {
      newList = tempList.filter(item => item !== id)
    }
    else {
      newList = [...tempList, id]
    }
    setListSelected(newList);
  }
  useEffect(() => {
    const listCorrect = localStorage.getItem("listCorrect")
      ? JSON.parse(localStorage.getItem("listCorrect"))
      : [];
    if (listCorrect.length > 0) {
      setListSelected(listCorrect);
    } 
  },[])
  console.log({ listLearned });
  const handleSaveToNotebook = () => {
    console.log({ timeLearnInDay });
    const listLearnWord = listLearned.map((item) => {
      console.log({ item });
      const selectedWord = listQuestion.find((word) => word.id == item.word_id);
      if (selectedWord.kanji !== null) {
        return { ...item, is_kanji: 1 };
      } else {
        return { ...item, is_kanji: 0 };
      }
    });
    const listSelectedWord = listLearnWord.filter((item) =>
      listSelected.indexOf(item.id)
    );
    console.log({ listSelected });
    console.log({ listSelectedWord });
    console.log({ learnTime });
    console.log({ lastTimeReview });
    dispatch(
      learnOperations.saveWordToNotebook(
        {
          words: { words: listSelectedWord },
          time_review: learnTime,
          last_review_time: lastTimeReview,
        },
        (status) => {
          if (status) {
            if (Number(timeLearnInDay) > 1 && !isShowCountDown) {
              console.log({ listLearned });
              localStorage.setItem("listCorrect",[]);
              dispatch(
                learnOperations.updateState({
                  openEndingGame: false,
                  openGameLearn: false,
                  listQuestion: [],
                  listLearned: [],
                  wordToLearnId: 0,
                })
              );
            } else if (Number(timeLearnInDay) === 1) {
              setStep(3);
            } else if (isShowCountDown) {
              setStep(4);
            }
            
          }
        }
      )
    );
    
  }
  return (
    <div className="ending-game2-wrapper">
      <h5 className="ending-game2-title">{t("learn.selectSave")}</h5>
      <div className="list-word-wrapper">
        <img src={mochiIcon} alt="mochi" className="list-word-icon" />
        <div className="list-words">
          {listQuestion.length &&
            listQuestion.map((item) => (
              <div key={item.id} className="word-wrapper">
                <img
                  alt="check"
                  className="word-check-icon"
                  onClick={() => handleToggleCheck(item.id)}
                  src={
                    listSelected.indexOf(item.id) >= 0 ? checkIcon : uncheckIcon
                  }
                />
                <p className="word-content">{item.content}</p>
                <p className="word-trans">
                  {window.MC_LANG === "vi" ? item.trans : item.en_trans}
                </p>
              </div>
            ))}
        </div>
      </div>
      <PrimaryButton className="ending-game-btn" onClick={handleSaveToNotebook}>
        {t("learn.continue")}
      </PrimaryButton>
    </div>
  );
}

export default EndingGame2;
