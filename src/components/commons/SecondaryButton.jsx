/*global chrome*/
import React from 'react'
import "../component.css";

function SecondaryButton({ children, style, className, onClick }) {
  return (
    <div
      className={`mochi_secondary_btn-web ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default SecondaryButton;
