/*global chrome*/

import "../index.scss";
import ProgressBar from "components/commons/ProgressBar";
import { reviewOperations } from "state/modules/review";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"

import BoxAnswer from "./BoxAnswer";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Game2(props) {
  const dispatch = useDispatch();
  
  const reviewState = useSelector((state) => state.review);
  const audioClickRef = useRef();
  const audioRef = useRef();
  const speakerRef = useRef();
  const slowRef = useRef();
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [isShowBoxAnswser, setIsShowBoxAnswer] = useState(false);
  const [value, setValue] = useState("");

  const currentWord = reviewState.listGame2[0];
  const listAnswer =
    window.MC_LANG == "vn"
      ? currentWord.answer_trans
      : currentWord.en_answer_trans;
  const answerRight =
    window.MC_LANG == "vn" ? currentWord.trans : currentWord.en_trans;
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
    let isCorrect = value == answerRight
    setValue("");
    setIsShowBoxAnswer(false);

    let wordReviewd = reviewState.listreviewed.find(e=>e.word_id == currentWord.id);
    let valueCorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.true;
    let valueIncorrect = typeof wordReviewd?.word_id == "undefined" ? 0 : wordReviewd.false;
    if(reviewState.listGameOriginal2.length == reviewState.listGame2.length && typeof wordReviewd?.word_id == "undefined"){
      let countCorrectGame = isCorrect ?  1 : 0;
      dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
    }else if(typeof wordReviewd?.word_id == "undefined"){
      let countCorrectGame = isCorrect ? reviewState.countCorrectGame + 1 : reviewState.countCorrectGame;
      dispatch(reviewOperations.updateState({countCorrectGame: countCorrectGame}))
    }
    console.log("handleCheckOpenEndingGame", handleCheckOpenEndingGame());
   
    if(reviewState.listGame2.length == 1 && isCorrect){
      dispatch(
        reviewOperations.updateListReviewed({
          word: {
            word_id: currentWord.id,
            true: isCorrect  ?  1 : 0,
            false: !isCorrect  ? 1 : 0,
            is_kanji: 0,
          },
          currentWord: {...currentWord, isCorrect: isCorrect}
        })
      );
      if(reviewState.listGameOriginal2.length == 1){
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
            word_id: currentWord.id,
            true: isCorrect  ? valueCorrect + 1 : valueCorrect,
            false: !isCorrect  ? valueIncorrect + 1 : valueIncorrect,
            is_kanji: 0,
          },
          currentWord: {...currentWord, isCorrect: isCorrect}
        })
      );
    }
    dispatch(reviewOperations.updateStatusGame2(isCorrect));
   
  };

  const handleRenderValueHint = useCallback(() => {
    return currentWord.hint.replace(
      currentWord.word_answer[0].answer,
      `<b>${currentWord.word_answer[0].answer}</b>`
    );
  });

  const handleCheckOpenEndingGame = useCallback(()=>{
    return reviewState.listGame1.length == 0 && reviewState.listGame2.length == 1 && reviewState.listGame3.length == 0 && reviewState.listGame4.length == 0;
  })
  console.log("answerRight", answerRight);
 
  return (
    <>
      <div className="game-1-container">
        <div className="game-content">
          <div className="card-wrapper" style={{ height: "auto" }}>
            <p style={{ textAlign: "center" }}>{t("learn.chooseMeaning")}</p>
            <div
              style={{ padding: "15px", marginBottom: "50px" }}
              readOnly
              id="input-game1"
              dangerouslySetInnerHTML={{ __html: handleRenderValueHint() }}
            ></div>
            {listAnswer.map((answer, index) => (
              <div
                key={index}
                className={
                  value == answer?.answer
                    ? "card-answer success"
                    : "card-answer"
                }
                onClick={() => {
                  if (!isShowBoxAnswser) {
                    setValue(answer?.answer);
                  }
                }}
              >
                {answer?.answer}
              </div>
            ))}
          </div>
          {isShowBoxAnswser ? (
            <>
              <div style={{ position: "absolute", top: 280, right: 0, left:0 }}>
                <BoxAnswer
                  isSuccess={value === answerRight}
                  data={currentWord}
                />
              </div>
              <PrimaryButton
                disabled={disabled}
                className="game-continue"
                reactRef={continueRef}
                onClick={handleNextQuestion}
              >
                {t("learn.continue")}
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton
              disabled={disabled}
              className="game-continue"
              reactRef={continueRef}
              onClick={handleCheck}
            >
              {t("general.check")}
            </PrimaryButton>
          )}
        </div>
      </div>
    <audio src={clickAudio} ref={audioClickRef}></audio>

    </>
  );
}

export default Game2;
