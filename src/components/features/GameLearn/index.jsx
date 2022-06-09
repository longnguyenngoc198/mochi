/*global chrome*/

import "./index.scss";
import { Row, Col, Spinner } from "react-bootstrap";
import ProgressBar from "components/commons/ProgressBar";
import { useEffect,useRef,useState } from "react";
import cheerIcon from "assets/images/cheer.gif"
import Game1 from "./components/Game1";
import Lottie from "react-lottie";
import getStarted from "components/commons/lottiefiles/GameLearn/GetStarted.json";
import Game2 from "./components/Game2";
import { useDispatch, useSelector } from "react-redux";
import Game3 from "./components/Game3";
import Loading from "components/commons/Loading.jsx";
import { learnOperations } from "state/modules/learn";
import EndingGame from "./components/EndingGame";
import { getCookie,setCookie } from "utils/helpers";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/commons/PrimaryButton";

const ORIGIN = process.env.REACT_APP_ORIGIN;
function GameLearn(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const {
    wordToLearnId,
    listKanjiAnswer,
    listContentAnswer,
    listQuestion,
    gameLoading,
    openEndingGame,
    countIncorrect,
  } = useSelector((state) => state.learn);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCheer, setShowCheer] = useState(false);
  const [wordToLearn, setWordToLearn] = useState({});
  const defaultOptions = {
    autoplay: true,
    loop: false,
    animationData: getStarted,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    let timeLearnInDay = getCookie('timesLearn')
    if (!!timeLearnInDay) {
      setCookie("timesLearn", Number(timeLearnInDay) + 1, 1);
    }
    else {
      setCookie("timesLearn", 1, 1);
    }
      setTimeout(() => {
        dispatch(learnOperations.updateState({ gameLoading: true }));
        setTimeout(() => {
          dispatch(learnOperations.updateState({ gameLoading: false }));
          setCurrentPage(1);
        }, 50);
      }, 3000);
  }, []);
  useEffect(() => {
    setWordToLearn(listQuestion[wordToLearnId]);
    if(wordToLearnId == 0) {
      setCurrentPage(0);
    }
    else {
      setCurrentPage(1);
    }
  },[wordToLearnId]);
  useEffect(() => {
     if (countIncorrect === 5) {
       setShowCheer(true)
     }
   }, [countIncorrect]);
  const handleChangeGame = (page) => {
    dispatch(learnOperations.updateState({ gameLoading: true }));
    setTimeout(() => {
      dispatch(learnOperations.updateState({ gameLoading: false }));
      setCurrentPage(page);
    }, 50)
  };
  const handleCloseGame = () => {
    dispatch(
      learnOperations.updateState({
        openGameLearn: false,
        openEndingGame: false,
        listQuestion: [],
        wordToLearnId: 0,
        listLearned: []
      })
    );
      localStorage.setItem("listCorrect", []);
  }
  
const baseName =
  "https://" +
  (ORIGIN.includes("localhost")
    ? ORIGIN + "/" + window.location.pathname.split("/")[1]
    : process.env.REACT_APP_ORIGIN);
  return (
    <div
      className="game-container "
      style={{
        backgroundImage: 'url("' + baseName + '/images/BG_extension_2.png")',
      }}
    >
      <div className="game-learn">
        <Row>
          {openEndingGame ? (
            <Col md={{ span: 6, offset: 3 }} className="game-main-content">
              <EndingGame />
            </Col>
          ) : (
            <Col md={{ span: 6, offset: 3 }} className="game-main-content">
              <ProgressBar
                currentPage={currentPage}
                totalPage={3}
                onClose={handleCloseGame}
              />
              <div className="game-content">
                {currentPage === 0 && !showCheer && (
                  <Lottie
                    isClickToPauseDisabled={false}
                    options={defaultOptions}
                    height={300}
                    width={500}
                  />
                )}
                {gameLoading && <Loading />}
                {currentPage === 1 && !showCheer && !gameLoading && (
                  <Game1
                    word={wordToLearn}
                    wordToLearnId={wordToLearnId}
                    listQuestion={listQuestion}
                    handleChangeGame={(value) => handleChangeGame(value)}
                  />
                )}
                {currentPage === 2 && !showCheer && !gameLoading && (
                  <Game2
                    word={wordToLearn}
                    listKanjiAnswer={listKanjiAnswer}
                    listContentAnswer={listContentAnswer}
                    handleChangeGame={(value) => handleChangeGame(value)}
                    currentPage={currentPage}
                  />
                )}
                {currentPage === 3 && !showCheer && !gameLoading &&   (
                  <Game3
                    word={wordToLearn}
                    handleChangeGame={(value) => handleChangeGame(value)}
                    currentPage={currentPage}
                  />
                )}
                {showCheer && (
                  <div className="cheer-wrapper">
                    <p className="cheer-title">{t("learn.keepGoing")}</p>
                    <img src={cheerIcon} className="cheer-icon" alt="cheer" />
                    <PrimaryButton
                      className="cheer-btn"
                      onClick={() => setShowCheer(false)}
                    >
                      {t("learn.continue")}
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}

export default GameLearn;
