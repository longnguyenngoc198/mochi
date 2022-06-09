/*global chrome*/

import "./index.scss";
import closeIcon from "../../../../../assets/close-info.png";
import mochiIcon from "../../../../../assets/Mochimeow.png";

import { useState, useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {useTranslation} from 'react-i18next'
import FAQVN from "./FAQVN";
import FAQEN from "./FAQEN";
// import PrimaryButton from "../../../commons/PrimaryButton";
function FAQ(props) {
  const { t } = useTranslation();
  const accountState = useSelector((state) => state.account);

  const changeHomeMetaTag = () => {
    const title =
      window.MC_LANG === "vi"
        ? "Kanji.mochidemy.com - Học từ vựng Tiếng Nhật và Kanji với MochiMochi website"
        : "kanji.mochidemy.com - Learn Japanese Vocabulary and Kanji - MochiMochi Website";
    const description =
      window.MC_LANG === "vi"
        ? "Học Kanji và từ vựng tiếng Nhật dễ dàng hơn với MochiMochi! Chinh phục 1000 từ vựng trong 1 tháng chỉ với 15' học mỗi ngày"
        : "MochiMochi - The most joyful Kanji & Japanese vocabulary learning website, helping you memorize 1000 Kanji in just 1 month.";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);
    document.querySelector("title").innerText = title;
  };
  return (
    <>
      {window.MC_LANG === "en" && (
        <FAQEN onClose={() => {
          props.setPage("settings")
          changeHomeMetaTag()
        }} />
      )}
      {window.MC_LANG === "vi" && (
        <FAQVN onClose={() => {
          props.setPage("settings")
          changeHomeMetaTag();
        }} />
      )}
    </>
  );
}

export default FAQ;
