/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import soundClick from "components/commons/audio/Dashboard/click.mp3";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { randomGame, shuffleArray } from "utils/helpers";
import { learnOperations } from "state/modules/learn";
function Game2(props) {
  const { word, listKanjiAnswer, listContentAnswer } = props;
  const { t } = useTranslation();
  const [showContinue, setShowContinue] = useState(false);
  const [listAnswer, setListAnswer] = useState([]);
  const dispatch = useDispatch();
  const learnState = useSelector((state) => state.learn);
  const {
    totalCorrect,
    totalGameLearn,
    countTrue,
    countFalse,
    timeStart,
    listQuestion,
    wordToLearnId,
    countIncorrect,
  } = learnState;
  useEffect(() => {
    const tempList = getListAnswer(word, listKanjiAnswer, listContentAnswer);
    const shuffledList = shuffleArray(tempList);
    setListAnswer(shuffledList);
  }, [word, listKanjiAnswer, listContentAnswer]);

  const firstRef = useRef();
  const secondRef = useRef();
  const audioRef = useRef();
  const getListAnswer = (word, listKanji, listContent) => {
    if (!!word.kanji) {
      const listRandomKanji = listKanji.filter((item) => item !== word.kanji);
      const randomKanji =
        listRandomKanji[Math.floor(Math.random() * listRandomKanji.length)];
      return [
        {
          answer: word.kanji,
          isCorrect: true,
          id: 1,
        },
        {
          answer: randomKanji,
          isCorrect: false,
          id: 2,
        },
      ];
    } else {
      const listRandomContent = listContent.filter(
        (item) => item !== word.content
      );
      const randomContent =
        listRandomContent[Math.floor(Math.random() * listRandomContent.length)];
      return [
        {
          answer: word.content,
          isCorrect: true,
          id: 1,
        },
        {
          answer: randomContent,
          isCorrect: false,
          id: 2,
        },
      ];
    }
  };
  const handleSelectAnswer = (e, isCorrect) => {
    audioRef.current.play();
    const target = e.target;
    if (!isCorrect) {
      target.classList.add("game-2-incorrect-answer");

    } else {
      target.classList.add("game-2-correct-answer");
      firstRef.current.style.pointerEvents = 'none'
      secondRef.current.style.pointerEvents = "none";

      setShowContinue(true);
    }
  };
  console.log("props.currentPage", props.currentPage);
  useEffect(() => {
    const pressEnter = (e) => {
      if (props.currentPage === 2) {
        console.log("from game 2");
        const key = e.key;
        if (key == "1") {
          firstRef.current.click();
        }
        if (key == "2") {
          secondRef.current.click();
        }
        if (key === "Enter" && showContinue) {
          handleChangeGame(word);
        }
      }
    };
    document.addEventListener("keypress", pressEnter);
    return () => {
      document.removeEventListener("keypress", pressEnter);
    };
  }, [showContinue]);
  const handleChangeGame = useCallback((word) => {
    const hasIncorrect = document.querySelector(".game-2-incorrect-answer");
    if (totalCorrect < 3 && totalGameLearn < 3) { // first time
      if (hasIncorrect) { // wrong answer 
        console.log("wrong - countFalse", countFalse); 
        dispatch(
          learnOperations.updateState({
            totalGameLearn: 2,
            totalCorrect: 1,
            countFalse: countFalse + 1,
            countIncorrect: countIncorrect + 1,
          })
        );
      } else { // right answer
        dispatch(
          learnOperations.updateState({ totalGameLearn: 2, totalCorrect: 2 })
        );
      }
      props.handleChangeGame(3);
    } else if (totalGameLearn === 3 && totalCorrect < 3) { // in random game, 
      if (hasIncorrect) { //wrong answer
        dispatch(learnOperations.updateState({ countFalse: countFalse + 1 }));
        const randomGamePage = randomGame();
        props.handleChangeGame(randomGamePage);
        console.log({ randomGamePage });
        console.log('random');
      } else { // right answer
        if (wordToLearnId < listQuestion.length - 1 && wordToLearnId >= 0) {  // not last question
          const newId = wordToLearnId + 1;
          console.log({ countTrue });
          dispatch(
            learnOperations.updateListLearned({
              word: {
                word_id: word.id,
                true: countTrue + 1,
                false: countFalse,
              },
            })
          );
          const listCorrect = localStorage.getItem("listCorrect")
            ? JSON.parse(localStorage.getItem("listCorrect"))
            : [];
          console.log({ listCorrect });
          let tempList = [...listCorrect];
          tempList.push(word.id);
          console.log({ tempList });
          localStorage.setItem("listCorrect", JSON.stringify(tempList));
          dispatch(learnOperations.restartWord(newId));
        } else { // last question
          const currentTime = new Date().getTime();
          const learnTime = currentTime - timeStart;
          dispatch(
            learnOperations.updateState({
              learnTime: learnTime,
              openEndingGame: true,
            })
          );
        }
      }
    } else {
      console.log("totalCorrect = 3");
    }
  }, []);
  return (
    <div className="game-2-container">
      <div className="game-content">
        <p className="game-title">{t("learn.chooseCorrect")}</p>
        <div className="game-2-content">
          <img
            src={word?.picture}
            alt="card-illustration"
            className="card-picture"
          />
          <p className="card-trans">
            {window.MC_LANG == "vi" ? word.trans : word.en_trans}
          </p>
          <div className="answer-wrapper">
            {listAnswer?.length > 0 &&
              listAnswer.map((item, index) => {
                return (
                  <div
                    className="select-answer"
                    key={item.id}
                    onClick={(e) => handleSelectAnswer(e, item.isCorrect)}
                    id={index === 0 ? "firstAnswer" : "secondAnswer"}
                    ref={index === 0 ? firstRef : secondRef}
                  >
                    {item.answer}
                  </div>
                );
              })}
          </div>
          <audio src={soundClick} ref={audioRef} />
        </div>
        {showContinue && (
          <PrimaryButton
            className="game-continue"
            onClick={() => handleChangeGame(word)}
          >
            {t("learn.continue")}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export default Game2;
