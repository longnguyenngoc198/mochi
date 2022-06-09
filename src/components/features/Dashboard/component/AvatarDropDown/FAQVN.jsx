/*global chrome*/

import "./index.scss";
import closeIcon from "../../../../../assets/close-info.png";
import searchIcon from "../../../../../assets/search.png";
import downIcon from "../../../../../assets/images/down.png";
import upIcon from "../../../../../assets/images/up.png";



import { useState, useEffect, useRef } from "react";
import { Col, Row, Collapse } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next'
import {listFAQVN} from './listFAQ.js'
// import PrimaryButton from "../../../commons/PrimaryButton";
function FAQVN(props) {
  const { t } = useTranslation();
  const inputRef = useRef();


  const accountState = useSelector((state) => state.account);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [listQuestion,setListQuestion] = useState(listFAQVN);
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    let newList = []
    if (value) {
      newList = listFAQVN.filter((item) => item.question.toLowerCase().includes(value));
      setListQuestion([...newList]);
    }
    else {
      setListQuestion(listFAQVN);
    }
  }
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div className="general-page-container">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="general-page-content">
          <div className="general-title-wrapper" onClick={props.onClose}>
            <img src={closeIcon} alt="close-icon" className="page-close-icon" />
            <p className="page-title">Câu hỏi thường gặp</p>
          </div>

          <div className="info-web-wrapper">
            <div className="search-bar-wrapper">
              <input
                type="text"
                ref={inputRef}
                placeholder="Nhập câu hỏi của bạn tại đây"
                onChange={handleSearch}
              />
              <img src={searchIcon} alt="search-icon" />
            </div>
            <div className="list-faq-wrapper">
              {listQuestion.map((item) => {
                return (
                  <div className="list-faq-item" key={item.index}>
                    <div
                      className="list-faq-item--title"
                      onClick={() => {
                        setActiveQuestion((prev) =>
                          prev === item.index ? "" : item.index
                        );
                      }}
                      aria-controls="example-collapse-text"
                      aria-expanded={activeQuestion === item.index}
                    >
                      <p className="list-faq-item--question">
                        {item.index}
                        {". "}
                        {item.question}
                      </p>
                      <img
                        src={activeQuestion === item.index ? upIcon : downIcon}
                        alt="arrow"
                      />
                    </div>
                    <Collapse in={activeQuestion === item.index}>
                      <div
                        id={`answer-${item.index}`}
                        className="list-faq-item--answer"
                      >
                        {item.answer}
                      </div>
                    </Collapse>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default FAQVN;
