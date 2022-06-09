import React, {
  Component,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import lottie from "lottie-web";
import animationDataVn from "../../../commons/lottiefiles/PageIntro/IntroVn.json";
import mp3MochiIntroVn from "../../../commons/audio/PageIntro/IntroVn.mp3";
import animationDataEn from "../../../commons/lottiefiles/PageIntro/IntroEn.json";
import mp3MochiIntroEn from "../../../commons/audio/PageIntro/IntroEn.mp3";
import PrimaryButton from "../../../commons/PrimaryButton";
import iconExit from "../images/iconExit.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga";
function Intro({ language, languageVN, className }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerOne = useRef(null);
  const [isCompleteAudio, setIsCompleteAudio] = useState(false);
  useEffect(() => {
    lottie.loadAnimation({
      name: "animationIntro",
      container: containerOne.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: language == languageVN ? animationDataVn : animationDataEn,
      isPause: true,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible") {
        if (document.querySelector("audio")) {
          document.querySelector("audio").play();
          lottie.play("animationIntro");
          // audio.current.play();
        }
      } else {
        if (document.querySelector("audio")) {
          // audio.current.pause();
          document.querySelector("audio").pause();
          lottie.pause("animationIntro");
        }
      }
    });
    if (document.querySelector("audio")) {
      document.querySelector("audio").addEventListener(
        "ended",
        function () {
          document.querySelector("audio").remove();
          setIsCompleteAudio(true);
        },
        false
      );
    }
    lottie.play("animationIntro");
  }, [document.visibilityState]);

  const handleCompleteIntro = useCallback(() => {
    window.localStorage.setItem("mc_first_access","0");
    const urlHrefLast = window.location.href[window.location.href.length - 1];
    const pathName = window.location.pathName
    if (pathName.includes('/learn')) {
      window.location.reload()
    }
    else {
      window.location.href = window.location.href + (urlHrefLast === '/' ? 'learn' : "/learn");
    }
  });
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: 'url("./images/BG_extension_2.png")',
      }}
      onMouseEnter={() => {
        lottie.play("animationIntro");
      }}
      onMouseLeave={() => {
        lottie.pause("animationIntro");
      }}
      className={className}
    >
      <audio
        src={language == languageVN ? mp3MochiIntroVn : mp3MochiIntroEn}
        autoPlay
      ></audio>
      {isCompleteAudio && (
        <PrimaryButton
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1",
          }}
          className="slim"
          onClick={() => {
            handleCompleteIntro();
            ReactGA.event({
              category: "welcome_screen",
              action: "click_start_now",
              label: "first_visit",
            });
          }}
        >
          {t("general.getStarted")}
        </PrimaryButton>
      )}
      <div
        style={{
          height: "100%",
          width: "412px",
          position: "relative",
          margin: "0 auto",
        }}
        ref={containerOne}
      >
        <img
          style={{
            position: "absolute",
            top: "24px",
            left: "46px",
            zIndex: "1",
            width: "20px",
            cursor: "pointer",
          }}
          src={iconExit}
          onClick={() => {
            handleCompleteIntro();
            ReactGA.event({
              category: "welcome_screen",
              action: "click_skip_animation",
              label: "first_visit",
            });
          }}
          alt="exit"
        ></img>
      </div>
    </div>
  );
}
export default Intro;
