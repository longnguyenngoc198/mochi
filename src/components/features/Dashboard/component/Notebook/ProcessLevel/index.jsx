/*global chrome*/

import "./index.css";
import { useState, useEffect, useCallback } from "react";
import ImgStarFill from "../images/starfill.png"
import ImgStar from "../images/star.png"
import PrimaryButton from "../../../../../commons/PrimaryButton";
import { useTranslation } from "react-i18next";
function Notebook(props) {
  const { t } = useTranslation();
  const handleChangeLevel = useCallback((level)=>{
    props.setLevelActive(level)
  })
  return (
          <div className="notebook_header">
          <div className={props.levelActive == 1 ? "notebook_header_level1 header-item notebook_header-active" : "notebook_header_level1 header-item"}
          onClick = {()=>handleChangeLevel(1)}
          >
              <p>{t("dashboard.level1")}</p>
              {props.levelActive == 1 &&(
              <div className="group-stars">
                <img src={ImgStarFill}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
              </div>
              )}
              <div className="notbook-border"></div>
            </div>
            <div className={props.levelActive == 2 ? "notebook_header_level2 header-item notebook_header-active" : "notebook_header_level2 header-item"}
             onClick = {()=>handleChangeLevel(2)}>
            <p>{t("dashboard.level2")}</p>
            {props.levelActive == 2 &&(
              <div className="group-stars">
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
              </div>
              )}
              <div className="notbook-border"></div>
            </div>
            <div className={props.levelActive == 3 ? "notebook_header_level3 header-item notebook_header-active" : "notebook_header_level3 header-item"}
             onClick = {()=>handleChangeLevel(3)}>
            <p>{t("dashboard.level3")}</p>
            {props.levelActive == 3 &&(
              <div className="group-stars">
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStar}></img>
                <img src={ImgStar}></img>
              </div>
              )}
              <div className="notbook-border"></div>
            </div>
            <div className={props.levelActive == 4 ? "notebook_header_level4 header-item notebook_header-active" : "notebook_header_level4 header-item"}
             onClick = {()=>handleChangeLevel(4)}>
            <p>{t("dashboard.level4")}</p>
            {props.levelActive == 4 &&(
              <div className="group-stars">
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStar}></img>
              </div>
              )}
              <div className="notbook-border"></div>
            </div>
            <div className={props.levelActive == 5 ? "notebook_header_level5 header-item notebook_header-active" : "notebook_header_level5 header-item"}
             onClick = {()=>handleChangeLevel(5)}>
            <p>{t("dashboard.level5")}</p>
            {props.levelActive == 5 &&(
              <div className="group-stars">
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
                <img src={ImgStarFill}></img>
              </div>
              )}
              <div className="notbook-border"></div>
            </div>
          </div>
  );
}

export default Notebook;
