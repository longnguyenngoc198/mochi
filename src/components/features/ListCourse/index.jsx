/*global chrome*/
import "./styles.css";
import { useState, useEffect, useCallback } from "react";

import iconLearn from "./images/learn.png";
import closeIcon from "../../../assets/close-info.png";
import iconTarget from "./images/target.png";

import { Col, Row, Form } from "react-bootstrap";
import { learnOperations } from "../../../state/modules/learn";
import { useDispatch, useSelector } from "react-redux"
import MochiHuongDanImg from "components/commons/images/MochiHuongDan.png";
import { useTranslation } from "react-i18next";
function ListCourse(props) {
  const dispatch = useDispatch();
  const learnState = useSelector((state) => state.learn)
  const { t } = useTranslation();

  useEffect(()=>{
    dispatch(learnOperations.fetchListCourse());
  },[])

  const handleChangeCourse = useCallback((course)=>{
    dispatch(learnOperations.fetchListLesson({course_id: course.id, ...props.initFilters},
      window.MC_LANG == 'en' ? course.en_title : course.title,
      'switchCourse',
       ()=>{
      props.onClose()
      props.setFilters(props.initFilters)
      window.localStorage.setItem("id_course_active", course.id)
      window.localStorage.setItem("title_course_active", window.MC_LANG == 'en' ? course.en_title : course.title)
    }))
  })


  return (
    <div className="general-page-container">
      <Row>
        <Col  className="general-page-content" style={{maxWidth:"666px", margin: "0 auto"}}>
          <div className="general-title-wrapper"   style={{height:"60px",display: "flex",justifyContent: "center",padding: "40px 0"}}>
            {learnState.listLesson.length > 0 && (<img src={closeIcon} alt="close-icon" className="page-close-icon" onClick={props.onClose}/>)} 
            <span style={{ fontWeight: "700", fontSize: "20px" }}>
              {t("general.coursesList")}
            </span>
          </div>

          <div className="list_course__content animate__animated animate__fadeInDown">
            {learnState?.list.map((course, index) => (
            <div className="list_course__item" key={index} onClick={()=>{
              props.handlePlayAudio();
              handleChangeCourse(course)}
            }>
              <div className="list_course__item-header">
                <div className="list_course__item-header-left"></div>
                <div className="list_course__item-header-center">
                  {window.MC_LANG == 'en' ? course.en_title : course.title}
                </div>
                <div className="list_course__item-header-right"></div>
              </div>
              <div className="list_course__item-detail">
                <img src={iconTarget} alt="icon-target"></img>
                <p style={{ marginLeft: "15px" }}>{window.MC_LANG === 'en' ? course.en_outcome : course.outcome}</p>
              </div>
              <div className="list_course__item-detail">
                <img src={iconLearn} alt="icon-learn"></img>
                <p style={{ marginLeft: "15px" }}>
                {window.MC_LANG == 'en' ? course.en_description : course.description}
                </p>
              </div>
            </div>
            ))}

            <img style={{margin: '50px'}} src={MochiHuongDanImg}></img>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ListCourse;
