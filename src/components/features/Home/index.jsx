/*global chrome*/

import Dashboard from "../Dashboard";
import PageIntro from "../PageIntro";
import { learnOperations } from "state/modules/learn";
import { useSelector } from "react-redux";
import GameLearn from "../GameLearn";
import GameReview from "../GameReview"

function Home() {
  const { openGameLearn, listQuestion } = useSelector((state) => state.learn);
  const { openGameReview, listReviewWords } = useSelector((state) => state.review);

  const showDashboard = !openGameLearn && !openGameReview;
  const showGameLearn = openGameLearn && listQuestion.length > 0;
  const showGameReview = openGameReview && listReviewWords.length > 0;
  const isFirstAccess =
    localStorage.getItem("mc_first_access") !== null
      ? localStorage.getItem("mc_first_access")
      : "1";
  return (
    <>
      {isFirstAccess == "1" ? (
        <PageIntro />
      ) : (
        <>
          {showDashboard && <Dashboard />}
          {showGameLearn && <GameLearn />}
          {showGameReview && <GameReview />}

        </>
      )}
    </>
  );
}

export default Home;
