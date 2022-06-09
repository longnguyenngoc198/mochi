import React, { Component, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../../commons/lottiefiles/PageIntro/MochiHello.json";
import mp3MochiHello from '../../../commons/audio/PageIntro/MochiHello.mp3';
function MochiHello({isSelectLanguage}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{width:"300px"}}>
      {!isSelectLanguage && (
        <audio src={mp3MochiHello} autoPlay></audio>
      )}
      <Lottie isClickToPauseDisabled={false} options={defaultOptions} height={300} width={300} />
    </div>
  );
}
export default MochiHello;
