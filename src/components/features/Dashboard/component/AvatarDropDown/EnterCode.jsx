/*global chrome*/

import "./index.scss";
import closeIcon from "assets/close-info.png";
import mochiIcon from "assets/images/icon-code.png";
import mochiModal from "assets//mochi-chuc-mung.png";


import { useState, useEffect, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/commons/PrimaryButton";
import MainModal from "components/commons/MainModal";
import { accountOperations } from "state/modules/account/";
// import PrimaryButton from "../../../commons/PrimaryButton";
function EnterCode(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
    const [disabledBtn,setDisabledBtn] = useState(true)
    const [showModal, setShowModal] = useState(false);

  const [codeInput,setCodeInput] = useState('');
    const [error, setError] = useState("");
  
    const inputRef = useRef()
  
  const accountState = useSelector((state) => state.account);

  const { displayName, avatar, expiredDay, email, startDay, userToken } =
        accountState;
    const handleInputCode = (event) => {
        const value = event.target.value
        setCodeInput(value);
        if (value === '') {
            setDisabledBtn(true)
        }
        else {
            setDisabledBtn(false)
        }
  }
  useEffect(() => {
    inputRef.current.focus()
  },[])
  return (
    <div className="general-page-container">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="general-title-wrapper" onClick={props.onClose}>
            <img src={closeIcon} alt="close-icon" className="page-close-icon" />
            <p className="page-title">{t("dashboard.enterCode")}</p>
          </div>

          <div className="general-page-wrapper">
            <img src={mochiIcon} alt="mochi-icon" />
            <h6>
              <strong>{t("dashboard.enterMochiCode")}</strong>
            </h6>
            <div className="input-wrapper">
              <p>
                <small>*{t("general.distinguish")}</small>
              </p>
              <input
                placeholder={t("dashboard.enterYourCode")}
                type="text"
                value={codeInput}
                onChange={handleInputCode}
                ref={inputRef}
              />
              {error && (
                <p>
                  <small>*{error}</small>
                </p>
              )}
            </div>
            <PrimaryButton
              className="add-code-btn"
              disabled={disabledBtn}
              onClick={() => {
                dispatch(
                  accountOperations.enterCode(
                    { code: codeInput },
                    (status) => {
                      if (status) {
                        setShowModal(true);
                      }
                    },
                    (error) => {
                      setError(error);
                    }
                  )
                );
              }}
            >
              {t("dashboard.activeCode")}
            </PrimaryButton>
            <a
              href={
                window.MC_LANG === "en"
                  ? "https://m.me/mochiglobal"
                  : "https://m.me/mochidemy"
              }
              target="_blank"
              rel="noreferrer"
            >
              {t("general.chatMochi")}
            </a>
          </div>
        </Col>
      </Row>
      <MainModal
        mascot={mochiModal}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <div className="notify-wrapper">
          <p>
            <strong>{t("dashboard.activeSuccess")}</strong>
          </p>
          <PrimaryButton
            className="notify-btn"
            onClick={() => setShowModal(false)}
          >
            {t("general.learn")}
          </PrimaryButton>
        </div>
      </MainModal>
    </div>
  );
}

export default EnterCode;
