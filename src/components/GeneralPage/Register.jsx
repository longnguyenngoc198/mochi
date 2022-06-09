/*global chrome*/

import "./general.scss";
import closeIcon from "../../assets/close-info.png";
import googleIcon from "../../assets/google.png";
import facebookIcon from "../../assets/facebook.png";
import backIcon from "../../assets/back.png";
import mochiIcon from "../../assets/Mochimeow.png";
import mochiRegisterIcon from "../../assets/Mochi-meomeo2.png";

import mochiNotice from "../../assets/Mochi-thong-bao.png";
import mochiCongras from "../../assets/mochi-chuc-mung.png";

import { useState, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";

import PrimaryButton from "../commons/PrimaryButton";
import SecondaryButton from "../commons/SecondaryButton";
import MainModal from "../commons/MainModal";
import { accountOperations } from "../../state/modules/account";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import clickSound from "components/commons/audio/Dashboard/click.mp3";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { encodeToken, setCookie } from "utils/helpers";
const mochiAuth = getAuth();
mochiAuth.languageCode = "it";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
facebookProvider.addScope("user_birthday");
appleProvider.addScope("email");
appleProvider.addScope("name");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
function getParameterQuery() {
  let parameter = {};
  const params = new URLSearchParams(window.location.search);
  for (const param of params) {
    parameter[param[0]] = param[1];
  }
  return parameter;
}
function Register() {
  const { t } = useTranslation();
  const audioRef = useRef();

  const ORIGIN = process.env.REACT_APP_ORIGIN;

  const [email, setEmail] = useState("");
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tab, setTab] = useState(0);

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registerFrom, setRegisterFrom] = useState("");


  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorUsername,setErrorUsername] = useState("");
  const [errorAcc, setErrorAcc] = useState("");
  
  const dispatch = useDispatch();

  const [selectType, setSelectType] = useState("password");
  const handleChangeEmail = (event) => {
    const value = event.target.value.trim();
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (value == "" || !regex.test(value)) {
      setErrorEmail("*" + t("info.emailNotCorrect"));
    } else {
      setEmail(value);
      setErrorEmail("");
    }
  };
  const handleChangePass = (event) => {
    const value = event.target.value.trim();
    if (value == "" || value.length < 6) {
      setErrorPass("*" + t("info.passwordAtLeast"));
    } else {
      setPassword(value);
      setErrorPass("");
    }
  };
  const handleChangeUsername = (event) => {
    const value = event.target.value;
    setUsername(value);

    if (value.length < 3 || value.length > 15) {
      setErrorUsername("*"  + t("general.nameMess"));
    } else {
      setErrorUsername("");
    }
  };
  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setUsername(value);
    if (value.length < 3 || value.length > 15) {
      setErrorUsername("*" + t("general.nameMess"));
    } else {
      setErrorUsername("");
    }
  };
  const handleSelectType = () => {
    setSelectType((prev) => (prev === "password" ? "text" : "password"));
  };

  const getAndSaveToken = (data) => {
    dispatch(
      accountOperations.loginByThirdParty(data, (result) => {
        if (result) {
          const userToken = result.user.user_token;
          const encodedToken = encodeToken(userToken);
          setCookie("mc_tk", encodedToken, 365);
          setShowRegisterModal(true);
        }
      })
    );
  };

  const handleGoogleSignIn = () => {
    audioRef.current.play();

    signInWithPopup(mochiAuth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log({ credential });
        const googleToken = credential.accessToken;
        const googleId = credential.idToken;
        // The signed-in user info.
        const user = result.user;
        console.log({user});
        const data = new FormData();
        data.append("email", user.email);
        data.append("name", user.displayName);
        data.append("oauth", "google");
        data.append("google_id",googleId);
        data.append("google_token", googleToken);
        data.append("lang", "vn");
        data.append("trial_course", "1");
        getAndSaveToken(data);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
      });
  };
  const handleFacebookSignIn = () => {
    audioRef.current.play();

    signInWithPopup(mochiAuth, facebookProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const facebookToken = credential.accessToken;
        const facebookId = credential.idToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ user });
        const data = new FormData();
        const providerId = user.reloadUserInfo.providerUserInfo[0].rawId;
        data.append("email", user.email);
        data.append("name", user.displayName);
        data.append("oauth", "facebook");
        data.append("facebook_id", facebookId);
        data.append("facebook_token", facebookToken);
        data.append("lang", "vn");
        data.append("trial_course", "1");
        getAndSaveToken(data);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
      });
  };
  const handleSubmitLogin = () => {
    audioRef.current.play();

    if (!isDisableSubmit()) {
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      data.append("display_name", username);
      data.append("lang", "vn");
      data.append("trial_course", "1");

      dispatch(
        accountOperations.registerByEmail(data,async (result) => {
          if (result && result.code == 1) {
            setShowRegisterModal(true);
            setRegisterFrom('email')
          }
          else {
            const errors = result.errors
            const listErrors = Object.values(errors);
            setErrorAcc(listErrors.join('\n'));
          }
        })
      );
    }
  };
  const isDisableSubmit = () => {
    return (
      errorUsername ||
      errorEmail ||
      errorPass ||
      !email ||
      !password ||
      !username
    );
  };

  const handleClosePage = () => {
    dispatch(accountOperations.updateState({ isOpenRegister: false }));
  };
  const handleOpenLogin = () => {
    dispatch(
      accountOperations.updateState({
        isOpenLogin: true,
        isOpenRegister: false,
      })
    );
  };


  return (
    <div className="general-page-container account-page-wrapper">
      <audio src={clickSound} ref={audioRef} />
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="account-title-wrapper">
            {tab == 0 && (
              <img
                src={closeIcon}
                alt="close-icon"
                className="page-close-icon"
                onClick={handleClosePage}
              />
            )}
            {tab == 1 && (
              <img
                src={backIcon}
                alt="back-icon"
                className="page-close-icon"
                onClick={() => {
                  setTab(0);
                }}
              />
            )}
          </div>

          <div className="user-info-wrapper login-third-wrapper">
            <div className="login-third-wrapper">
              <h5>
                {tab === 0 ? t("info.howCreateAcc") : t("info.createMochiAcc")}?
              </h5>
              <img
                src={mochiRegisterIcon}
                alt="mochi"
                className="register-icon"
              />
              {tab === 0 && (
                <>
                  <SecondaryButton
                    className="login-third-button google-btn"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src={googleIcon}
                      alt="google"
                      className="google-icon"
                    />
                    <p className="login-title">{t("info.google")}</p>
                  </SecondaryButton>
                  <SecondaryButton
                    className="login-third-button facebook-btn"
                    onClick={handleFacebookSignIn}
                  >
                    <img
                      src={facebookIcon}
                      alt="google"
                      className="facebook-icon"
                    />
                    <p className="login-title">{t("info.facebook")}</p>
                  </SecondaryButton>
                  <h5>{t("info.or").toUpperCase()}</h5>
                  <SecondaryButton
                    className="login-third-button create-acc-btn"
                    onClick={() => {
                      setTab(1)
                      audioRef.current.play();

                    }}
                  >
                    <p className="register-button">
                      {t("info.createWithEmail")}
                    </p>
                  </SecondaryButton>
                </>
              )}
            </div>

            {tab === 1 && (
              <div className="register-form-wrapper">
                <div className="username-wrapper">
                  <input
                    placeholder={t("info.yourName")}
                    className={`form-login-input ${
                      errorUsername && "input-warning"
                    }`}
                    value={username}
                    onChange={handleChangeUsername}
                    onBlur={handleBlur}
                  />
                  {errorUsername && (
                    <p className="error-text">{errorUsername}</p>
                  )}
                </div>
                <div className="email-input-wrapper">
                  <input
                    placeholder={t("info.exactEmail")}
                    className={`form-login-input ${
                      errorEmail && "input-warning"
                    }`}
                    onChange={handleChangeEmail}
                  />
                  {errorEmail && <p className="error-text">{errorEmail}</p>}
                </div>
                <div className="password-input-wrapper">
                  <input
                    placeholder={t("info.createPass")}
                    className={`form-login-input ${
                      errorPass && "input-warning"
                    }`}
                    onChange={handleChangePass}
                    type={selectType}
                  />
                  {errorPass && <p className="error-text">{errorPass}</p>}
                  <p className="hide-show-btn" onClick={handleSelectType}>
                    {selectType === "password"
                      ? t("info.show")
                      : t("info.hide")}
                  </p>
                </div>
                {errorAcc && <p className="error-text">*{errorAcc}</p>}

                <PrimaryButton
                  className="login-button"
                  disabled={isDisableSubmit()}
                  onClick={handleSubmitLogin}
                >
                  {t("info.createAcc")}
                </PrimaryButton>
              </div>
            )}
            <p className="register-wrapper">
              {t("info.haveAccAlready")}{" "}
              <span className="register-btn" onClick={handleOpenLogin}>
                {t("info.login")}
              </span>
            </p>
          </div>
          <img src={mochiIcon} alt="mochi-icon" className="mochi-info-icon" />
        </Col>
      </Row>
      {/* Modal login successfully */}
      <MainModal
        mascot={mochiCongras}
        show={showRegisterModal}
        handleClose={() => {
          setShowRegisterModal(false);
          if (registerFrom === "email") {
            handleOpenLogin();
          } else {
            window.location.reload();
          }
        }}
      >
        <div className="forget-notice-wrapper">
          <p className="boldText">{t("info.createAccSuccess")}</p>
        </div>
      </MainModal>
      {/* Modal forget password */}
      <MainModal
        mascot={mochiNotice}
        show={showForgetModal}
        handleClose={() => setShowForgetModal(false)}
      >
        <div className="forget-notice-wrapper">
          <p className="boldText">{t("info.inboxChangePass")}</p>
          <PrimaryButton
            onClick={() =>
              window.open("https://learn.mochidemy.com/", "_blank")
            }
            className="inbox-button"
          >
            {t("info.inboxMochi")}
          </PrimaryButton>
        </div>
      </MainModal>
    </div>
  );
}

export default Register;
