/*global chrome*/
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "animate.css";
import { Routes, Route, Link } from "react-router-dom";
// import env from 'dotenv'
import { useSelector, useDispatch } from "react-redux";
import Home from "./components/features/Home";
import Learn from "./components/features/Dashboard/component/Learn";
import Practice from "./components/features/Dashboard/component/Practice";
import Notebook from "./components/features/Dashboard/component/Notebook";
import Community from "./components/features/Dashboard/component/Community";
import { accountOperations } from "./state/modules/account/";
import { reviewOperations } from "./state/modules/review";
import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GA, {
  debug: true,
  titleCase: false,
});
ReactGA.pageview(window.location.href);
function App() {
  const accountState = useSelector((state) => state.account);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(accountOperations.fetchProfile());
    dispatch(accountOperations.fetchWordStatistic());
    dispatch(reviewOperations.fetchReviewWords());
    dispatch(accountOperations.fetchUserGoal());
  }, []);
  return (
    <>
      <Routes>
        {/* <Route path="/intro" element={<Home />} /> */}
        <Route path="/" element={<Home />}>
          <Route path="" exact element={<Practice />} />
          <Route path="review" element={<Practice />} />
          <Route path="learn" element={<Learn />} />
          <Route path="notebook" element={<Notebook />} />
          <Route path="community" element={<Community />} />
        </Route>
        {/* <Route path="game-learn" element={<Register />} /> */}
      </Routes>
    </>
  );
}

export default App;
