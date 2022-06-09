/*global chrome*/

import "./index.scss";
import { Row, Col, Spinner } from "react-bootstrap";
import ProgressBar from "components/commons/ProgressBar";
import { useEffect, useRef, useState } from "react";
import Game1 from "./components/Game1";
import Lottie from "react-lottie";
import getStarted from "components/commons/lottiefiles/GameLearn/GetStarted.json";
import StartGame from "./components/StartGame";
import Game2 from "./components/Game2";
import { useDispatch, useSelector } from "react-redux";
import Game3 from "./components/Game3";
import Game4 from "./components/Game4";
import Mobilization from "./components/Mobilization"
import Rest from "./components/Rest"
import Loading from "components/commons/Loading.jsx";
import { reviewOperations } from "state/modules/review";
import EndingGame from "./components/EndingGame";
import { getCookie, setCookie } from "utils/helpers";
const ORIGIN = process.env.REACT_APP_ORIGIN;
function GameLearn(props) {
  const dispatch = useDispatch();
  const reviewState = useSelector((state) => state.review);
  const currentPage = reviewState.array_list_game_random.length > 0? reviewState.array_list_game_random[0] : [0];
  const currentLevel = reviewState.currentLevel;
  const currentLength = reviewState.listReviewWords?.length;
  

  console.log("currentLevel", currentLevel);
  console.log("currentLength", currentLength);
  useEffect(() => {
    setTimeout(()=>{
      dispatch(reviewOperations.updateState({showMochiCauCa: true}));
      setTimeout(()=>{
        dispatch(reviewOperations.updateState({showMochiCauCa: false}));
      }, 30000)
    }, 900000)
  }, [reviewState.showMochiCauCa]);
  const startRef = useRef();
  const defaultOptions = {
    autoplay: true,
    loop: false,
    animationData: getStarted,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    let timeLearnInDay = getCookie("timesLearn");
    if (!!timeLearnInDay) {
      setCookie("timesLearn", Number(timeLearnInDay) + 1, 1);
    } else {
      setCookie("timesLearn", 1, 1);
    }
    setTimeout(() => {
      dispatch(reviewOperations.updateState({ gameLoading: true }));
      setTimeout(() => {
        dispatch(reviewOperations.updateState({ gameLoading: false }));
        if(reviewState.array_list_game_random.length > 0){
          dispatch(reviewOperations.updateState({ showStartGame: false }));
        }
      }, 1000);
    }, 2000);
  }, []);
 
  const handleChangeGame = (page) => {
    dispatch(reviewOperations.updateState({ gameLoading: true }));
    setTimeout(() => {
      dispatch(reviewOperations.updateState({ gameLoading: false }));
      // setCurrentPage(page);
    }, 800);
  };
  const handleCloseGame = () => {
    dispatch(reviewOperations.updateState({openEndingGame: true}));
    // dispatch(reviewOperations.resetGame());
  };

  const showGame = !reviewState.gameLoading && !reviewState.showMochiDongVien && !reviewState.showMochiCauCa;

  return (
    <div
      className="game-container"
      style={{
        backgroundImage:
          'url("' + ORIGIN + '/images/BG_extension_2.png")',
      }}
    >
      <div className="game-main">
        <Row>
          {reviewState.openEndingGame ? (
            <Col md={{ span: 6, offset: 3 }} className="game-main-content">
              <EndingGame currentPage={currentPage} handleChangeGame={handleChangeGame}/>
            </Col>
          ) : (
            <Col md={{ span: 6, offset: 3 }} style={{padding: "40px 0"}}  className="game-main-content">
              {currentPage !== 0 && (
                <div style={{margin: "0 40px"}}>
                  <ProgressBar
                    currentPage={currentLevel}
                    totalPage={currentLength}
                    onClose={handleCloseGame}                   
                  />
                </div>
              )}
              <div className="game-content">
                {reviewState.showStartGame && showGame &&
                 <StartGame />}
                {reviewState.gameLoading  &&  !reviewState.showMochiDongVien && !reviewState.showMochiCauCa &&<Loading />}
                {!reviewState.showStartGame && currentPage === 1 && showGame && (
                  <Game1
                  handleCloseGame={handleCloseGame}
                    handleChangeGame={(value) => handleChangeGame(value)}
                  />
                )}
                {!reviewState.showStartGame && currentPage === 2 && showGame &&(
                  <Game2
                    handleChangeGame={(value) => handleChangeGame(value)}
                    handleCloseGame ={handleCloseGame}
                  />
                )}
                {!reviewState.showStartGame && currentPage === 3 && showGame &&(
                  <Game3
                    handleChangeGame={(value) => handleChangeGame(value)}
                    handleCloseGame={handleCloseGame}
                  />
                )}
                {!reviewState.showStartGame && currentPage === 4 && showGame &&(
                  <Game4
                  handleChangeGame={(value) => handleChangeGame(value)}
                  handleCloseGame ={handleCloseGame}
                  />
                )}
                {reviewState.showMochiDongVien && (
                  <Mobilization/>
                )}
                {reviewState.showMochiCauCa && (
                  <Rest/>
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
