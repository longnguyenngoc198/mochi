/*global chrome*/
import { useCallback, useEffect, useState } from "react";
import MochiLoadingImg from "../../images/MochiLoading.svg";
import "./index.scss";
import { useTranslation } from "react-i18next";

function StartGame() {
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(()=>{
      window.requestAnimationFrame(()=>step(0));
    }, 1000)
  }, []);

  const [process, setProcess] = useState(5);

  function step(processLoadingGameReview) {
    let element = document.querySelector('.game-review__process');
    let image = document.querySelector('#game-review__process-img');
    if (processLoadingGameReview < 100 && element && image) {
      setProcess(processLoadingGameReview);
      processLoadingGameReview = processLoadingGameReview + 5;
      element.style.width = processLoadingGameReview + "%";
      image.style.marginLeft = processLoadingGameReview + "%";
      window.requestAnimationFrame(() => step(processLoadingGameReview));
    } else {
      setProcess(100);
    }
  
  }

  return (
    <div className="game-review__box-start">
      <img id="game-review__process-img" src={MochiLoadingImg} style={{ width: "130px" }}></img>
      <div className="game-review__box-process">
        <div className="game-review__process">
          <p>{process}%</p>
        </div>
      </div>
      <p className="text-description">
        {t('general.remindReview')}
      </p>
    </div>
  );
}

export default StartGame;
