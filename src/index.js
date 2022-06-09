import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./state/store";
import { BrowserRouter } from "react-router-dom";
import './localization'
import Helmet from 'react-helmet';
const pathName = window.location.pathname; 
const getBaseName = () => {
  if (pathName.includes('/vi')) {
    return "/vi";
  }
  else if (pathName.includes('/en')) {
    return '/en'
  }
  else {
    return process.env.REACT_APP_BASENAME;
  }
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter basename={pathName.includes('vi') ? '/vi' : '/en'}> */}
      <BrowserRouter basename={getBaseName()} forceRefresh={true}>
          {pathName.includes("/vi") && (
            <Helmet>
              <meta
                property="og:url"
                content="https://kanji-test.mochidemy.com/vi"
              />
              <meta
                property="og:title"
                content="Kanji.mochidemy.com - Học từ vựng Tiếng Nhật và Kanji với MochiMochi website"
              />
              <meta
                property="og:description"
                content="Học Kanji và từ vựng tiếng Nhật dễ dàng hơn với MochiMochi! Chinh phục 1000 từ vựng trong 1 tháng chỉ với 15' học mỗi ngày"
              />
              <meta
                property="og:image"
                content="https://kanji-test.mochidemy.com/thumbnail.png"
              />
              <meta
                name="description"
                content="Học Kanji và từ vựng tiếng Nhật dễ dàng hơn với MochiMochi! Chinh phục 1000 từ vựng trong 1 tháng chỉ với 15' học mỗi ngày"
              />
              <title>
                Kanji.mochidemy.com - Học từ vựng Tiếng Nhật và Kanji với
                MochiMochi website
              </title>
            </Helmet>
          )}
          {pathName.includes("/en") && (
            <Helmet>
              <meta
                property="og:url"
                content="https://kanji-test.mochidemy.com/en"
              />
              <meta
                property="og:title"
                content="Kanji.mochidemy.com - Learn Japanese Vocabulary and Kanji - MochiMochi Website"
              />
              <meta
                property="og:description"
                content="MochiMochi - The most joyful Kanji & Japanese vocabulary learning website, helping you memorize 1000 Kanji in just 1 month."
              />
              <meta
                property="og:image"
                content="https://kanji-test.mochidemy.com/thumbnail.png"
              />
              <meta
                name="description"
                content="MochiMochi - The most joyful Kanji & Japanese vocabulary learning website, helping you memorize 1000 Kanji in just 1 month."
              />
              <title>
                Kanji.mochidemy.com - Learn Japanese Vocabulary and Kanji -
                MochiMochi Website
              </title>
            </Helmet>
          )}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
