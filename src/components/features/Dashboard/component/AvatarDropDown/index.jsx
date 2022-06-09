/*global chrome*/

import "./index.scss";
import cardIcon from '../../../../../assets/images/cards.png'
import trophyIcon from "../../../../../assets/images/trophy.png";
import settingsIcon from "../../../../../assets/images/settings.png";
import { useState, useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import EnterCode from "./EnterCode";
import AccSettings from "./AccSettings";
import Achievements from "./Achievements";
import FAQ from "./FAQ";


function AvatarDropDown(props) {
  let navigate = useNavigate();
  const {t} = useTranslation()
  const accountState = useSelector((state) => state.account);
  const { userToken, avatar, expiredDay, displayName } =
    accountState;
  const ORIGIN = process.env.REACT_APP_ORIGIN;
  const [page, setPage] = useState("");
  const [showDropDown,setShowDropDown] = useState(false);
  const handleClosePage = () => {
    setPage('')
    props.onClose()
  }
  return (
    <>
      <div className="dropdown-container">
        <DropDownItem
          icon={trophyIcon}
          title={t("dashboard.achievements")}
          onClick={() => setPage("achievements")}
        />
        <DropDownItem
          icon={settingsIcon}
          title={t("dashboard.accSetting")}
          onClick={() => setPage("settings")}
        />
        {userToken && <DropDownItem
          icon={cardIcon}
          title={t("dashboard.enterCode")}
          onClick={() => setPage("code")}
        />}
      </div>
      {page === "code" && <EnterCode onClose={handleClosePage} />}
      {page === "settings" && (
        <AccSettings
          onClose={handleClosePage}
          setPage={(value) => setPage(value)}
        />
      )}
      {page === "achievements" && <Achievements onClose={handleClosePage} />}
      {page === "FAQ" && <FAQ setPage={(value) => setPage(value)} />}
    </>
  );
}

export default AvatarDropDown;
const DropDownItem = (props) => {
  return (
    <div className={`ava-dropdown-item`} onClick={props.onClick}>
      <img src={props.icon} alt="icon" />
      <p>{props.title}</p>
    </div>
  );
}