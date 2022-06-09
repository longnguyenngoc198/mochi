import "./general.scss";
import closeIcon from "assets/close-info.png";
import googleIcon from "assets/google.png";
import facebookIcon from "assets/facebook.png";
import appleIcon from "assets/apple.png";
import mochiIcon from "assets/Mochimeow.png";
import mochiNotice from "assets/Mochi-thong-bao.png";
import mochiCongras from "assets/mochi-chuc-mung.png";
import clickSound from "components/commons/audio/Dashboard/click.mp3"
import { useState, useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import PrimaryButton from "../commons/PrimaryButton";
import SecondaryButton from "../commons/SecondaryButton";
import MainModal from "../commons/MainModal";
import { accountOperations } from "state/modules/account"
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import {app} from 'firebase-config.js'
import { useTranslation } from "react-i18next";
import { encodeToken, setCookie } from "utils/helpers";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";

const mochiAuth = getAuth(app);
mochiAuth.languageCode = "it";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
facebookProvider.addScope("email");
facebookProvider.setCustomParameters({
  display: "popup",
});
appleProvider.addScope("email");
appleProvider.addScope("name");
/******/
function Login(props) {
  const { t } = useTranslation();
  const audioRef= useRef()
  const [email, setEmail] = useState("");
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [selectType, setSelectType] = useState("password");
  const dispatch = useDispatch();
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
  const handleClosePage = () => {
    dispatch(accountOperations.updateState({isOpenLogin: false}));
  };
  const handleOpenRegister = () => {
    dispatch(accountOperations.updateState({ isOpenLogin: false, isOpenRegister: true }));
  };

  const handleSelectType = () => {
    setSelectType((prev) => (prev === "password" ? "text" : "password"));
  };
  const handleSubmitLogin = () => {
    audioRef.current.play();

    const disabled = errorEmail || errorPass || !email || !password;
    if (!disabled) {
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      dispatch(
        accountOperations.loginByEmail(
          data,
          (result) => {
            if (result) {
              const userToken = result.user.user_token;
              console.log({ userToken }); 
              const encodedToken = encodeToken(userToken);
              setCookie("mc_tk", encodedToken, 365);
              setShowLoginModal(true);
            }
          },
          (error, type) => {
            if (error) {
              if (type == "messages.password_fails") {
                setErrorPass(error);
              }
              if (type == "messages.email_not_exits") {
                setErrorEmail(error);
              }
            }
          }
        )
      );
    }
  };


  const getAndSaveToken = (data) => {
    dispatch(
      accountOperations.loginByThirdParty(data, (result) => {
        if (result) {
          const userToken = result.user.user_token;
          const encodedToken = encodeToken(userToken);
          setCookie("mc_tk", encodedToken, 365);
          setShowLoginModal(true);
        }
      })
    );
  };
  const handleGoogleSignIn = () => {
    audioRef.current.play()
    signInWithPopup(mochiAuth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log({ credential });
        const googleToken = credential.accessToken;
        const googleId = credential.idToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ user });
        const data = new FormData();
        data.append("email", user.email);
        data.append("name", user.displayName);
        data.append("oauth", "google");
        data.append("google_id", googleId);
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
  const handleAppleSignIn = () => {
    audioRef.current.play();

    signInWithPopup(mochiAuth, appleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = OAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const appleId = credential.idToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ user });
        const data = new FormData();
        data.append("email", user.email);
        data.append("name", user.displayName);
        data.append("oauth", "google");
        data.append("apple_id", appleId);
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

  return (
    <div className="general-page-container account-page-wrapper">
      <audio src={clickSound} ref={audioRef}/>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="account-title-wrapper">
            <img
              src={closeIcon}
              alt="close-icon"
              className="page-close-icon"
              onClick={handleClosePage}
            />
          </div>
          <div className="user-info-wrapper login-third-wrapper">
            <div className="login-third-wrapper">
              <h5>{t("info.loginToStudy")}</h5>
              <div id="my-signin2"></div>
              <SecondaryButton
                className="login-third-button google-btn"
                onClick={handleGoogleSignIn}
              >
                <img src={googleIcon} alt="google" className="google-icon" />
                <p className="login-title" id="customBtn">
                  {t("info.google")}
                </p>
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
              <SecondaryButton
                className="login-third-button apple-btn"
                onClick={handleAppleSignIn}
              >
                <img src={appleIcon} alt="google" className="apple-icon" />
                <p className="login-title">{t("info.apple")}</p>
              </SecondaryButton>
              <h5>{t("info.or").toUpperCase()}</h5>
            </div>
          </div>

          <div className="login-form-wrapper">
            <div className="email-input-wrapper">
              <input
                placeholder={t("info.enterEmail")}
                className={`form-login-input ${errorEmail && "input-warning"}`}
                onChange={handleChangeEmail}
                autoComplete="off"
              />
              {errorEmail && <p className="error-text">{errorEmail}</p>}
            </div>
            <div className="password-input-wrapper">
              <input
                placeholder={t("info.exactPass")}
                className={`form-login-input ${errorPass && "input-warning"}`}
                onChange={handleChangePass}
                type={selectType}
                autoComplete="off"
              />
              {errorPass && <p className="error-text">{errorPass}</p>}
              <p className="hide-show-btn" onClick={handleSelectType}>
                {selectType === "password" ? t("info.show") : t("info.hide")}
              </p>
            </div>
            <PrimaryButton
              className="login-button"
              disabled={
                errorEmail !== "" ||
                errorPass !== "" ||
                email === "" ||
                password === ""
              }
              onClick={handleSubmitLogin}
            >
              {t("info.login")}
            </PrimaryButton>
            <p className="forget-pass" onClick={() => setShowForgetModal(true)}>
              {t("info.forgotPass")}
            </p>
          </div>
          <p className="register-wrapper">
            {t("info.dontHaveAcc")}?{" "}
            <span className="register-btn" onClick={handleOpenRegister}>
              {t("info.createNewAcc")}
            </span>
          </p>
          <div></div>

          <img src={mochiIcon} alt="mochi-icon" className="mochi-info-icon" />
        </Col>
      </Row>
      {/* Modal login successfully */}
      <MainModal
        mascot={mochiCongras}
        show={showLoginModal}
        handleClose={() => {
          setShowLoginModal(false);
          window.location.reload()
        }}
      >
        <div className="forget-notice-wrapper">
          <p className="boldText">{t("info.loginSuccess")}</p>
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
              window.open(
                window.MC_LANG == "vi"
                  ? "https://m.me/mochidemy"
                  : "https://m.me/mochiglobal",
                "_blank"
              )
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

export default Login;
