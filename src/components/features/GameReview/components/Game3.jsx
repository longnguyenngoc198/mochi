/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import speaker from "assets/images/audio_icon.png";
import transIcon from "assets/images/trans_icon.png";
import ProgressBar from "components/commons/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { shuffleArray,japaneseCharacters, randomGame } from "utils/helpers";
import { learnOperations } from "state/modules/learn";
import { reviewOperations } from "state/modules/review";
import BoxAnswer from "./BoxAnswer"
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Game3(props) {
  const reviewState = useSelector((state) => state.review);
  const word  = reviewState.listGame3[0];
  const audioClickRef = useRef();
  const { t } = useTranslation();
  const learnState = useSelector((state) => state.learn);
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(true);
  const [listAnswer, setListAnswer] = useState([]);
  const [listSelected,setSelected] = useState([]);
  const [showModal,setShowModal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    resetLesson();
  }, [word]);

  const resetLesson = useCallback(()=>{
    setSubmitted(false);
    setDisabled(true);
    const content = word.content;
    const contentArr = content.split("");
    const listRandom = getListRandomCharacters(
      japaneseCharacters,
      15 - content.length
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
  })

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

  const handleCheckAnswer = useCallback((listSelected, word, learnState) => {
    audioClickRef.current.play();
    const { totalCorrect, totalGameLearn } = learnState;

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
  }, []);
  const handleSubmitAnswer = (showModal, word,learnState) => {
    resetLesson();
    audioClickRef.current.play();
      setShowModal("");
      setSelected([]);
      let isCorrect  =  showModal=="correct";

      let wordReviewd = reviewState.listreviewed.find(e=>e.word_id == word.id);
      let valueCorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.true;
      let valueIncorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.false;
      if(reviewState.listGameOriginal3.length == reviewState.listGame3.length && typeof wordReviewd?.word_id == "undefined"){
        let countCorrectGame = isCorrect ?  1 : 0;
        dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
        console.log("countCorrectGame", countCorrectGame);
      }else if(typeof wordReviewd?.word_id == "undefined"){ 
        let countCorrectGame = isCorrect ? reviewState.countCorrectGame + 1 : reviewState.countCorrectGame;
        dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
        console.log("countCorrectGame", countCorrectGame);
      }
      console.log("handleCheckOpenEndingGame", handleCheckOpenEndingGame());

      if(reviewState.listGame3.length == 1 && isCorrect){
        dispatch(
          reviewOperations.updateListReviewed({
            word: {
              word_id: word.id,
              true: isCorrect  ?  1 : 0,
              false: !isCorrect  ? 1 : 0,
              is_kanji: 0,
            },
            currentWord: {...word, isCorrect: isCorrect}
          })
        );
        if(reviewState.listGameOriginal3.length == 1){
        setTimeout(()=>{

          dispatch(reviewOperations.updateListReviewed({
            word: {
              word_id: word.id,
              true: isCorrect  ?  1 : 0,
              false: !isCorrect  ? 1 : 0,
              is_kanji: 0,
            },
            currentWord: {...word, isCorrect: isCorrect}
          }, ()=>{
            if(handleCheckOpenEndingGame()){
              dispatch(reviewOperations.updateState({openEndingGame: true}));
            }
          }));
        },1000)

        }else{
        
          if(handleCheckOpenEndingGame()){
            dispatch(reviewOperations.updateState({openEndingGame: true}));
          }
        
      }
      }else {
        if(!isCorrect){
          if(reviewState.countFalse + 1 == 5){
            dispatch(reviewOperations.updateState({showMochiDongVien: true}))
            dispatch(reviewOperations.updateState({countFalse: 0}))
          }else{
            dispatch(reviewOperations.updateState({countFalse: reviewState.countFalse + 1}))
          }
        }else{
          dispatch(reviewOperations.updateState({countFalse: 0}))
        }
      
        dispatch(
          reviewOperations.updateListReviewed({
            word: {
              word_id: word.id,
              true: isCorrect  ? valueCorrect + 1 : valueCorrect,
              false: !isCorrect  ? valueIncorrect + 1 : valueIncorrect,
              is_kanji: 0,
            },
            currentWord: {...word, isCorrect: isCorrect}
          })
        );
      }
      dispatch(reviewOperations.updateStatusGame3(isCorrect));
  }
  const getListRandomCharacters = (listCharacters, quantity) => {
    let listRandom = [];
    for (let i = 0; i < quantity; i++) {
      const random = Math.floor(Math.random() * quantity);
      listRandom.push(listCharacters[random]);
    }
    return listRandom;
  };

  const handleCheckOpenEndingGame = useCallback(()=>{
    return reviewState.listGame1.length == 0 && reviewState.listGame2.length == 0 && reviewState.listGame3.length == 1 && reviewState.listGame4.length == 0;
  })

  console.log("answerRight",  word.content);

  return (
    <>
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
      {showModal ? (
        <div>
          {/* <div className={`modal-wrapper ${showModal}`}>
            <div className="word-modal-content">
              <p className="word-content">{word.content}</p>
              <p className="word-kanji">{word.kanji}</p>
              <p className="word-trans">
                {window.MC_LANG === "vi" ? word.trans : word.en_trans}
              </p>
              <p className="word-sentience">{word.sentence}</p>
              <p className="word-trans-sentience">
                {window.MC_LANG === "vi" ? word.vi_sentence : word.en_sentence}
              </p>
            </div>
            <div className="modal-action">
              <div className="action-btn">
                <img src={speaker} alt="speaker" style={{ paddingBottom: 3 }} />
              </div>
              <div className="action-btn">
                <img src={transIcon} alt="transIcon" />
              </div>
            </div>
          </div> */}
           <div style={{ textAlign: "left"}}>
                <BoxAnswer
                  isSuccess={showModal=='correct'}
                  data={word}
                />
              </div>
          <PrimaryButton
            className="game-continue"
            onClick={() => handleSubmitAnswer(showModal, word, learnState)}
          >
            {t("learn.continue")}
          </PrimaryButton>
        </div>
      ) : (
        <PrimaryButton
          className="game-submit"
          disabled={disabled}
          onClick={() => handleCheckAnswer(listSelected, word, learnState)}
        >
          {t("learn.continue")}
        </PrimaryButton>
      )}
    </div>
    <audio src={clickAudio} ref={audioClickRef}></audio>
    </>

  );
}

export default Game3;
