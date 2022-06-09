/*global chrome*/

import "./index.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import ProcessLevel from "./ProcessLevel";
import PrimaryButton from "../../../../commons/PrimaryButton";
import Button from "../../../../commons/Button";
import SearchInput from "../../../../commons/SearchInput";
import IconTick from "../../../../commons/images/iconTick.svg";
import IconNoTick from "../../../../commons/images/iconNoTick.svg";
import { noteBookOperations } from "../../../../../state/modules/noteBook";
import MochiNotFoundImg from "assets/MochiNotFound.png";
import MochiHuongDanImg from "components/commons/images/MochiHuongDan.png";
import MochiCryImg from "assets/Mochi-cry.png";
import { useDispatch, useSelector } from "react-redux";
import MainModal from "components/commons/MainModal";
import clickAudio from "components/commons/audio/Dashboard/click.mp3"
import { useTranslation } from "react-i18next";
function Notebook(props) {
  const audioRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(()=>{
    dispatch(noteBookOperations.resetHasChange());
  },[])
  const [hasChange, setHasChange] = useState(false);
  const [levelActive, setLevelActive] = useState(1);
  const noteBookState = useSelector((state) => state.noteBook);
  const initFilters = {
    key: "",
    offset: 20,
    page_level_1: 1,
    page_level_2: 1,
    page_level_3: 1,
    page_level_4: 1,
    page_level_5: 1,
  };
  const [filters, setFilters] = useState(initFilters);
  const [isResetSearch, setIsResetSearch] = useState(true);

  useEffect(() => {
    if (filters.key !== "") {
      setIsResetSearch(true);
      dispatch(noteBookOperations.fetchSearchWord({ key: filters.key }));
    } else {
      if (isResetSearch) {
        dispatch(
          noteBookOperations.fetchListWord(initFilters, isResetSearch, () => {
            setIsResetSearch(false);
          })
        );
      } else {
        dispatch(noteBookOperations.fetchListWord(filters, isResetSearch));
      }
    }
  }, [filters]);

  // useEffect(() => {
  //     let lastUrl = window.location.href;
  //     new MutationObserver(() => {
  //       const url = window.location.href;
  //       if (url !== lastUrl && lastUrl.indexOf('notebook') != -1 ) {
  //         lastUrl = url;
  //         onUrlChange();
  //       }
  //     }).observe(document, { subtree: true, childList: true });
  // }, [noteBookState.hasChange]);


  
  const onUrlChange = useCallback(()=>{
    if(noteBookState.hasChange){
      alert("URL changed!", hasChange);
      dispatch(noteBookOperations.resetHasChange());
    }
  })

  const handleScroll = (e, filters_params) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && noteBookState["hasNextLv" + levelActive]) {
      filters_params["page_level_" + levelActive] =
        filters_params["page_level_" + levelActive] + 1;
      setFilters({ ...filters_params });
    }
  };

  const handleUpdateStatusWord = (params) => {
    handlePlayAudio();
    dispatch(noteBookOperations.updateStatusWord(params, ()=>{
      setHasChange(true);
    }));
  };

  const handleRedirect = useCallback(()=>{
    dispatch(noteBookOperations.setStatusModalConfirmNoteBook(false))
    dispatch(noteBookOperations.resetHasChange())
    navigate('/' + noteBookState.routeActive)
  })

  const handlePlayAudio = useCallback(()=>{
    audioRef.current.play();
  })

  return (
    <Row>
     <MainModal
        mascot={MochiHuongDanImg}
        show={noteBookState.isShowModalConfirmSaveNoteBook}
        handleClose={()=>{
            handlePlayAudio();
            handleRedirect();
           }
          }
      >
        
        <div style={{margin: "20px 0"}}>
          <p className="boldText">{t("general.changeList")}</p>
        </div>
        <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
          <PrimaryButton className="slim" style={{width:"180px"}}
          onClick={()=>{
            handlePlayAudio();
            dispatch(noteBookOperations.postUpdateLearnStatus({
              words: noteBookState.wordUpdateStatus
            }, ()=>{
              handleRedirect()
            }))
          }}
          >{t("general.saveChange")}</PrimaryButton>
          <PrimaryButton className="slim" style={{marginTop: '10px',width:"180px", background:'white', filter:'drop-shadow(0px 4px 0px #d3d3d3)', color:'black'}}
          onClick={()=>{
            handlePlayAudio();
            handleRedirect();
           }
          }
          >{t("general.cancel")}</PrimaryButton>
        </div>
      </MainModal>
      <Col md={{ span: 6, offset: 3 }} className="main-content-col">
        {!noteBookState.hasWord ? (
          <div className="main-content-container">
            <div className="community_container">
              <img style={{ width: "185px" }} src={MochiCryImg}></img>
              <p style={{ marginBottom: 0 }}>{t("general.noWord")}</p>
              <p style={{ marginTop: 0 }}>{t("general.needLearn")}</p>
              <PrimaryButton
                className="slim"
                onClick={() => navigate("/learn")}
              >
                {t("general.learn")}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="main-content-container">
            <ProcessLevel
              levelActive={levelActive}
              setLevelActive={setLevelActive}
            ></ProcessLevel>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SearchInput
                style={{
                  background: "rgba(242, 242, 242, 1)",
                  margin: "30px 0 30px",
                  width: "350px",
                }}
                placeholder={t("dashboard.searchWord")}
                styleInput={{ background: "rgba(242, 242, 242, 1)" }}
                onChange={(e) =>
                  setFilters({ ...filters, key: e.target.value })
                }
                value={filters.key}
              />
            </div>
            {noteBookState["list_level" + levelActive]?.length > 0 ? (
              <div
                className="notebook__scroll"
                onScroll={(e) => handleScroll(e, filters)}
              >
                {noteBookState["list_level" + levelActive]?.map(
                  (word, index) => (
                    <div
                      style={{ display: "flex", padding: "0 20px 25px" }}
                      key={index}
                    >
                      <div style={{ display: "flex", width: "40%" }}>
                        {word.review_status == 1 ? (
                          <img
                            style={{
                              width: "25px",
                              height: "25px",
                              cursor: "pointer",
                            }}
                            src={IconTick}
                            onClick={() =>
                              handleUpdateStatusWord({
                                lv: levelActive,
                                review_status: 0,
                                index: index,
                                word_id: word.id,
                              })
                            }
                          ></img>
                        ) : (
                          <img
                            style={{
                              width: "25px",
                              height: "25px",
                              cursor: "pointer",
                            }}
                            src={IconNoTick}
                            onClick={() =>
                              handleUpdateStatusWord({
                                lv: levelActive,
                                review_status: 1,
                                index: index,
                                word_id: word.id,
                              })
                            }
                          ></img>
                        )}
                        <p style={{ marginLeft: "5px" }}>{word.content}</p>
                      </div>
                      <p style={{ marginLeft: "35px", width: "30%" }}>
                        {word.kanji}
                      </p>
                      <div style={{ width: "30%" }}>
                        {" "}
                        {window.MC_LANG == "en" ? word.en_trans : word.trans}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="community_container">
                <img style={{ width: "185px" }} src={MochiNotFoundImg}></img>
                <p style={{ marginBottom: 0 }}>{t("dashboard.notFound")}</p>
              </div>
            )}
          </div>
        )}
      </Col>
      <audio src={clickAudio} ref={audioRef}></audio>
    </Row>
  );
}

export default Notebook;
