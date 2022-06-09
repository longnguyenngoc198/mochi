/*global chrome*/

import "../index.scss";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "components/commons/ProgressBar";
import speaker from "assets/images/audio_icon.png";

import speakerGif from "assets/images/speaker.gif";

import slow from "assets/images/sen.png";
import feedbackIcon from "assets/images/feedback.png";
import thankIcon from "assets/images/icon-code.png";
import iconFront from "assets/images/game-1-front.png";
import iconBack from "assets/images/game-1-back.png";
import { learnOperations } from "state/modules/learn";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/commons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import MainModal from "components/commons/MainModal";
import ReactGA from "react-ga";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function Game1(props) {
  const dispatch = useDispatch();
  const word = props.word;
  const learnState = useSelector((state) => state.learn);
  const audioRef = useRef();
  const speakerRef = useRef();
  const slowRef = useRef();
  const { t } = useTranslation();
  const [flip, setFlip] = useState(null);
  const [disabled,setDisabled] = useState(true);
  const [showSpeakerGif,setShowSpeakerGif] = useState(false);
  const [showSlow, setShowSlow] = useState(false);

  const [showFeedback,setShowFeedback] = useState(false);
  const [showThank, setShowThank] = useState(false);

  const [feedbackContent, setFeedbackContent] = useState('');
  
  
  const continueRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      setFlip(true);
      setDisabled(false);
    }, 20000);
  }, []);

  const addPressClass = (selector) => {
    const buttons = document.querySelectorAll(selector);
    for (let button of buttons) {
      button.classList.add("pressed-btn");
    }
  };
  const audioContainer = (
    <div className="audio-container">
      <div
        className="round-btn speaker-icon"
        ref={speakerRef}
        onClick={() => {
          audioRef.current.playbackRate = 1;
          audioRef.current.play();
          addPressClass(".speaker-icon");
          setShowSpeakerGif(true);
          setTimeout(() => {
            setShowSpeakerGif(false);
          }, 2000);
        }}
      >
        <img
          src={showSpeakerGif ? speakerGif : speaker}
          alt="speaker"
          className={`${showSpeakerGif ? "speakerGif" : ""}`}
        />
      </div>
      <div
        className="round-btn slow-icon"
        ref={slowRef}
        onClick={() => {
          audioRef.current.playbackRate = 0.6;
          audioRef.current.play();
          setShowSlow(true);
          addPressClass(".slow-icon");
          setTimeout(() => {
            setShowSlow(false);
          }, 3000);
        }}
      >
        <img
          src={slow}
          alt="slow"
          className={`slowIcon ${showSlow ? "slowAnimation" : ""}`}
        />
      </div>
    </div>
  );

  const handleCheckLearned = (word,learnState) => {
    ReactGA.event({
      category: "flow_learn",
      action: "click_remember",
      label: "skip_game",
    });
    const {
      wordToLearnId,
      listQuestion,
      timeStart,
    } = learnState;

    dispatch(
      learnOperations.updateListLearned({
        word: {
          word_id: word.id,
          true: 1,
          false: 0,
        },
      })
    );
    if (wordToLearnId < listQuestion.length - 1 && wordToLearnId >= 0) {
      dispatch(
        learnOperations.updateState({
          gameLoading: true,
        })
      );
      const newId = wordToLearnId + 1;
      dispatch(learnOperations.restartWord(newId));
      setTimeout(() => {
        dispatch(
          learnOperations.updateState({
            gameLoading: false,
          })
        );
      },500)
    } else {
      const currentTime = new Date().getTime();
      const learnTime = currentTime - timeStart;
      dispatch(
        learnOperations.updateState({
          learnTime: learnTime,
          openEndingGame: true
        })
      );
    }
  };
  useEffect(() => {
    const pressEnter = (e) => {
      const key = e.key;
      if (key === "Enter") {
        handleChangeGame(2);
      }
    };
    if (!disabled) {
      document.addEventListener("keypress", pressEnter);
    }
    return () => {
      document.removeEventListener("keypress", pressEnter);
    };
  }, [disabled]);
  const handleChangeGame = () => {
    dispatch(
      learnOperations.updateState({ totalGameLearn: 1, totalCorrect: 1 })
    );
    props.handleChangeGame(2);
  };
  const handleInputFeedback = (e) => {
    const value = e.target.value
    setFeedbackContent(value)
  }
  const handleChangeFeedback = (e) => {
    const value = e.target.value.trim();
    setFeedbackContent(value);
  };

  const handleSendError = () => {
    const { currentLesson,currentCourse } = learnState
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
            setFeedbackContent('')
            setShowFeedback(false)
            setShowThank(true)
          }
        }
      )
    );
  }
  console.log("learnState",learnState.listLearned);
  
  return (
    <div className="game-1-container">
      <div className="game-content">
        <audio src={word?.audio} ref={audioRef} autoPlay={true} />

        <div className="card-wrapper">
          <div className={`card-inner ${flip ? "flip-card" : ""}`}>
            <div className="card-front">
              {audioContainer}
              <div
                className="card-main"
                onClick={(e) => {
                  e.persist();
                  console.log({ e });
                  setFlip(true);
                  setDisabled(false);
                }}
              >
                <div className="card-front-content">
                  <p className="card-content">{word?.content}</p>
                  <p className="card-kanji">{word?.kanji}</p>
                </div>
                <img
                  className="card-icon"
                  src={iconFront}
                  alt="icon"
                  onClick={() => {
                    setShowFeedback(true);
                    setTimeout(() => {
                      setFlip(false);
                      setDisabled(true);
                    }, 0);
                  }}
                />
              </div>
            </div>
            <div className="card-back">
              {audioContainer}
              <div className="card-main" onClick={() => setFlip(false)}>
                <div className="card-back-content">
                  <img
                    src={word?.picture}
                    alt="card-illustration"
                    className="card-picture"
                  />
                  <p className="card-trans">
                    {window.MC_LANG == "vi" ? word.trans : word.en_trans}
                  </p>
                  <img className="card-icon" src={iconBack} alt="icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <PrimaryButton
          disabled={disabled}
          className="game-continue"
          reactRef={continueRef}
          onClick={handleChangeGame}
        >
          {t("learn.continue")}
        </PrimaryButton>
        <p
          className="game-already-know"
          onClick={() => handleCheckLearned(word, learnState)}
        >
          {t("other.wordAlreadyKnow")}
        </p>
      </div>
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
          <PrimaryButton onClick={handleSendError} disabled={feedbackContent === ''}>
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

export default Game1;
