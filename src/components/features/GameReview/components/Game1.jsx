/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "components/commons/ProgressBar";
import speaker from "assets/images/audio_icon.png";
import slow from "assets/images/sen.png";
import iconFront from "assets/images/game-1-front.png";
import iconBack from "assets/images/game-1-back.png";
import { reviewOperations } from "state/modules/review";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

import BoxAnswer from "./BoxAnswer";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Game1(props) {
  const dispatch = useDispatch();
  const word = props.word;
  const audioClickRef = useRef();
  const learnState = useSelector((state) => state.learn);
  const reviewState = useSelector((state) => state.review);
  const audioRef = useRef();
  const speakerRef = useRef();
  const slowRef = useRef();
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [isShowBoxAnswser, setIsShowBoxAnswer] = useState(false);
  const [value, setValue] = useState("");

  const currentWord = reviewState.listGame1[0];
  const answerRight = currentWord.multi_answer;
  const continueRef = useRef();
  useEffect(() => {
    setDisabled(value.trim() == "");
  }, [value]);


  const handleCheck = () => {
    audioClickRef.current.play();
    setIsShowBoxAnswer(true);
  };

  const handleNextQuestion = () => {
    audioClickRef.current.play();
    let isCorrect = value.trim() === answerRight;
    setValue("");
    setIsShowBoxAnswer(false);

    let wordReviewd = reviewState.listreviewed.find(e=>e.word_id == currentWord.id);
    let valueCorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.true;
    let valueIncorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.false;
    if(reviewState.listGameOriginal1.length == reviewState.listGame1.length && typeof wordReviewd?.word_id == "undefined"){
      let countCorrectGame = isCorrect ?  1 : 0;
      dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
    }else if(typeof wordReviewd?.word_id == "undefined"){
      let countCorrectGame = isCorrect ? reviewState.countCorrectGame + 1 : reviewState.countCorrectGame;
      dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
      
    }

    if(reviewState.listGame1.length == 1 && isCorrect){
      dispatch(
        reviewOperations.updateListReviewed({
          word: {
            word_id: currentWord.id,
            true: isCorrect  ?  1 : 0,
            false: !isCorrect  ? 1 : 0,
            is_kanji: 1,
          },
          currentWord: {...currentWord, isCorrect: isCorrect}
        })
      );
      console.log("handleCheckOpenEndingGame", handleCheckOpenEndingGame());
      if(reviewState.listGameOriginal1.length == 1){
        if(handleCheckOpenEndingGame()){
              setTimeout(()=>{
                dispatch(reviewOperations.updateListReviewed({
                  word: {
                    word_id: currentWord.id,
                    true: isCorrect  ?  1 : 0,
                    false: !isCorrect  ? 1 : 0,
                    is_kanji: 1,
                  },
                  currentWord: {...currentWord, isCorrect: isCorrect}
                }, ()=>{
              dispatch(reviewOperations.updateState({openEndingGame: true}));
            }));
          }, 1000)
            }
      }else{
            if(handleCheckOpenEndingGame()){
            dispatch(reviewOperations.updateState({openEndingGame: true}));
            }
    }
    }else{
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
            word_id: currentWord.id,
            true: isCorrect  ? valueCorrect + 1 : valueCorrect,
            false: !isCorrect  ? valueIncorrect + 1 : valueIncorrect,
            is_kanji: 1,
          },
          currentWord: {...currentWord, isCorrect: isCorrect}
        })
      );
      
      
    }
    dispatch(reviewOperations.updateStatusGame1(isCorrect));
  };
  console.log("answerRight", answerRight);

  const handleCheckOpenEndingGame = useCallback(()=>{
    return reviewState.listGame1.length == 1 && reviewState.listGame2.length == 0 && reviewState.listGame3.length == 0 && reviewState.listGame4.length == 0;
  })
  return (
    <>
      <div className="game-1-container">
        <div className="game-content">
          <div className="card-wrapper" style={{ height: "auto" }}>
            <p style={{ textAlign: "center" }}>{t("learn.typingKanji")}</p>
            <p
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 10 }}
            >
              {currentWord.kanji}
            </p>
            <input
              value={value}
              id="input-game1"
              onChange={(e) => setValue(e.target.value)}
            ></input>
          </div>
          {isShowBoxAnswser ? (
            <>
              <BoxAnswer
                isSuccess={value.trim() === answerRight}
                data={currentWord}
              />
              <div
                style={{ position: "absolute", bottom: 20, right: 0, left: 0 }}
              >
                <PrimaryButton
                  disabled={disabled}
                  className="game-continue"
                  reactRef={continueRef}
                  onClick={handleNextQuestion}
                >
                  {t("learn.continue")}
                </PrimaryButton>
              </div>
            </>
          ) : (
            <div
              style={{ position: "absolute", bottom: 20, right: 0, left: 0 }}
            >
              <PrimaryButton
                disabled={disabled}
                className="game-continue"
                reactRef={continueRef}
                onClick={handleCheck}
              >
                {t("general.check")}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    <audio src={clickAudio} ref={audioClickRef}></audio>
    </>
  );
}

export default Game1;
