/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import speaker from "assets/images/audio_icon.png";
import warningIcon from "assets/images/warning.png";

import speakerGif from "assets/images/speaker.gif";

import transIcon from "assets/images/trans_icon.png";
import feedbackIcon from "assets/images/feedback.png";
import thankIcon from "assets/images/icon-code.png";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { shuffleArray, japaneseCharacters, randomGame } from "utils/helpers";
import { learnOperations } from "state/modules/learn";
import MainModal from "components/commons/MainModal";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Game3(props) {
  const { word } = props;
  const audioRef = useRef();
  const { t } = useTranslation();
  const learnState = useSelector((state) => state.learn);
  const {
    totalCorrect,
    totalGameLearn,
    wordToLearnId,
    listQuestion,
    timeStart,
    countTrue,
    countFalse,
    countIncorrect,
  } = learnState;
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [listAnswer, setListAnswer] = useState([]);
  const [listSelected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState("");
  const [showSpeaker, setShowSpeaker] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [showTrans, setShowTrans] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showThank, setShowThank] = useState(false);

  const [feedbackContent, setFeedbackContent] = useState("");
  useEffect(() => {
    const content = word.content;
    console.log({ content });
    const contentArr = content.split("");
    const listRandom = getListRandomCharacters(
      japaneseCharacters,
      3
    );
    const listCharacter = [...contentArr, ...listRandom];
    const listObjectChar = listCharacter.map((item, index) => {
      return {
        id: index + 1,
        value: item,
        isSelected: false,
      };
    });
    setSelected([]);
    setListAnswer(shuffleArray(listObjectChar));
  }, []);

  const handleSelectAnswer = useCallback(
    (listAnswers, listSelected, character) => {
      const newList = listAnswers.map((item) => {
        return item.id === character.id
          ? { ...item, isSelected: true }
          : { ...item };
      });
      const selectedCharacter = character;
      selectedCharacter.isSelected = true;
      const newSelected = [...listSelected, selectedCharacter];
      setListAnswer(newList);
      setSelected(newSelected);
      setDisabled(false);
    },
    []
  );
  const handleUnselectAnswer = useCallback(
    (listAnswers, listSelected, character) => {
      const newList = listAnswers.map((item) => {
        return item.id === character.id
          ? { ...item, isSelected: false }
          : { ...item };
      });
      const unselectedCharacter = character;
      unselectedCharacter.isSelected = false;
      const newUnselected = listSelected.filter(
        (item) => item.id !== unselectedCharacter.id
      );
      setListAnswer(newList);
      setSelected(newUnselected);
      if (newUnselected.length === 0) {
        setDisabled(true);
      }
    },
    []
  );

  const handleCheckAnswer = 
    (listSelected,word) => {
      console.log({ listSelected });
      const textAnswer = listSelected.map((item) => item.value).join("");
      if (textAnswer === word.content) {
        setShowModal("correct");
        dispatch(
          learnOperations.updateState({
            totalGameLearn: totalGameLearn + 1,
            totalCorrect: totalCorrect + 1,
          })
        );
      } else {
        setShowModal("incorrect");
        dispatch(
          learnOperations.updateState({
            totalGameLearn: totalGameLearn,
            totalCorrect: totalCorrect,
          })
        );
      }
      setSubmitted(true);
    }
  const handleSubmitAnswer = useCallback((showModal, word) => {
    console.log({ totalCorrect });
    if (totalGameLearn === 2) { //first time
      if (totalCorrect === 2) { // Correct 2 first game
        if (showModal === "correct") { // Game 3 correct
          if (wordToLearnId < listQuestion.length - 1 && wordToLearnId >= 0) { // not last question
            const newId = wordToLearnId + 1;
            const listCorrect = localStorage.getItem("listCorrect")
              ? JSON.parse(localStorage.getItem("listCorrect"))
              : []; ;
            let tempList = [...listCorrect];
            tempList.push(word.id);
            localStorage.setItem("listCorrect", JSON.stringify(tempList));
            dispatch(
              learnOperations.updateListLearned({
                word: {
                  word_id: word.id,
                  true: countTrue + 1,
                  false: countFalse,
                },
              })
            );
            
            dispatch(learnOperations.restartWord(newId));
          } else {  // Last question
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
        else {  // Game 3 incorrect 
          dispatch(
            learnOperations.updateState({
              countFalse: countFalse + 1,
              countIncorrect: countIncorrect + 1,
              totalGameLearn: 3,
            })
          );
          const randomGamePage = randomGame();
           console.log({ randomGamePage });
          props.handleChangeGame(randomGamePage);
        }
      }
      else { // Game 2 incorrect
        console.log('random');
        if (showModal === "correct") {
          dispatch(
            learnOperations.updateState({
              totalCorrect: totalCorrect + 1,
              totalGameLearn: 3,
            })
          );
        }
        else {
          dispatch(
            learnOperations.updateState({
              totalCorrect: totalCorrect + 1,
              totalGameLearn: 3,
              countFalse: countFalse + 1,
            })
          );
          
        }
        const randomGamePage = randomGame();
        console.log({ randomGamePage });
        props.handleChangeGame(randomGamePage);
      }
    } else { // In random
      if (showModal === "correct") { // game random correct 
        dispatch(
          learnOperations.updateListLearned({
            word: {
              word_id: word.id,
              true: countTrue + 1,
              false: countFalse,
            },
          })
        );
        if (wordToLearnId < listQuestion.length - 1 && wordToLearnId >= 0) { // not last question
          const newId = wordToLearnId + 1;
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
      } else { // game random incorrect
        dispatch(
          learnOperations.updateState({
            countTrue: countTrue,
            countFalse: countFalse+ 1,
          })
        );
        const randomGamePage = randomGame();
        console.log({ randomGamePage });
        props.handleChangeGame(randomGamePage);
      }
    }
  },[]);
  const getListRandomCharacters = (listCharacters, quantity) => {
    let listRandom = [];
    for (let i = 0; i < quantity; i++) {
      const random = Math.floor(Math.random() * quantity);
      listRandom.push(listCharacters[random]);
    }
    return listRandom;
  };

  const getSentence = (hint,kanji) => {
    const hintArr = hint.split(kanji)
    if (hintArr.length > 0) {
      return (
        <>
          <span>{hintArr[0]} </span>
          <strong>{kanji} </strong>
          <span>{hintArr[1]}</span>
        </>
      );
    }
    else {
      return hint;
    }
  }
  const handleInputFeedback = (e) => {
    const value = e.target.value;
    setFeedbackContent(value);
  };
  const handleChangeFeedback = (e) => {
    const value = e.target.value.trim();
    setFeedbackContent(value);
  };
  const handleSendError = () => {
    const { currentLesson, currentCourse } = learnState;
    dispatch(
      learnOperations.sendError(
        {
          course: Number(currentCourse),
          lesson: Number(currentLesson),
          content: feedbackContent,
          errors: [feedbackContent],
        },
        (status) => {
          if (status) {
            if (status) {
              setFeedbackContent("");
              setShowFeedback(false);
              setShowThank(true);
            }
          }
        }
      )
    );
  };
  console.log("props.currentPage", props.currentPage);

  useEffect(() => {
    console.log("listSelected.length", listSelected.length);
    const pressEnter = (e) => {
      if (props.currentPage === 3 && (!disabled && listSelected.length > 0)) {
        console.log("from game 3");
        const key = e.key;
        if (key === "Enter") {
          handleCheckAnswer(listSelected, word);
        }
      }
    };
      
    document.addEventListener("keypress", pressEnter);
    return () => {
      document.removeEventListener("keypress", pressEnter);
    };
  },[disabled,listSelected]);
  
  useEffect(() => {
    if (showModal) {
      dragElement(document.getElementById("modal-wrapper"));
      
    }
  },[showModal])


  function dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      // if present, the header is where you move the DIV from:
      console.log(document.getElementById(elmnt.id + "-header"));
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      console.log({ elmnt });
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      // elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  return (
    <div className="game-3-container">
      <p className="game-title">{t("learn.arrange")}</p>
      <div className="game-3-content">
        <p className="card-trans">
          {window.MC_LANG == "vi" ? word.trans : word.en_trans}
        </p>
        <div className="list-answer-wrapper">
          {listSelected?.length > 0 ? (
            listSelected.map((item) => {
              return (
                <div key={item.id} className="answer-wrapper">
                  <div
                    className={`selected-character ${
                      submitted ? "submitted" : ""
                    }`}
                    onClick={() =>
                      handleUnselectAnswer(listAnswer, listSelected, item)
                    }
                  >
                    {item.value}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-answer-wrapper"></div>
          )}
        </div>
        <div className="list-characters-wrapper">
          {listAnswer?.length > 0 &&
            listAnswer.map((item) => {
              return (
                <div
                  className={`select-character ${
                    item.isSelected ? "character-selected" : ""
                  } ${submitted ? "submitted" : ""}`}
                  key={item.id}
                  onClick={() =>
                    handleSelectAnswer(listAnswer, listSelected, item)
                  }
                >
                  {item.value}
                </div>
              );
            })}
        </div>
      </div>
      <audio src={word.audio} ref={audioRef} />

      {showModal ? (
        <>
          <div
            id="modal-wrapper"
            style={{ cursor: "move", position: "absolute", zIndex:100 }}
          >
            <div
              className={`modal-wrapper ${showModal}`}
              id="modal-wrapper-header"
            >
              <div className="word-modal-content">
                <p className="word-content">{word.content}</p>
                <p className="word-kanji">{word.kanji}</p>
                <>
                  <p className="word-trans">
                    {window.MC_LANG === "vi" ? word.trans : word.en_trans}
                  </p>
                  <p className="word-sentience">
                    {getSentence(word.hint, word.kanji)}
                  </p>
                  {showTrans && (
                    <p className="word-trans-sentience">
                      {window.MC_LANG === "vi"
                        ? word.sentence_vi
                        : word.sentence_en}
                    </p>
                  )}
                </>
                <div className="result-warning-wrapper">
                  <img
                    src={warningIcon}
                    alt="warning"
                    className="result-warning-icon"
                  />
                  <span
                    className="result-warning"
                    onClick={() => setShowFeedback(true)}
                  >
                    {t("learn.report")}
                  </span>
                </div>
              </div>

              <div className="modal-action">
                {word.audio && (
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
          </div>
          <PrimaryButton
            className="game-continue"
            onClick={() => handleSubmitAnswer(showModal, word)}
          >
            {t("learn.continue")}
          </PrimaryButton>
        </>
      ) : (
        <PrimaryButton
          className="game-submit"
          disabled={disabled || listSelected.length === 0}
          onClick={() => {
            console.log({ audioRef });
            audioRef.current.play();
            handleCheckAnswer(listSelected, word);
          }}
        >
          {t("general.check")}
        </PrimaryButton>
      )}

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
      {showThank && (
        <MainModal
          show={showThank}
          mascot={thankIcon}
          handleClose={() => setShowThank(false)}
          className="feedback-modal"
        >
          <p className="thanks-message">{t("info.thankyou")}</p>
        </MainModal>
      )}
    </div>
  );
}

export default Game3;
